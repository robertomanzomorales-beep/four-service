import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const allowedFileTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

function getValue(
  formData: FormData,
  field: string
) {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const website = getValue(formData, "website");

    if (website) {
      return NextResponse.json({ success: true });
    }

    const name = getValue(formData, "name");
    const lastName = getValue(formData, "lastName");
    const position = getValue(formData, "position");
    const company = getValue(formData, "company");
    const email = getValue(formData, "email");
    const phone = getValue(formData, "phone");
    const service = getValue(formData, "service");
    const location = getValue(formData, "location");
    const message = getValue(formData, "message");
    const consent = getValue(formData, "consent");

    if (
      !name ||
      !lastName ||
      !company ||
      !email ||
      !phone ||
      !service ||
      !location ||
      !message ||
      consent !== "on"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan campos obligatorios.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Correo electrónico inválido.",
        },
        { status: 400 }
      );
    }

    const attachmentValue =
      formData.get("attachment");

    let attachment:
      | {
          filename: string;
          content: Buffer;
          contentType: string;
        }
      | undefined;

    if (
      attachmentValue instanceof File &&
      attachmentValue.size > 0
    ) {
      if (attachmentValue.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message:
              "El archivo supera el máximo de 8 MB.",
          },
          { status: 400 }
        );
      }

      if (!allowedFileTypes.has(attachmentValue.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "El formato del archivo no está permitido.",
          },
          { status: 400 }
        );
      }

      const fileBuffer = Buffer.from(
        await attachmentValue.arrayBuffer()
      );

      attachment = {
        filename:
          attachmentValue.name || "antecedentes",
        content: fileBuffer,
        contentType: attachmentValue.type,
      };
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(
      process.env.SMTP_PORT ?? "465"
    );
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword
    ) {
      console.error(
        "Faltan variables de configuración SMTP."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "El servicio de correo no está configurado.",
        },
        { status: 500 }
      );
    }

    const secure =
      process.env.SMTP_SECURE === "true" ||
      smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        minVersion: "TLSv1.2",
      },
    });

    const recipient =
      process.env.CONTACT_RECIPIENT ??
      "contacto@fourservice.cl";

    const fromName =
      process.env.SMTP_FROM_NAME ??
      "Four Service";

    const fromEmail =
      process.env.SMTP_FROM_EMAIL ??
      smtpUser;

    const fullName = `${name} ${lastName}`;

    const internalHtml = `
      <div style="font-family:Arial,sans-serif;color:#0b193b;line-height:1.6">
        <h2 style="color:#1e50ff">Nueva solicitud desde fourservice.cl</h2>

        <p><strong>Nombre:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Cargo:</strong> ${escapeHtml(position || "No informado")}</p>
        <p><strong>Empresa o institución:</strong> ${escapeHtml(company)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(service)}</p>
        <p><strong>Región o comuna:</strong> ${escapeHtml(location)}</p>

        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipient,
      replyTo: email,
      subject: `Nueva solicitud web · ${company}`,
      html: internalHtml,
      attachments: attachment
        ? [attachment]
        : undefined,
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      replyTo: recipient,
      subject:
        "Hemos recibido su solicitud · Four Service",
      html: `
        <div style="font-family:Arial,sans-serif;color:#0b193b;line-height:1.7">
          <h2 style="color:#1e50ff">Solicitud recibida</h2>

          <p>Estimado/a ${escapeHtml(name)}:</p>

          <p>
            Hemos recibido correctamente su solicitud relacionada
            con <strong>${escapeHtml(service)}</strong>.
          </p>

          <p>
            Nuestro equipo revisará los antecedentes enviados para
            entregar una respuesta técnica y comercial adecuada.
          </p>

          <p>
            Saludos cordiales,<br>
            <strong>Four Service</strong><br>
            contacto@fourservice.cl<br>
            +56 9 5363 8228
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Error al procesar formulario:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "No fue posible procesar la solicitud.",
      },
      { status: 500 }
    );
  }
}