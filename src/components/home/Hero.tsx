"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type FocusEvent,
  type TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Reveal from "@/components/ui/Reveal";
import styles from "./Hero.module.css";

type HeroSlide = {
  image: string;
  alt: string;
  position: string;
  mobilePosition: string;
  eyebrow: string;
  title: string;
  description: string;
};

const slides: HeroSlide[] = [
  {
    image: "/images/hero/multiservicios-hero.webp",
    alt: "Profesional de Four Service en un entorno técnico",
    position: "center center",
    mobilePosition: "57% center",
    eyebrow: "CELERIDAD, CONOCIMIENTO Y EXPERIENCIA",
    title: "Soluciones integrales para la continuidad de su operación",
    description:
      "Mantenimiento de infraestructura y sistemas industriales, equipos médicos y dentales, transporte de personal, obras civiles e importaciones.",
  },
  {
    image: "/images/hero/40-horas-hero.webp",
    alt: "Trabajo realizado por Four Service en terreno",
    position: "center center",
    mobilePosition: "58% center",
    eyebrow: "COMPROMISO QUE RESPALDA NUESTRO TRABAJO",
    title: "Capacidad técnica con una gestión responsable",
    description:
      "Respuesta oportuna, atención personalizada y compromiso con las personas. Four Service cuenta con Sello 40 Horas y Sello Empresa Mujer.",
  },
  {
    image: "/images/hero/ubicacion-calama-hero.webp",
    alt: "Vista aérea de Calama",
    position: "center center",
    mobilePosition: "62% center",
    eyebrow: "COBERTURA OPERATIVA A NIVEL NACIONAL",
    title: "Capacidad de respuesta en todo Chile",
    description:
      "Desde Calama y Santiago coordinamos soluciones para el Norte Grande, Norte Chico, Zona Central, Zona Sur y Zona Austral.",
  },
];

const AUTOPLAY_DELAY = 7000;
const SWIPE_DISTANCE = 55;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const currentSlide = slides[activeSlide];

  const carouselPaused =
    manualPause ||
    pointerInside ||
    focusInside ||
    reducedMotion ||
    !documentVisible;

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotion = () => {
      setReducedMotion(motionQuery.matches);
    };

    const updateVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    updateMotion();
    updateVisibility();

    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener(
      "visibilitychange",
      updateVisibility
    );

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      );
    };
  }, []);

  useEffect(() => {
    if (carouselPaused) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeSlide, carouselPaused]);

  const goToSlide = (index: number) => {
    setActiveSlide(
      (index + slides.length) % slides.length
    );
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextElement = event.relatedTarget as Node | null;

    if (
      !nextElement ||
      !event.currentTarget.contains(nextElement)
    ) {
      setFocusInside(false);
    }
  };

  const handleTouchStart = (
    event: TouchEvent<HTMLElement>
  ) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLElement>
  ) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];

    touchStart.current = null;

    if (!start || !touch) {
      return;
    }

    const distanceX = touch.clientX - start.x;
    const distanceY = touch.clientY - start.y;

    if (
      Math.abs(distanceX) < SWIPE_DISTANCE ||
      Math.abs(distanceX) < Math.abs(distanceY)
    ) {
      return;
    }

    goToSlide(activeSlide + (distanceX < 0 ? 1 : -1));
  };

  return (
    <section
      id="inicio"
      className={styles.hero}
      aria-label="Presentación de Four Service"
      aria-roledescription="carrusel"
      onMouseEnter={() => setPointerInside(true)}
      onMouseLeave={() => setPointerInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
    >
      <div className={styles.slides}>
        {slides.map((slide, index) => {
          const imageProperties = {
            "--image-position": slide.position,
            "--mobile-image-position": slide.mobilePosition,
          } as CSSProperties;

          return (
            <div
              key={slide.image}
              className={styles.slide}
              data-active={index === activeSlide}
              aria-hidden={index !== activeSlide}
            >
              <Image
                className={styles.backgroundImage}
                src={slide.image}
                alt={index === activeSlide ? slide.alt : ""}
                fill
                sizes="100vw"
                priority={index === 0}
                quality={90}
                draggable={false}
                style={imageProperties}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />

      <div className={styles.heroInner}>
        <Reveal
          key={`hero-content-${activeSlide}`}
          className={styles.content}
          delay={80}
          distance={36}
        >
          <p className={styles.eyebrow}>
            {currentSlide.eyebrow}
          </p>

          <h1>{currentSlide.title}</h1>

          <p className={styles.description}>
            {currentSlide.description}
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href="#contacto"
            >
              Solicitar cotización
            </a>

            <a
              className={styles.secondaryButton}
              href="#servicios"
            >
              Conocer servicios
            </a>
          </div>
        </Reveal>

        <div className={styles.sideLabel} aria-hidden="true">
          <span />
          FOUR SERVICE
        </div>
      </div>

      <div className={styles.heroFooter}>
        <div className={styles.slideStatus}>
          <strong>
            {String(activeSlide + 1).padStart(2, "0")}
          </strong>

          <span />

          <small>
            {String(slides.length).padStart(2, "0")}
          </small>
        </div>

        <div
          className={styles.pagination}
          aria-label="Seleccionar lámina"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              className={styles.paginationButton}
              data-active={index === activeSlide}
              type="button"
              aria-label={`Ver lámina ${index + 1}`}
              aria-current={
                index === activeSlide ? "true" : undefined
              }
              onClick={() => goToSlide(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          {!reducedMotion && (
            <button
              className={styles.pauseButton}
              type="button"
              aria-label={
                manualPause
                  ? "Reanudar carrusel"
                  : "Pausar carrusel"
              }
              onClick={() =>
                setManualPause((current) => !current)
              }
            >
              {manualPause ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5.5v13l10-6.5L8 5.5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" />
                </svg>
              )}
            </button>
          )}

          <button
            className={styles.arrowButton}
            type="button"
            aria-label="Ver lámina anterior"
            onClick={() => goToSlide(activeSlide - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>

          <button
            className={styles.arrowButton}
            type="button"
            aria-label="Ver siguiente lámina"
            onClick={() => goToSlide(activeSlide + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        Lámina {activeSlide + 1} de {slides.length}:{" "}
        {currentSlide.title}
      </p>
    </section>
  );
}
