import { cn } from "../../../lib/cn";

const logoFullUrl = new URL("./assets/logo-full.svg", import.meta.url).href;
const logoMarkUrl = new URL("./assets/logo-mark.svg", import.meta.url).href;

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
} as const;

export interface LogoProps {
  variant?: "full" | "mark";
  tone?: "brand" | "inverse";
  size?: keyof typeof sizeClasses;
  label?: string;
  decorative?: boolean;
  className?: string;
}

export function Logo({
  variant = "full",
  tone = "brand",
  size = "md",
  label = "EMR Despachantes",
  decorative = false,
  className,
}: LogoProps) {
  const accessibilityProps = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label } as const);

  return (
    <span
      {...accessibilityProps}
      className={cn("inline-flex w-auto shrink-0", sizeClasses[size], className)}
    >
      <img
        src={variant === "full" ? logoFullUrl : logoMarkUrl}
        alt=""
        aria-hidden="true"
        className={cn(
          "block h-full w-auto object-contain",
          tone === "inverse" && "brightness-0 invert",
        )}
      />
    </span>
  );
}
