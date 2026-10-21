type BrandGeometryProps = {
  className?: string;
};

export default function BrandGeometry({ className }: BrandGeometryProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-brand-geometry="cube"
    >
      <path d="m169 37 92 53q9 5 9 16v108q0 11-9 16l-92 53q-9 5-18 0l-92-53q-9-5-9-16V106q0-11 9-16l92-53q9-5 18 0Z" />
      <path d="m54 99 106 61 106-61M160 160v126" />
    </svg>
  );
}
