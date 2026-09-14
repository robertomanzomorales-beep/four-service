"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Reveal.module.css";

type RevealDirection = "up" | "down" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  direction?: RevealDirection;
  once?: boolean;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 28,
  direction = "up",
  once = true,
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }

          return;
        }

        if (!once) {
          setVisible(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once]);

  const customProperties = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <div
      ref={elementRef}
      className={`${styles.reveal} ${className}`}
      data-visible={visible}
      data-direction={direction}
      style={customProperties}
    >
      {children}
    </div>
  );
}