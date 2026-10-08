import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import styles from "./About.module.css";

const credentials = [
  {
    number: "01",
    title: "Sello 40 Horas",
    description:
      "Reconocimiento asociado a la implementación anticipada de la jornada laboral y a una cultura organizacional responsable.",
  },
  {
    number: "02",
    title: "Sello Empresa Mujer",
    description:
      "Distintivo institucional que forma parte del respaldo corporativo de Four Service.",
  },
];

export default function About() {
  return (
    <section
      id="nosotros"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className={styles.backgroundDetail} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <div className={styles.sectionLabel}>
              <span>01</span>
              <p>QUIÉNES SOMOS</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className={styles.sectionDescriptor}>
              EXPERIENCIA · CAPACIDAD TÉCNICA · COMPROMISO
            </p>
          </Reveal>
        </div>

        <div className={styles.mainGrid}>
          <Reveal
            className={styles.mediaColumn}
            direction="right"
            distance={45}
          >
            <div className={styles.imageFrame}>
              <Image
                src="/images/hero/40-horas-hero.webp"
                alt="Profesional de Four Service trabajando en terreno"
                fill
                sizes="(max-width: 820px) 100vw, 46vw"
                className={styles.image}
              />

              <div className={styles.imageOverlay} aria-hidden="true" />

              <div className={styles.imageTag}>
                EXPERIENCIA EN TERRENO
              </div>
            </div>

            <div className={styles.locationCard}>
              <span className={styles.locationLine} />

              <div>
                <small>COBERTURA OPERATIVA</small>
                <strong>A nivel nacional</strong>
              </div>
            </div>

            <div className={styles.mediaNumber} aria-hidden="true">
              FS
            </div>
          </Reveal>

          <div className={styles.contentColumn}>
            <Reveal delay={80}>
              <p className={styles.eyebrow}>
                SOLUCIONES QUE RESPONDEN A CADA OPERACIÓN
              </p>
            </Reveal>

            <Reveal delay={150}>
              <h2 id="about-title">
                Experiencia técnica al servicio de cada operación
              </h2>
            </Reveal>

            <Reveal delay={220}>
              <p className={styles.introduction}>
                Four Service es una empresa chilena orientada a
                entregar soluciones integrales para distintos
                sectores productivos, combinando soporte técnico,
                gestión operativa y atención personalizada.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <p className={styles.description}>
                Nuestro trabajo comprende el mantenimiento de
                infraestructura y sistemas industriales, equipos
                médicos y dentales, transporte de personal, obras
                civiles e importaciones. Desde nuestras sedes en
                Santiago y Calama coordinamos servicios en el Norte
                Grande, Norte Chico, Zona Central, Zona Sur y Zona
                Austral, respondiendo con eficiencia, continuidad y
                confianza en cada operación.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className={styles.purpose}>
                <span className={styles.purposeAccent} />

                <div>
                  <p className={styles.purposeLabel}>
                    NUESTRO PROPÓSITO
                  </p>

                  <p className={styles.purposeText}>
                    Entregar soluciones integrales, eficientes y
                    responsables que contribuyan al crecimiento y la
                    continuidad operativa de nuestros clientes,
                    asegurando calidad de servicio, capacidad técnica,
                    atención oportuna y compromiso con las personas y
                    el entorno.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className={styles.credentials}>
          <Reveal
            className={styles.credentialsHeading}
            direction="right"
            delay={80}
          >
            <p>RESPALDO INSTITUCIONAL</p>

            <h3>
              Compromisos que forman parte de nuestra manera de
              trabajar
            </h3>
          </Reveal>

          <div className={styles.credentialsGrid}>
            {credentials.map((credential, index) => (
              <Reveal
                key={credential.title}
                className={styles.credential}
                delay={160 + index * 100}
              >
                <span className={styles.credentialNumber}>
                  {credential.number}
                </span>

                <div>
                  <h4>{credential.title}</h4>
                  <p>{credential.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
