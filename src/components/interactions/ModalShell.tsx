import { useEffect, useRef, type ReactNode } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusablesIn(node: HTMLElement | null): HTMLElement[] {
  if (!node) return [];
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
  );
}

let scrollLocks = 0;
let savedOverflow = "";
let savedPadding = "";

function lockScroll() {
  if (scrollLocks === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  }
  scrollLocks += 1;
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPadding;
  }
}

interface Props {
  labelledBy: string;
  describedBy?: string;
  /** Omit to make the dialog non-dismissible by Escape/backdrop */
  onDismiss?: () => void;
  /** Only the top-most dialog traps focus and listens for Escape */
  active?: boolean;
  zIndex?: number;
  className?: string;
  backdropClassName?: string;
  role?: "dialog" | "alertdialog";
  /** Decorative layers rendered behind the panel (doors, splashes…) */
  decor?: ReactNode;
  children: ReactNode;
}

/**
 * Accessible modal plumbing shared by every popup on the ship:
 * focus moves in on open, is trapped while open, returns on close;
 * Escape and backdrop clicks dismiss when allowed; page scroll is locked.
 */
export function ModalShell({
  labelledBy,
  describedBy,
  onDismiss,
  active = true,
  zIndex = 100,
  className = "",
  backdropClassName = "",
  role = "dialog",
  decor,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockScroll();
    const panel = panelRef.current;
    const target = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusablesIn(panel)[0] ?? panel;
    target?.focus({ preventScroll: true });
    return () => {
      unlockScroll();
      if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dismissRef.current) {
          event.preventDefault();
          dismissRef.current();
        }
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusablesIn(panelRef.current);
      if (items.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !panelRef.current?.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !panelRef.current?.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div
      className={`modal-backdrop ${backdropClassName}`}
      style={{ zIndex }}
      aria-hidden={active ? undefined : true}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissRef.current) dismissRef.current();
      }}
    >
      {decor}
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`modal-panel ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
