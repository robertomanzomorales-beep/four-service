"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Reveal from "@/components/ui/Reveal";
import styles from "./Experience.module.css";

type ExperienceImage = {
  src: string;
  alt: string;
  category: string;
  title: string;
  aspectRatio: string;
  position?: string;
};

const images: ExperienceImage[] = [
  {
    src: "/images/experience/01-mantenimiento-equipos-medicos.webp",
    alt: "Técnico realizando mantenimiento a equipamiento médico",
    category: "EQUIPAMIENTO MÉDICO",
    title: "Mantenimiento técnico especializado",
    aspectRatio: "9 / 14",
  },
  {
    src: "/images/experience/02-izaje-bandera-chile-calama.webp",
    alt: "Izaje de bandera chilena realizado en Calama",
    category: "TRABAJO EN ALTURA",
    title: "Izaje de bandera en Calama",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/03-mantenimiento-equipo-minero-altura.webp",
    alt: "Mantenimiento de equipo minero mediante plataforma elevadora",
    category: "OPERACIÓN INDUSTRIAL",
    title: "Intervención en equipo minero",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/04-trabajo-altura-plataforma-elevadora.webp",
    alt: "Trabajo en altura utilizando plataforma elevadora",
    category: "INFRAESTRUCTURA",
    title: "Trabajo seguro en altura",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/05-izaje-bandera-trabajo-altura.webp",
    alt: "Trabajo de izaje de bandera realizado en altura",
    category: "TRABAJO EN ALTURA",
    title: "Ejecución técnica en terreno",
    aspectRatio: "3 / 4",
  },
  {
    src: "/images/experience/06-tablero-electrico-industrial.webp",
    alt: "Tablero eléctrico industrial intervenido por Four Service",
    category: "ELECTRICIDAD INDUSTRIAL",
    title: "Tableros y sistemas eléctricos",
    aspectRatio: "3 / 4",
  },
  {
    src: "/images/experience/07-mantenimiento-electrico-industrial.webp",
    alt: "Técnico ejecutando mantenimiento eléctrico industrial",
    category: "MANTENIMIENTO INDUSTRIAL",
    title: "Mantenimiento eléctrico",
    aspectRatio: "3 / 4",
  },
  {
    src: "/images/experience/08-mantenimiento-sala-calderas.webp",
    alt: "Sala de calderas sometida a mantenimiento técnico",
    category: "SISTEMAS TÉRMICOS",
    title: "Mantenimiento de sala de calderas",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/09-mantenimiento-sistemas-termicos.webp",
    alt: "Instalaciones térmicas sometidas a mantenimiento",
    category: "SISTEMAS INDUSTRIALES",
    title: "Sistemas térmicos y refrigeración",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/10-obras-civiles-cancha-deportiva.webp",
    alt: "Cancha deportiva intervenida mediante obras civiles",
    category: "OBRAS CIVILES",
    title: "Recuperación de infraestructura",
    aspectRatio: "4 / 3",
  },
  {
    src: "/images/experience/11-mantenimiento-climatizacion-industrial.webp",
    alt: "Técnico realizando mantenimiento de climatización industrial",
    category: "CLIMATIZACIÓN",
    title: "Climatización industrial",
    aspectRatio: "4 / 3",
  },
];

export default function Experience() {
  const [selectedImage, setSelectedImage] =
    useState<number | null>(null);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedImage === null) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedImage((current) => {
          if (current === null) {
            return null;
          }

          return (current + 1) % images.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) => {
          if (current === null) {
            return null;
          }

          return (
            (current - 1 + images.length) %
            images.length
          );
        });
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [selectedImage]);

  const closeFromBackdrop = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      setSelectedImage(null);
    }
  };

  const showPrevious = () => {
    setSelectedImage((current) => {
      if (current === null) {
        return null;
      }

      return (
        (current - 1 + images.length) %
        images.length
      );
    });
  };

  const showNext = () => {
    setSelectedImage((current) => {
      if (current === null) {
        return null;
      }

      return (current + 1) % images.length;
    });
  };

  const activeImage =
    selectedImage === null
      ? null
      : images[selectedImage];

  return (
    <>
      <section
        id="experiencia"
        className={styles.section}
        aria-labelledby="experience-title"
      >
        <div
          className={styles.backgroundNumber}
          aria-hidden="true"
        >
          11
        </div>

        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Reveal>
              <div className={styles.sectionLabel}>
                <span>03</span>
                <p>EXPERIENCIA</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <p className={styles.sectionDescriptor}>
                REGISTROS REALES · TRABAJO EN TERRENO
              </p>
            </Reveal>
          </div>

          <div className={styles.introduction}>
            <Reveal
              className={styles.titleColumn}
              direction="right"
            >
              <p className={styles.eyebrow}>
                CAPACIDAD EN TERRENO
              </p>

              <h2 id="experience-title">
                Experiencia técnica aplicada a distintos desafíos
                operacionales
              </h2>
            </Reveal>

            <Reveal
              className={styles.introText}
              direction="left"
              delay={120}
            >
              <p>
                Conozca una selección de trabajos ejecutados en
                infraestructura, mantenimiento técnico,
                equipamiento clínico y sistemas industriales.
              </p>

              <div className={styles.gallerySummary}>
                <strong>11</strong>

                <span>
                  registros seleccionados de trabajos ejecutados
                </span>
              </div>
            </Reveal>
          </div>

          <div className={styles.gallery}>
            {images.map((image, index) => {
              const imageProperties = {
                "--image-ratio": image.aspectRatio,
                "--image-position":
                  image.position ?? "center center",
              } as CSSProperties;

              return (
                <Reveal
                  key={image.src}
                  className={styles.galleryReveal}
                  delay={(index % 4) * 80}
                  distance={30}
                >
                  <button
                    className={styles.galleryItem}
                    type="button"
                    style={imageProperties}
                    aria-label={`Ampliar imagen: ${image.title}`}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                  >
                    <span className={styles.imageContainer}>
                      <Image
                        className={styles.image}
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 25vw"
                      />

                      <span
                        className={styles.imageOverlay}
                        aria-hidden="true"
                      />

                      <span className={styles.itemContent}>
                        <small>{image.category}</small>
                        <strong>{image.title}</strong>
                      </span>

                      <span
                        className={styles.expandIcon}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <Reveal
            className={styles.galleryFooter}
            delay={80}
          >
            <p>
              Cada registro representa una intervención real
              desarrollada por Four Service.
            </p>

            <span>
              INFRAESTRUCTURA · SALUD · INDUSTRIA
            </span>
          </Reveal>
        </div>
      </section>

      {activeImage && selectedImage !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada: ${activeImage.title}`}
          onMouseDown={closeFromBackdrop}
        >
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            type="button"
            aria-label="Cerrar imagen"
            onClick={() => setSelectedImage(null)}
          >
            <span />
            <span />
          </button>

          <button
            className={`${styles.lightboxArrow} ${styles.previous}`}
            type="button"
            aria-label="Ver imagen anterior"
            onClick={showPrevious}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>

          <div className={styles.lightboxContent}>
            <div
              key={activeImage.src}
              className={styles.lightboxImage}
            >
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="95vw"
                quality={95}
                className={styles.containedImage}
              />
            </div>

            <div className={styles.lightboxInformation}>
              <div>
                <small>{activeImage.category}</small>
                <strong>{activeImage.title}</strong>
              </div>

              <p>
                {String(selectedImage + 1).padStart(2, "0")}
                <span />
                {String(images.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <button
            className={`${styles.lightboxArrow} ${styles.next}`}
            type="button"
            aria-label="Ver siguiente imagen"
            onClick={showNext}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}