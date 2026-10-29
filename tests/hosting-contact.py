"""Exercise the PHP contact route with a local mail capture; no email is sent."""
import argparse
import email
import email.policy
import http.client
import io
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
import uuid
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--php', default=shutil.which('php'))
parser.add_argument('--extension-dir')
args = parser.parse_args()
if not args.php:
    raise SystemExit('A PHP CLI is required.')
root = Path(__file__).resolve().parents[1]

with tempfile.TemporaryDirectory(prefix='four-contact-test-') as folder:
    temporary = Path(folder)
    capture = temporary / 'mail'
    capture.mkdir()
    mock = temporary / 'capture-mail.py'
    mock.write_text('''import email, email.policy, os, pathlib, sys, time
p=pathlib.Path(os.environ['FOUR_MAIL_CAPTURE'])
message=sys.stdin.buffer.read()
parsed=email.message_from_bytes(message, policy=email.policy.default)
if (p/'fail-all').exists() or ((p/'fail-confirmation').exists() and str(parsed['Subject']).startswith('Hemos recibido')):
 sys.exit(1)
(p/(str(time.time_ns())+'.eml')).write_bytes(message)
''')
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    command = [args.php, '-n']
    if args.extension_dir:
        command += ['-d', 'extension_dir=' + args.extension_dir]
        for module in ['ctype', 'fileinfo', 'mbstring', 'zip']:
            command += ['-d', 'extension=' + module + '.so']
    command += ['-d', 'upload_max_filesize=8M', '-d', 'post_max_size=10M',
                '-d', 'sys_temp_dir=' + str(temporary),
                '-d', 'sendmail_path=' + shutil.which('python') + ' ' + str(mock),
                '-S', '127.0.0.1:' + str(port), '-t', str(root / 'hosting/php')]
    env = dict(os.environ, FOUR_MAIL_CAPTURE=str(capture))
    log = (temporary / 'server.log').open('wb')
    server = subprocess.Popen(command, env=env, stdout=log, stderr=log)

    def request(fields=None, file=None, method='POST', origin=None):
        boundary = '----FourTest' + uuid.uuid4().hex
        body = bytearray()
        for key, value in (fields or {}).items():
            body.extend(('--' + boundary + '\r\nContent-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n').encode())
        if file:
            name, mime, content = file
            body.extend(('--' + boundary + '\r\nContent-Disposition: form-data; name="attachment"; filename="' + name + '"\r\nContent-Type: ' + mime + '\r\n\r\n').encode())
            body.extend(content)
            body.extend(b'\r\n')
        body.extend(('--' + boundary + '--\r\n').encode())
        headers = {'Content-Type': 'multipart/form-data; boundary=' + boundary}
        if origin: headers['Origin'] = origin
        connection = http.client.HTTPConnection('127.0.0.1', port, timeout=10)
        connection.request(method, '/api/contact.php', bytes(body), headers)
        response = connection.getresponse()
        status, content = response.status, response.read()
        connection.close()
        try: return status, json.loads(content)
        except ValueError: raise AssertionError('Invalid JSON from PHP: ' + content[:300].decode(errors='replace'))

    checks = []

    def expect(label, status, fields=None, file=None, method='POST', origin=None):
        actual, body = request(fields, file, method, origin)
        assert actual == status, (label, actual, body)
        checks.append(label)
        return body

    valid = {'name': '<script>Prueba</script>', 'lastName': 'Técnica', 'position': 'Validación',
             'company': 'Empresa de prueba local', 'email': 'visitante@example.com',
             'phone': '+56 9 0000 0000', 'service': 'Obras civiles', 'location': 'Calama',
             'message': 'Validación local, sin envío real de correos.', 'consent': 'on'}
    try:
        for attempt in range(50):
            if server.poll() is not None:
                raise AssertionError('PHP server failed: ' + (temporary / 'server.log').read_text())
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=.1): break
            except OSError: time.sleep(.1)

        expect('GET is rejected', 405, method='GET')
        expect('Required fields', 400)
        expect('Invalid email', 400, dict(valid, email='invalid'))
        expect('Consent required', 400, dict(valid, consent=''))
        expect('Cross-origin request rejected', 403, valid, origin='https://invalid.example')
        expect('Honeypot does not send', 200, {'website': 'bot'})
        assert not list(capture.glob('*.eml'))
        expect('Disguised executable rejected', 400, valid, ('photo.png', 'image/png', b'<?php echo 1;'))
        invalid_docx = io.BytesIO()
        with zipfile.ZipFile(invalid_docx, 'w') as archive: archive.writestr('readme.txt', 'not a document')
        expect('Invalid Word archive rejected', 400, valid, ('document.docx', 'application/zip', invalid_docx.getvalue()))
        expect('Eight megabyte limit', 400, valid, ('large.pdf', 'application/pdf', b'%PDF-1.4\n' + b'a' * (8 * 1024 * 1024)))
        pdf = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n'
        result = expect('PDF notification and confirmation', 200, valid, ('antecedentes.pdf', 'application/pdf', pdf))
        assert result == {'success': True, 'confirmationSent': True}
        messages = [email.message_from_bytes(p.read_bytes(), policy=email.policy.default) for p in sorted(capture.glob('*.eml'))]
        assert len(messages) == 2
        notification, confirmation = messages
        assert notification['To'] == 'contacto@fourservice.cl'
        assert notification['Reply-To'] == 'visitante@example.com'
        assert notification['Sender'] == 'contacto@fourservice.cl'
        html = notification.get_body(preferencelist=('html',)).get_content()
        assert '&lt;script&gt;Prueba&lt;/script&gt;' in html and '<script>Prueba</script>' not in html
        attachment = list(notification.iter_attachments())
        assert len(attachment) == 1 and attachment[0].get_payload(decode=True) == pdf
        assert attachment[0].get_filename() == 'antecedentes.pdf'
        assert confirmation['To'] == 'visitante@example.com'
        assert confirmation['Auto-Submitted'] == 'auto-replied'
        checks += ['MIME attachment preserved', 'Headers and recipients correct', 'HTML escaped']

        (capture / 'fail-confirmation').touch()
        result = expect('Confirmation failure does not duplicate requests', 200, valid)
        assert result == {'success': True, 'confirmationSent': False}
        (capture / 'fail-confirmation').unlink()
        (capture / 'fail-all').touch()
        expect('Delivery failure is not reported as success', 503, valid)
        (capture / 'fail-all').unlink()
        expect('Subsequent valid request', 200, valid)
        expect('Fifth submission allowed', 200, valid)
        expect('Submission rate limited', 429, valid)
        print(json.dumps({'passed': len(checks), 'checks': checks, 'real_emails_sent': 0}, ensure_ascii=False))
    finally:
        server.terminate()
        try: server.wait(timeout=5)
        except subprocess.TimeoutExpired: server.kill(); server.wait()
        log.close()
