// app/components/Loader.tsx
"use client";
import React from "react";
import clsx from "clsx";

type LoaderSize = "xs" | "sm" | "md" | "lg";
type LoaderVariant = "spinner" | "ring" | "ball" | "bars" | "dots";

type LoaderProps = {
  /** Texte sous (ou à côté) du loader */
  label?: string;
  /** xs | sm | md | lg — par défaut md */
  size?: LoaderSize;
  /** Variante d’animation daisyUI */
  variant?: LoaderVariant;
  /** Affichage en plein écran avec overlay */
  fullScreen?: boolean;
  /** Ajout de classes utilitaires complémentaires */
  className?: string;
  /** Position du label */
  labelPosition?: "right" | "bottom";
};

const sizeMap: Record<LoaderSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

const variantMap: Record<LoaderVariant, string> = {
  spinner: "loading-spinner",
  ring: "loading-ring",
  ball: "loading-ball",
  bars: "loading-bars",
  dots: "loading-dots",
};

export default function Loader({
  label = "Chargement…",
  size = "md",
  variant = "spinner",
  fullScreen = false,
  className,
  labelPosition = "bottom",
}: LoaderProps) {
  const loaderEl = (
    <span
      className={clsx(
        "loading text-accent",
        sizeMap[size],
        variantMap[variant]
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );

  const content =
    labelPosition === "right" ? (
      <div className="flex items-center gap-3">
        {loaderEl}
        <span className="text-sm text-base-content/80">{label}</span>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        {loaderEl}
        <span className="text-sm text-base-content/80">{label}</span>
      </div>
    );

  if (fullScreen) {
    return (
      <div
        className={clsx(
          "fixed inset-0 z-50 grid place-items-center bg-base-100/60 backdrop-blur-sm",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return <div className={clsx("inline-flex", className)}>{content}</div>;
}
