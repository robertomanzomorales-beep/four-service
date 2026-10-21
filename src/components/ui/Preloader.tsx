"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const html = document.documentElement;
    const timers = new Set<number>();
    let cancelled = false;
    html.dataset.interactive = "true";
    html.dataset.pageLoading = "true";

    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (!cancelled) callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    const wait = (delay: number) => new Promise<void>((resolve) => later(resolve, delay));
    const ready = () => {
      delete html.dataset.pageLoading;
      window.dispatchEvent(new Event("four:page-ready"));
    };
    const hero = document.querySelector<HTMLImageElement>("#inicio img");
    const imageReady = hero?.decode ? hero.decode().catch(() => undefined) : Promise.resolve();
    const fontsReady = document.fonts.ready.catch(() => undefined);
    Promise.all([
      wait(720),
      Promise.race([Promise.all([imageReady, fontsReady]), wait(2800)]),
    ]).then(() => {
      if (cancelled) return;
      setPhase("leaving");
      later(ready, 220);
      later(() => setPhase("gone"), 850);
    });

    const restore = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      timers.forEach(window.clearTimeout);
      setPhase("gone");
      ready();
    };
    window.addEventListener("pageshow", restore);
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener("pageshow", restore);
      delete html.dataset.pageLoading;
    };
  }, []);

  return (
    <div className={styles.preloader} data-phase={phase} aria-hidden="true">
      <div className={styles.center}>
        <Image src="/images/brand/logo-four-service.webp" alt="" width={1000} height={390} priority className={styles.logo} />
        <div className={styles.bars}><span /><span /><span /></div>
      </div>
    </div>
  );
}
