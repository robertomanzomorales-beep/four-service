<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function field(string $name, int $maxLength = 300): string
{
    $value = isset($_POST[$name]) && is_string($_POST[$name]) ? trim($_POST[$name]) : '';
    if (strlen($value) > $maxLength || strpos($value, "\0") !== false) {
        respond(400, ['success' => false, 'message' => 'Revise los campos del formulario.']);
    }
    return $value;
}

function escaped(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function checkRateLimit(): void
{
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . '/fourservice-contact-' . substr(hash('sha256', __DIR__), 0, 16);
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        respond(503, ['success' => false, 'message' => 'Inténtelo nuevamente más tarde.']);
    }
    $key = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $handle = @fopen($directory . '/' . $key, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        respond(503, ['success' => false, 'message' => 'Inténtelo nuevamente más tarde.']);
    }
    $record = json_decode((string) stream_get_contents($handle), true);
    $now = time();
    $times = is_array($record) ? array_values(array_filter($record, function ($time) use ($now) {
        return is_int($time) && $time > $now - 600;
    })) : [];
    if (count($times) >= 5) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: 600');
        respond(429, ['success' => false, 'message' => 'Espere unos minutos antes de enviar otra solicitud.']);
    }
    $times[] = $now;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, (string) json_encode($times));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function newMailer(): PHPMailer
{
    $mailer = new PHPMailer(true);
    $mailer->isMail();
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;
    $mailer->setFrom('contacto@fourservice.cl', 'Four Service');
    $mailer->Sender = 'contacto@fourservice.cl';
    $mailer->addCustomHeader('Sender', 'contacto@fourservice.cl');
    $mailer->isHTML(true);
    return $mailer;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Método no permitido.']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 10 * 1024 * 1024) {
    respond(413, ['success' => false, 'message' => 'El archivo supera el máximo de 8 MB.']);
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
$requestHost = strtolower(explode(':', (string) ($_SERVER['HTTP_HOST'] ?? ''))[0]);
if (($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== $requestHost)
    || ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') {
    respond(403, ['success' => false, 'message' => 'Origen no permitido.']);
}

if (field('website') !== '') {
    respond(200, ['success' => true, 'confirmationSent' => true]);
}

$name = field('name', 200);
$lastName = field('lastName', 200);
$position = field('position', 300);
$company = field('company', 400);
$email = field('email', 254);
$phone = field('phone', 100);
$service = field('service', 300);
$location = field('location', 300);
$message = field('message', 15000);
$consent = field('consent', 20);

foreach ([$name, $lastName, $company, $email, $phone, $service, $location, $message] as $required) {
    if ($required === '') respond(400, ['success' => false, 'message' => 'Faltan campos obligatorios.']);
}
if ($consent !== 'on') respond(400, ['success' => false, 'message' => 'Debe autorizar el uso de sus antecedentes.']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    respond(400, ['success' => false, 'message' => 'Correo electrónico inválido.']);
}

$allowedServices = [
    'Mantención de infraestructura industrial', 'Obras civiles',
    'Mantenimiento de equipos médicos y área dental', 'Transporte de personal',
    'Importaciones y abastecimiento técnico', 'Otro requerimiento',
];
if (!in_array($service, $allowedServices, true)) {
    respond(400, ['success' => false, 'message' => 'Seleccione un servicio válido.']);
}

$attachment = null;
if (isset($_FILES['attachment']) && is_array($_FILES['attachment'])) {
    $file = $_FILES['attachment'];
    $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($error !== UPLOAD_ERR_NO_FILE) {
        if ($error !== UPLOAD_ERR_OK || !isset($file['tmp_name'], $file['name'], $file['size'])
            || !is_string($file['tmp_name']) || !is_string($file['name']) || !is_uploaded_file($file['tmp_name'])) {
            respond(400, ['success' => false, 'message' => 'No fue posible recibir el archivo. Máximo permitido: 8 MB.']);
        }
        if ((int) $file['size'] > 8 * 1024 * 1024) {
            respond(400, ['success' => false, 'message' => 'El archivo supera el máximo de 8 MB.']);
        }
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $types = [
            'pdf' => ['application/pdf'],
            'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'],
            'doc' => ['application/msword', 'application/x-ole-storage', 'application/CDFV2'],
            'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
        ];
        if (!isset($types[$extension]) || !in_array($mime, $types[$extension], true)) {
            respond(400, ['success' => false, 'message' => 'El formato del archivo no está permitido.']);
        }
        if ($extension === 'docx' && $mime === 'application/zip') {
            if (!class_exists('ZipArchive')) respond(400, ['success' => false, 'message' => 'Adjunte el documento en formato PDF.']);
            $zip = new ZipArchive();
            if ($zip->open($file['tmp_name']) !== true || $zip->locateName('word/document.xml') === false
                || $zip->locateName('[Content_Types].xml') === false) {
                respond(400, ['success' => false, 'message' => 'El documento Word no es válido.']);
            }
            $zip->close();
        }
        $filename = basename(str_replace('\\', '/', $file['name']));
        $filename = preg_replace('/[\x00-\x1F\x7F]/', '', $filename);
        $attachment = ['path' => $file['tmp_name'], 'name' => substr((string) $filename, 0, 180), 'mime' => $mime];
    }
}

checkRateLimit();
require_once __DIR__ . '/../lib/phpmailer/Exception.php';
require_once __DIR__ . '/../lib/phpmailer/PHPMailer.php';
require_once __DIR__ . '/../lib/phpmailer/SMTP.php';

try {
    $notification = newMailer();
    $notification->addAddress('contacto@fourservice.cl');
    $notification->addReplyTo($email);
    $notification->Subject = 'Nueva solicitud web · ' . preg_replace('/[\r\n]+/', ' ', $company);
    $details = [
        'Nombre' => $name . ' ' . $lastName, 'Cargo' => $position !== '' ? $position : 'No informado',
        'Empresa o institución' => $company, 'Correo' => $email, 'Teléfono' => $phone,
        'Servicio' => $service, 'Región o comuna' => $location,
    ];
    $body = '<div style="font-family:Arial,sans-serif;color:#0b193b;line-height:1.7"><h2 style="color:#1e50ff">Nueva solicitud desde fourservice.cl</h2>';
    $plain = "Nueva solicitud desde fourservice.cl\n\n";
    foreach ($details as $label => $value) {
        $body .= '<p><strong>' . escaped($label) . ':</strong> ' . escaped($value) . '</p>';
        $plain .= $label . ': ' . $value . "\n";
    }
    $body .= '<p><strong>Mensaje:</strong></p><p>' . nl2br(escaped($message)) . '</p></div>';
    $notification->Body = $body;
    $notification->AltBody = $plain . "\nMensaje:\n" . $message;
    if ($attachment !== null) $notification->addAttachment($attachment['path'], $attachment['name'], PHPMailer::ENCODING_BASE64, $attachment['mime']);
    $notification->send();
} catch (Throwable $error) {
    error_log('Four Service: no fue posible entregar la notificación web al servicio de correo.');
    respond(503, ['success' => false, 'message' => 'No fue posible enviar la solicitud. Inténtelo nuevamente.']);
}

$confirmationSent = false;
try {
    $confirmation = newMailer();
    $confirmation->addAddress($email);
    $confirmation->addReplyTo('contacto@fourservice.cl');
    $confirmation->addCustomHeader('Auto-Submitted', 'auto-replied');
    $confirmation->addCustomHeader('X-Auto-Response-Suppress', 'All');
    $confirmation->Subject = 'Hemos recibido su solicitud · Four Service';
    $confirmation->Body = '<div style="font-family:Arial,sans-serif;color:#0b193b;line-height:1.7"><h2 style="color:#1e50ff">Solicitud recibida</h2><p>Estimado/a ' . escaped($name) . ':</p><p>Hemos recibido correctamente su solicitud relacionada con <strong>' . escaped($service) . '</strong>.</p><p>Nuestro equipo revisará los antecedentes enviados para entregar una respuesta técnica y comercial adecuada.</p><p>Saludos cordiales,<br><strong>Four Service</strong><br>contacto@fourservice.cl<br>+56 9 5363 8228</p></div>';
    $confirmation->AltBody = 'Estimado/a ' . $name . ":\n\nHemos recibido correctamente su solicitud relacionada con " . $service . ". Nuestro equipo revisará los antecedentes enviados.\n\nFour Service\ncontacto@fourservice.cl\n+56 9 5363 8228";
    $confirmation->send();
    $confirmationSent = true;
} catch (Throwable $error) {
    // The request has already reached Four Service. Avoid duplicate submissions.
    error_log('Four Service: notificación recibida; no fue posible enviar la confirmación al visitante.');
}
respond(200, ['success' => true, 'confirmationSent' => $confirmationSent]);
