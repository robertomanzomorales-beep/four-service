"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Header.module.css";
import BrandGeometry from "@/components/ui/BrandGeometry";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

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
  const navigationRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] =
    useState("#inicio");

  useEffect(() => {
    const updateActiveSection = () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      animationFrame.current = requestAnimationFrame(() => {
        const headerHeight = Math.max(
          navigationRef.current?.getBoundingClientRect().bottom ?? 108,
          0
        );

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

        headerRef.current?.style.setProperty("--menu-top", `${headerHeight}px`);
        setScrolled(window.scrollY > 48);
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

    const pageContent = Array.from(document.querySelectorAll<HTMLElement>("main, footer, [data-footer]"));
    const previousInert = pageContent.map((element) => element.inert);
    pageContent.forEach((element) => { element.inert = true; });
    const focusFrame = requestAnimationFrame(() => {
      menuPanelRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }

      if (event.key === "Tab") {
        const links = Array.from(menuPanelRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
        const focusable = [menuButtonRef.current, ...links].filter((element): element is HTMLElement => element !== null);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
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
      cancelAnimationFrame(focusFrame);
      pageContent.forEach((element, index) => { element.inert = previousInert[index]; });
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

    const headerHeight = navigationRef.current?.offsetHeight ?? 77;

    const destinationPosition =
      destination.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    setActiveSection(href);

    window.scrollTo({
      top: href === "#inicio" ? 0 : Math.max(destinationPosition - 12, 0),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });

    window.history.replaceState(null, "", href);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled}
    >
      <div className={styles.utilityBar} inert={scrolled}>
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

      <div ref={navigationRef} className={styles.navigationBar}>
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
            <WhatsAppIcon />
            Solicitar cotización
          </a>

          <button
            ref={menuButtonRef}
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
        ref={menuPanelRef}
        id="mobile-navigation"
        className={styles.mobileMenu}
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <BrandGeometry
          className={styles.mobileDecoration}
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
                data-active={activeSection === item.href}
                aria-current={activeSection === item.href ? "page" : undefined}
                style={{ "--menu-item-delay": `${index * 45}ms` } as CSSProperties}
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
              <WhatsAppIcon />
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
