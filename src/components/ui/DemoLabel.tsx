import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

/** The honest bit: marks fictional data, satire and simulations as such. */
export function DemoLabel({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span className={`demo-label ${dark ? "on-dark" : ""} ${className}`}>
      <AlertTriangle size={13} aria-hidden="true" />
      {children}
    </span>
  );
}
