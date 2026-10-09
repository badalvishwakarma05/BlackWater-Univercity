import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Link } from "react-router";

export type CrookedVariant = "plank" | "seal" | "compass" | "parchment" | "gold" | "rust" | "tape" | "ghost";

interface Shared {
  variant?: CrookedVariant;
  size?: "sm" | "md" | "lg";
  /** Degrees of crookedness. The captain recommends between -2 and 2. */
  tilt?: number;
  /** Show the universal rum line on hover/focus (default true) */
  rum?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

function classesFor({ variant = "plank", size = "md", className = "" }: Shared) {
  return `crooked-btn cb-${variant} cb-${size} storm-wobble ${className}`;
}

function inner(variant: CrookedVariant, icon: ReactNode, children: ReactNode) {
  return (
    <>
      {variant === "seal" && <span className="cb-seal-blob" aria-hidden="true" />}
      {variant === "tape" && (
        <>
          <span className="cb-tapestrip cb-tapestrip-a" aria-hidden="true" />
          <span className="cb-tapestrip cb-tapestrip-b" aria-hidden="true" />
        </>
      )}
      {variant === "plank" && (
        <>
          <span className="cb-nail cb-nail-l" aria-hidden="true" />
          <span className="cb-nail cb-nail-r" aria-hidden="true" />
        </>
      )}
      {icon && <span className="cb-icon">{icon}</span>}
      <span className="cb-label">{children}</span>
    </>
  );
}

type ButtonProps = Shared & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "style">;

export function CrookedButton(props: ButtonProps) {
  const { variant = "plank", size, tilt = 0, rum = true, icon, className, style, children, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={classesFor({ variant, size, className, children })}
      style={{ ...style, ["--tilt" as string]: `${tilt}deg` }}
      data-rum={rum ? "" : undefined}
      {...rest}
    >
      {inner(variant, icon, children)}
    </button>
  );
}

type LinkProps = Shared & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "style" | "href">;

export function CrookedLink(props: LinkProps) {
  const { variant = "plank", size, tilt = 0, rum = true, icon, className, style, children, to, ...rest } = props;
  return (
    <Link
      to={to}
      className={classesFor({ variant, size, className, children })}
      style={{ ...style, ["--tilt" as string]: `${tilt}deg` }}
      data-rum={rum ? "" : undefined}
      {...rest}
    >
      {inner(variant, icon, children)}
    </Link>
  );
}
