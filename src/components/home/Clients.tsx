import Reveal from "@/components/ui/Reveal";
import styles from "./Clients.module.css";

const sectors = [
  {
    number: "01",
    title: "Municipalidades",
    description:
      "Apoyo técnico y operativo para requerimientos comunales e infraestructura pública.",
  },
  {
    number: "02",
    title: "Centros de salud",
    description:
      "Servicios asociados a equipamiento, mantenimiento e instalaciones técnicas.",
  },
  {
    number: "03",
    title: "Corporaciones",
    description:
      "Soluciones adaptadas a organizaciones con necesidades operativas diversas.",
  },
  {
    number: "04",
    title: "Hospitales",
    description:
      "Experiencia en entornos que requieren continuidad, seguridad y respuesta técnica.",
  },
  {
    number: "05",
    title: "Servicios de Educación Pública",
    description:
      "Atención de requerimientos técnicos y de infraestructura para establecimientos.",
  },
  {
    number: "06",
    title: "Industrias",
    description:
      "Mantenimiento y soporte para sistemas e instalaciones de uso industrial.",
  },
  {
    number: "07",
    title: "Vivienda y urbanización",
    description:
      "Servicios vinculados a infraestructura, conservación y gestión territorial.",
  },
];

export default function Clients() {
  return (
    <section
      id="clientes"
      className={styles.section}
      aria-labelledby="clients-title"
    >
      <div className={styles.backgroundDetail} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <div className={styles.sectionLabel}>
              <span>04</span>
              <p>CLIENTES Y SECTORES</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.sectionDescriptor}>
              ÁMBITO PÚBLICO Y PRIVADO
            </p>
          </Reveal>
        </div>

        <div className={styles.introduction}>
          <Reveal
            className={styles.titleColumn}
            direction="right"
          >
            <p className={styles.eyebrow}>
              CONFIANZA CONSTRUIDA EN TERRENO
            </p>

            <h2 id="clients-title">
              Experiencia al servicio de instituciones y empresas
            </h2>
          </Reveal>

          <Reveal
            className={styles.introText}
            direction="left"
            delay={120}
          >
            <p>
              Four Service cuenta con experiencia atendiendo
              organismos públicos, servicios de salud,
              municipalidades, corporaciones, instituciones
              educativas, industrias y empresas privadas.
            </p>

            <p>
              Cada servicio se aborda de acuerdo con el entorno, los
              requerimientos técnicos y las condiciones particulares
              de cada operación.
            </p>
          </Reveal>
        </div>

        <div className={styles.trustPanel}>
          <Reveal
            className={styles.panelIntroduction}
            direction="right"
          >
            <div className={styles.panelNumber} aria-hidden="true">
              FS
            </div>

            <div className={styles.panelContent}>
              <p className={styles.panelEyebrow}>
                COBERTURA MULTISECTORIAL
              </p>

              <h3>
                Capacidad para responder a distintos entornos de
                operación
              </h3>

              <p>
                Nuestra experiencia combina conocimiento técnico,
                adaptación y una atención cercana para desarrollar
                soluciones según las necesidades de cada cliente.
              </p>

              <div className={styles.panelFooter}>
                <span />
                <p>CELERIDAD · CONOCIMIENTO · EXPERIENCIA</p>
              </div>
            </div>
          </Reveal>

          <div className={styles.sectorGrid}>
            {sectors.map((sector, index) => (
              <Reveal
                key={sector.title}
                className={styles.sectorReveal}
                delay={100 + index * 65}
                distance={25}
              >
                <article className={styles.sectorCard}>
                  <div className={styles.cardHeader}>
                    <span>{sector.number}</span>

                    <i aria-hidden="true" />
                  </div>

                  <h3>{sector.title}</h3>
                  <p>{sector.description}</p>
                </article>
              </Reveal>
            ))}

            <Reveal
              className={styles.privateSector}
              delay={560}
              distance={25}
            >
              <article>
                <p>SECTOR PRIVADO</p>

                <h3>Empresas e instituciones instituciones privadas</h3>

                <span>
                  Soluciones técnicas y operativas adaptadas a cada
                  organización.
                </span>
              </article>
            </Reveal>
          </div>
        </div>

        <Reveal
          className={styles.closingStatement}
          delay={120}
        >
          <p>
            RESPALDO BASADO EN EXPERIENCIA REAL
          </p>

          <h3>
            Relaciones construidas mediante cumplimiento, capacidad
            técnica y respuesta oportuna.
          </h3>
        </Reveal>
      </div>
    </section>
  );
}