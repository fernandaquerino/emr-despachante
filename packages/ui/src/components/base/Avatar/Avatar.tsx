"use client";

import { useState } from "react";
import { cn } from "../../../lib/cn";

const sizeClasses = {
  sm: "h-6 w-6 text-label",
  md: "h-8 w-8 text-label",
  lg: "h-10 w-10 text-body",
} as const;

export interface AvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";

  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-action-primary font-medium text-text-on-primary",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
