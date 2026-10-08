"use client";

import Image from "next/image";
import {
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Header.module.css";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contacto", href: "#contacto" },
];

const whatsappUrl =
  "https://wa.me/56953638228?text=" +
  encodeURIComponent(
    "Hola, quisiera solicitar información sobre los servicios de Four Service."
  );

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState("#inicio");

  useEffect(() => {
    const updateActiveSection = () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      animationFrame.current = requestAnimationFrame(() => {
        const headerHeight =
          headerRef.current?.offsetHeight ?? 108;

        const marker =
          window.scrollY + headerHeight + 110;

        let currentSection = "#inicio";

        navigation.forEach((item) => {
          const section =
            document.querySelector<HTMLElement>(item.href);

          if (section && section.offsetTop <= marker) {
            currentSection = item.href;
          }
        });

        setActiveSection((current) =>
          current === currentSection
            ? current
            : currentSection
        );
      });
    };

    updateActiveSection();

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 980) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [menuOpen]);

  const navigateToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const destination =
      document.querySelector<HTMLElement>(href);

    setMenuOpen(false);

    if (!destination) {
      return;
    }

    event.preventDefault();

    const headerHeight =
      headerRef.current?.offsetHeight ?? 108;

    const destinationPosition =
      destination.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    setActiveSection(href);

    window.scrollTo({
      top: Math.max(destinationPosition, 0),
      behavior: "smooth",
    });

    window.history.replaceState(null, "", href);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
    >
      <div className={styles.utilityBar}>
        <div className={styles.utilityInner}>
          <a
            className={styles.email}
            href="mailto:contacto@fourservice.cl"
          >
            <span
              className={styles.statusDot}
              aria-hidden="true"
            />

            contacto@fourservice.cl
          </a>

          <div className={styles.utilityRight}>
            <span className={styles.locations}>
              COBERTURA OPERATIVA A NIVEL NACIONAL
            </span>

            <span
              className={styles.divider}
              aria-hidden="true"
            />

            <a href="tel:+56953638228">
              +56 9 5363 8228
            </a>
          </div>
        </div>
      </div>

      <div className={styles.navigationBar}>
        <div className={styles.navigationInner}>
          <a
            className={styles.logoLink}
            href="#inicio"
            aria-label="Four Service, inicio"
            onClick={(event) =>
              navigateToSection(event, "#inicio")
            }
          >
            <Image
              className={styles.logo}
              src="/images/brand/logo-four-service.webp"
              alt="Four Service"
              width={1000}
              height={390}
              priority
            />
          </a>

          <nav
            className={styles.desktopNavigation}
            aria-label="Navegación principal"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={
                  activeSection === item.href
                }
                aria-current={
                  activeSection === item.href
                    ? "page"
                    : undefined
                }
                onClick={(event) =>
                  navigateToSection(
                    event,
                    item.href
                  )
                }
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className={styles.quoteButton}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar cotización
          </a>

          <button
            className={styles.menuButton}
            type="button"
            aria-label={
              menuOpen
                ? "Cerrar menú"
                : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
          >
            <span>
              {menuOpen ? "Cerrar" : "Menú"}
            </span>

            <span
              className={styles.menuIcon}
              data-open={menuOpen}
              aria-hidden="true"
            >
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={styles.mobileMenu}
        data-open={menuOpen}
        aria-hidden={!menuOpen}
      >
        <div
          className={styles.mobileDecoration}
          aria-hidden="true"
        />

        <div className={styles.mobileMenuInner}>
          <p className={styles.mobileHeading}>
            NAVEGACIÓN
          </p>

          <nav
            className={styles.mobileNavigation}
            aria-label="Navegación móvil"
          >
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) =>
                  navigateToSection(
                    event,
                    item.href
                  )
                }
              >
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.mobileFooter}>
            <a
              className={styles.mobileQuote}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}
            >
              Solicitar cotización
            </a>

            <div className={styles.mobileContact}>
              <a href="mailto:contacto@fourservice.cl">
                contacto@fourservice.cl
              </a>

              <a href="tel:+56953638228">
                +56 9 5363 8228
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
