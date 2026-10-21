"use client";

import { useEffect, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./FloatingActions.module.css";

const whatsappUrl = "https://wa.me/56953638228?text=" + encodeURIComponent("Hola, quisiera información sobre los servicios de Four Service.");

export default function FloatingActions() {
  const [scrolled, setScrolled] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    let frame = 0;
    const footer = document.querySelector("footer");
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 420);
        setNearFooter(!!footer && footer.getBoundingClientRect().top < window.innerHeight - 40);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const backToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <div className={styles.actions} data-footer={nearFooter}>
      <button type="button" className={styles.backToTop} data-visible={scrolled} onClick={backToTop} aria-label="Volver arriba" aria-hidden={!scrolled || nearFooter} tabIndex={!scrolled || nearFooter ? -1 : 0}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
      </button>
      <a className={styles.whatsapp} href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Four Service por WhatsApp" aria-hidden={nearFooter || undefined} tabIndex={nearFooter ? -1 : 0}>
        <span className={styles.whatsappLabel}>Conversemos</span>
        <WhatsAppIcon />
      </a>
    </div>
  );
}
