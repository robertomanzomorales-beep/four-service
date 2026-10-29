# Publicación en StackCP / PHP

El sitio se genera desde los mismos componentes aprobados. No necesita un servidor Node.js en producción. El modo habitual de Vercel se conserva.

## Dependencia del formulario

PHPMailer 7.1.1, LGPL-2.1, commit `1bc1716a507a65e039d4ac9d9adebbbd0d346e15` del repositorio oficial `https://github.com/PHPMailer/PHPMailer`.

Los archivos `Exception.php`, `PHPMailer.php`, `SMTP.php` y `LICENSE` de esa versión están incluidos en `hosting/php/lib/phpmailer/`. Esta copia se incluye en el paquete de publicación.

## Compilación

`npm run build:hosting` genera `hosting-dist/production/`.

`npm run build:hosting -- --base-path /revision-fourservice` genera una copia independiente en `hosting-dist/preview/` que puede probarse dentro de una carpeta del sitio actual.

La compilación usa una copia aislada del proyecto. La ruta Node `/api/contact` se conserva en el proyecto original, y solamente la exportación estática emplea `/api/contact.php`.

Las imágenes se generan en distintos anchos sin recortar y conservando la transparencia. Los archivos PHP no guardan adjuntos: los incorporan al correo y PHP elimina el archivo temporal al finalizar la solicitud.

## Correo

El formulario utiliza el servicio PHP mail del propio alojamiento, con remitente y cabecera Sender `contacto@fourservice.cl`. Envía la solicitud a esa casilla y una confirmación al visitante. No usa las credenciales FTP ni cambia las cuentas existentes. Debe verificarse la entrega real y revisar los registros de correo del proveedor antes de dar la instalación por validada.

No se deben publicar los respaldos SQL/ZIP junto al sitio. Los respaldos del WordPress anterior permanecen fuera de `public_html`.
