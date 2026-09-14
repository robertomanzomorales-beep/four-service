import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
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
  "Infraestructura y obras civiles",
  "Equipos médicos y área dental",
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
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Reveal className={styles.brandColumn}>
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
            />
          </a>

          <p>
            Soluciones técnicas y operativas para empresas e
            instituciones públicas y privadas.
          </p>

          <a
            className={styles.quoteButton}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar cotización
          </a>
        </Reveal>

        <Reveal
          className={styles.footerColumn}
          delay={80}
        >
          <h2>Navegación</h2>

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
          <h2>Servicios</h2>

          <ul>
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          className={styles.footerColumn}
          delay={200}
        >
          <h2>Contacto</h2>

          <address>
            <a href="mailto:contacto@fourservice.cl">
              contacto@fourservice.cl
            </a>

            <a href="tel:+56953638228">
              +56 9 5363 8228
            </a>

            <p>
              Santa Magdalena 75, Oficina 304,
              Providencia
            </p>

            <p>
              Huaytiquina 1849, Villa Huaytiquina,
              Calama
            </p>
          </address>
        </Reveal>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p>
            © {new Date().getFullYear()} Four Service. Todos los
            derechos reservados.
          </p>

          <span>
            Calama · Santiago · Chile
          </span>

          <a
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