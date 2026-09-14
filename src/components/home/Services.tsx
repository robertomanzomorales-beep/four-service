import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import styles from "./Services.module.css";

const services = [
  {
    number: "01",
    category: "INFRAESTRUCTURA Y OBRAS CIVILES",
    title: "Continuidad para instalaciones críticas",
    description:
      "Mantenimiento, conservación, reparación y ejecución de obras para recintos públicos y privados, considerando infraestructura eléctrica, redes sanitarias e industriales y trabajos estructurales.",
    image:
      "/images/services/mantenimiento-infraestructura-construccion.webp",
    alt: "Mantenimiento de infraestructura ejecutado por Four Service",
    specialties: [
      "Climatización industrial",
      "Refrigeración y calefacción",
      "Obras civiles y estructurales",
    ],
  },
  {
    number: "02",
    category: "EQUIPOS MÉDICOS Y ÁREA DENTAL",
    title: "Soporte técnico para entornos clínicos",
    description:
      "Mantenimiento preventivo y correctivo, diagnóstico, calibración, pruebas de funcionamiento y seguridad eléctrica para equipamiento médico, hospitalario y odontológico.",
    image: "/images/services/equipos-medicos.webp",
    alt: "Mantenimiento técnico de equipamiento médico",
    specialties: [
      "Diagnóstico y calibración",
      "Seguridad eléctrica",
      "Suministro de repuestos",
    ],
  },
  {
    number: "03",
    category: "TRANSPORTE DE PERSONAL",
    title: "Traslados coordinados para cada operación",
    description:
      "Servicios de transporte para empresas e instituciones, visitas técnicas, reuniones, inspecciones y desplazamiento planificado de grupos pequeños o medianos.",
    image: "/images/services/transporte-personal.webp",
    alt: "Servicio de transporte de personal",
    specialties: [
      "Servicios programados",
      "Traslados institucionales",
      "Coordinación operativa",
    ],
  },
  {
    number: "04",
    category: "IMPORTACIONES Y ABASTECIMIENTO",
    title: "Suministro técnico sin fronteras",
    description:
      "Gestión eficiente de procesos de importación, búsqueda de proveedores internacionales y abastecimiento de equipos, componentes y repuestos especializados.",
    image: "/images/services/importaciones.webp",
    alt: "Gestión de importaciones y abastecimiento técnico",
    specialties: [
      "Proveedores internacionales",
      "Equipamiento especializado",
      "Repuestos técnicos",
    ],
  },
];

const whatsappUrl =
  "https://wa.me/56953638228?text=" +
  encodeURIComponent(
    "Hola, quisiera solicitar una cotización por los servicios de Four Service."
  );

export default function Services() {
  return (
    <section
      id="servicios"
      className={styles.section}
      aria-labelledby="services-title"
    >
      <div className={styles.gridBackground} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <div className={styles.sectionLabel}>
              <span>02</span>
              <p>SERVICIOS</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.sectionDescriptor}>
              CAPACIDAD TÉCNICA Y OPERATIVA
            </p>
          </Reveal>
        </div>

        <div className={styles.introduction}>
          <Reveal
            className={styles.titleColumn}
            direction="right"
          >
            <p className={styles.eyebrow}>
              SOLUCIONES INTEGRALES
            </p>

            <h2 id="services-title">
              Especialidades que sostienen la continuidad de su
              operación
            </h2>
          </Reveal>

          <Reveal
            className={styles.introText}
            direction="left"
            delay={120}
          >
            <p>
              Integramos experiencia técnica, capacidad de respuesta
              y gestión personalizada para atender requerimientos de
              empresas e instituciones públicas y privadas.
            </p>

            <div className={styles.sectors}>
              <span>Industria</span>
              <span>Salud</span>
              <span>Instituciones</span>
              <span>Empresas</span>
            </div>
          </Reveal>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <Reveal
              key={service.number}
              className={styles.cardReveal}
              delay={index * 90}
              distance={35}
            >
              <article className={styles.card}>
                <div className={styles.media}>
                  <Image
                    className={styles.image}
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 660px) 100vw, (max-width: 1180px) 50vw, 330px"
                  />

                  <div
                    className={styles.imageOverlay}
                    aria-hidden="true"
                  />

                  <span className={styles.number}>
                    {service.number}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.category}>
                    {service.category}
                  </p>

                  <h3>{service.title}</h3>

                  <p className={styles.description}>
                    {service.description}
                  </p>

                  <ul>
                    {service.specialties.map((specialty) => (
                      <li key={specialty}>
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.closing} delay={100}>
          <div>
            <p className={styles.closingEyebrow}>
              ATENCIÓN PERSONALIZADA
            </p>

            <h3>
              Cada requerimiento comienza con una evaluación clara
              de su operación.
            </h3>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar cotización
          </a>
        </Reveal>
      </div>
    </section>
  );
}