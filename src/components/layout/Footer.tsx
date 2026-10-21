import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import BrandGeometry from "@/components/ui/BrandGeometry";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import styles from "./Footer.module.css";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contacto", href: "#contacto" },
];

const services = [
  "Mantención de infraestructura industrial",
  "Mantenimiento de equipos médicos y área dental",
  "Obras civiles",
  "Transporte de personal",
  "Importaciones y abastecimiento",
];

const whatsappUrl =
  "https://wa.me/56953638228?text=" +
  encodeURIComponent(
    "Hola, quisiera solicitar información sobre los servicios de Four Service."
  );

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Pie de página de Four Service">
      <BrandGeometry className={styles.geometry} />
      <div className={styles.container}>
        <div className={styles.lead}>
          <Reveal className={styles.brand} distance={24}>
            <a
              className={styles.logoLink}
              href="#inicio"
              aria-label="Four Service, inicio"
            >
              <Image
                src="/images/brand/logo-four-service.webp"
                alt="Four Service"
                width={1000}
                height={390}
                className={styles.logo}
                sizes="220px"
              />
            </a>
          </Reveal>

          <Reveal className={styles.statement} delay={100} distance={30}>
            <p className={styles.coverage}>Cobertura nacional · Chile</p>
            <h2>
              Soluciones técnicas y operativas para empresas e
              instituciones públicas y privadas.
            </h2>
          </Reveal>

          <Reveal className={styles.callToAction} delay={240} distance={24}>
            <a
              className={styles.quoteButton}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Solicitar cotización
            </a>
          </Reveal>
        </div>

        <div className={styles.directory}>
          <Reveal
            className={styles.footerColumn}
            delay={80}
          >
            <h3>Navegación</h3>

            <nav aria-label="Navegación del footer">
              {navigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </Reveal>

          <Reveal
            className={styles.footerColumn}
            delay={140}
          >
            <h3>Servicios</h3>

            <ul>
              {services.map((service) => (
                <li key={service}><a href="#servicios">{service}</a></li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={`${styles.footerColumn} ${styles.offices}`} delay={200} distance={28}>
            <h3>Oficinas</h3>
            <address>
              <div>
                <span>Providencia</span>
                <p>Santa Magdalena 75, Oficina 304, Providencia</p>
              </div>
              <div>
                <span>Calama</span>
                <p>Huaytiquina 1849, Calama</p>
              </div>
            </address>
          </Reveal>

          <Reveal className={`${styles.footerColumn} ${styles.contact}`} delay={300} distance={28}>
            <h3>Contacto</h3>
            <address>
              <a href="mailto:contacto@fourservice.cl">
                contacto@fourservice.cl
              </a>

              <a href="tel:+56953638228">
                +56 9 5363 8228
              </a>

            </address>
            <span className={styles.contactRule} aria-hidden="true" />
          </Reveal>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p>
            © {new Date().getFullYear()} Four Service. Todos los
            derechos reservados.
          </p>

          <a className={styles.returnLink} href="#inicio">
            Volver al inicio
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </a>

          <a
            className={styles.credit}
            href="https://vialoop.cl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Diseñado y potenciado por Vialoop.cl
          </a>
        </div>
      </div>
    </footer>
  );
}
