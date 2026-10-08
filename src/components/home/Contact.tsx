"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import Reveal from "@/components/ui/Reveal";
import styles from "./Contact.module.css";

type FormStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";

const whatsappUrl =
  "https://wa.me/56953638228?text=" +
  encodeURIComponent(
    "Hola, quisiera solicitar información sobre los servicios de Four Service."
  );

export default function Contact() {
  const [status, setStatus] =
    useState<FormStatus>("idle");

  const [fileName, setFileName] =
    useState("PDF, Word o imagen · máximo 8 MB");

  const handleFile = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setFileName(
      file
        ? file.name
        : "PDF, Word o imagen · máximo 8 MB"
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("No fue posible enviar el formulario.");
      }

      form.reset();
      setFileName("PDF, Word o imagen · máximo 8 MB");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contacto"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <div className={styles.sectionLabel}>
              <span aria-hidden="true" />
              <p>CONTACTO</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.sectionDescriptor}>
              ATENCIÓN A NIVEL NACIONAL
            </p>
          </Reveal>
        </div>

        <div className={styles.introduction}>
          <Reveal
            className={styles.titleColumn}
            direction="right"
          >
            <p className={styles.eyebrow}>
              HABLEMOS DE SU REQUERIMIENTO
            </p>

            <h2 id="contact-title">
              Conversemos sobre su próximo proyecto
            </h2>
          </Reveal>

          <Reveal
            className={styles.introText}
            direction="left"
            delay={120}
          >
            <p>
              Cuéntenos qué necesita su institución o empresa.
              Nuestro equipo revisará los antecedentes para entregar
              una respuesta técnica y comercial adecuada.
            </p>
          </Reveal>
        </div>

        <div className={styles.contactGrid}>
          <Reveal
            className={styles.informationReveal}
            direction="right"
            distance={42}
          >
            <div className={styles.informationPanel}>
              <Image
                src="/images/hero/ubicacion-calama-hero.webp"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 42vw"
                className={styles.backgroundImage}
              />

              <div
                className={styles.imageOverlay}
                aria-hidden="true"
              />

              <div className={styles.informationContent}>
                <div>
                  <p className={styles.informationEyebrow}>
                    FOUR SERVICE
                  </p>

                  <h3>
                    Atención técnica y comercial para cada operación
                  </h3>

                  <p className={styles.informationDescription}>
                    Puede contactarnos directamente o enviar los
                    antecedentes mediante el formulario.
                  </p>
                </div>

                <dl className={styles.contactDetails}>
                  <div>
                    <dt>Correo</dt>
                    <dd>
                      <a href="mailto:contacto@fourservice.cl">
                        contacto@fourservice.cl
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt>Teléfono y WhatsApp</dt>
                    <dd>
                      <a href="tel:+56953638228">
                        +56 9 5363 8228
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt>Sede Santiago</dt>
                    <dd>
                      Santa Magdalena 75, Oficina 304,
                      Providencia
                    </dd>
                  </div>

                  <div>
                    <dt>Sede Calama</dt>
                    <dd>
                      Huaytiquina 1849, Calama
                    </dd>
                  </div>
                </dl>

                <a
                  className={styles.whatsappButton}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversar por WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal
            className={styles.formReveal}
            direction="left"
            delay={110}
            distance={42}
          >
            <div className={styles.formPanel}>
              <div className={styles.formHeading}>
                <p>SOLICITUD DE CONTACTO</p>

                <h3>
                  Envíenos los antecedentes de su requerimiento
                </h3>
              </div>

              <form
                className={styles.form}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <div
                  className={styles.honeypot}
                  aria-hidden="true"
                >
                  <label htmlFor="website">
                    Sitio web
                  </label>

                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span>Nombre</span>

                    <input
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Apellido</span>

                    <input
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Cargo</span>

                    <input
                      name="position"
                      type="text"
                      autoComplete="organization-title"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Empresa o institución</span>

                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Correo electrónico</span>

                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Teléfono</span>

                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                  </label>

                  <label
                    className={`${styles.field} ${styles.fullField}`}
                  >
                    <span>Servicio de interés</span>

                    <select
                      name="service"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Seleccione un servicio
                      </option>

                      <option value="Mantención de infraestructura industrial">
                        Mantención de infraestructura industrial
                      </option>

                      <option value="Obras civiles">
                        Obras civiles
                      </option>

                      <option value="Mantenimiento de equipos médicos y área dental">
                        Mantenimiento de equipos médicos y área dental
                      </option>

                      <option value="Transporte de personal">
                        Transporte de personal
                      </option>

                      <option value="Importaciones y abastecimiento técnico">
                        Importaciones y abastecimiento técnico
                      </option>

                      <option value="Otro requerimiento">
                        Otro requerimiento
                      </option>
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>Región o comuna</span>

                    <input
                      name="location"
                      type="text"
                      autoComplete="address-level2"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Adjuntar antecedentes</span>

                    <span className={styles.fileField}>
                      <input
                        name="attachment"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFile}
                      />

                      <span>{fileName}</span>
                    </span>
                  </label>

                  <label
                    className={`${styles.field} ${styles.fullField}`}
                  >
                    <span>Mensaje o requerimiento</span>

                    <textarea
                      name="message"
                      rows={6}
                      required
                    />
                  </label>
                </div>

                <label className={styles.consent}>
                  <input
                    name="consent"
                    type="checkbox"
                    required
                  />

                  <span>
                    Autorizo a Four Service a utilizar estos
                    antecedentes exclusivamente para responder mi
                    solicitud de contacto.
                  </span>
                </label>

                <div className={styles.submitArea}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending"
                      ? "Enviando solicitud..."
                      : "Enviar solicitud"}
                  </button>

                  <p
                    className={styles.formStatus}
                    data-status={status}
                    aria-live="polite"
                  >
                    {status === "success" &&
                      "Su solicitud fue enviada correctamente. También recibirá una confirmación por correo."}

                    {status === "error" &&
                      "No fue posible enviar la solicitud. Inténtelo nuevamente o escríbanos directamente."}
                  </p>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
