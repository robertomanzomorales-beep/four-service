"use client";

import type { ImageLoaderProps } from "next/image";

export default function hostingImageLoader({ src, width }: ImageLoaderProps) {
  const basePath = process.env.NEXT_PUBLIC_HOSTING_BASE_PATH ?? "";

  if (!src.startsWith("/images/")) return `${basePath}${src}`;

  const key = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  return `${basePath}/_images/${key}/${width}.webp`;
}
