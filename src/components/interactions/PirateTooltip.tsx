import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** The universal button dialogue. Exact wording, by order of the captain. */
export const RUM_LINE = "Why is the rum always gone… and why is my attendance always short?";

interface TooltipProps {
  text: string;
  placement?: "below" | "above" | "left";
  className?: string;
  /** Receives the tooltip's id so the trigger can reference it with aria-describedby */
  children: (tooltipId: string) => ReactNode;
}

/** A small hand-written tag that appears on hover or keyboard focus. */
export function PirateTooltip({ text, placement = "below", className = "", children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className={`pirate-tt-wrap ${className}`}
      onPointerEnter={(e) => e.pointerType !== "touch" && show(350)}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(e) => {
        if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) show(0);
      }}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {children(id)}
      <span id={id} role="tooltip" className={`pirate-tt pirate-tt-${placement} ${open ? "is-open" : ""}`}>
        {text}
      </span>
    </span>
  );
}

interface Bubble {
  x: number;
  y: number;
  below: boolean;
}

/**
 * One global listener that shows the rum line above any element marked with
 * data-rum. Hover waits a beat (no spam), keyboard focus shows it at once,
 * and a tap shows it briefly without blocking the tap itself.
 */
export function RumTooltipLayer() {
  const [bubble, setBubble] = useState<Bubble | null>(null);

  useEffect(() => {
    let showTimer = 0;
    let hideTimer = 0;
    let current: HTMLElement | null = null;
    let suppressed: HTMLElement | null = null;

    const place = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const below = r.top < 110;
      const half = Math.min(150, window.innerWidth / 2 - 12);
      const x = Math.min(window.innerWidth - half - 8, Math.max(half + 8, r.left + r.width / 2));
      setBubble({ x, y: below ? r.bottom + 10 : r.top - 10, below });
    };
    const show = (el: HTMLElement, delay: number) => {
      if (el === suppressed) return;
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      current = el;
      showTimer = window.setTimeout(() => {
        if (current === el && el.isConnected) place(el);
      }, delay);
    };
    const hide = () => {
      window.clearTimeout(showTimer);
      current = null;
      setBubble(null);
    };
    const rumTarget = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>("[data-rum]") : null);

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = rumTarget(e.target);
      if (el && el !== current) show(el, 600);
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = rumTarget(e.target);
      if (!el) return;
      const to = e.relatedTarget instanceof Node ? e.relatedTarget : null;
      if (to && el.contains(to)) return;
      if (el === suppressed) suppressed = null;
      if (el === current) hide();
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = rumTarget(e.target);
      if (el && el.matches(":focus-visible")) show(el, 120);
    };
    const onFocusOut = (e: FocusEvent) => {
      const el = rumTarget(e.target);
      if (el && el === current) hide();
    };
    const onDown = (e: PointerEvent) => {
      const el = rumTarget(e.target);
      if (e.pointerType === "touch" && el) {
        suppressed = null;
        show(el, 0);
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(hide, 1900);
      }
    };
    const onClick = (e: MouseEvent) => {
      const el = rumTarget(e.target);
      if (el && (e as PointerEvent).pointerType !== "touch") {
        suppressed = el;
        hide();
      }
    };
    const onScroll = () => hide();

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  if (!bubble) return null;
  return (
    <div
      className={`rum-tip ${bubble.below ? "is-below" : ""}`}
      style={{ left: bubble.x, top: bubble.y }}
      role="tooltip"
      aria-hidden="true"
    >
      {RUM_LINE}
    </div>
  );
}
