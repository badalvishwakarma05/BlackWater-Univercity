import { useEffect, useState } from "react";

/**
 * Custom Pirate Sword and Pistol cursor follower.
 * Features smooth position tracking, rotation on hover over interactive elements,
 * and a shiny pirate image graphic.
 */
export function SwordCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);
    const updateMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener("change", updateMotion);
    
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    // Only enable pointer tracking on devices with fine pointers (mouse)
    if (window.matchMedia("(pointer: coarse)").matches || isReducedMotion) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, [role='button'], input, select, textarea, label, .crooked-btn, .nav-plank, .panel, .stat-tile"
        );
        setIsHovered(!!interactive);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, isReducedMotion]);

  if (!isSupported || !isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-all duration-75 ease-out ${
        isHovered ? "drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" : "drop-shadow-[2px_4px_6px_rgba(0,0,0,0.85)]"
      }`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) ${
          isMouseDown
            ? "scale(0.88) rotate(-15deg)"
            : isHovered
            ? "scale(1.2) rotate(5deg)"
            : "scale(1) rotate(0deg)"
        }`,
        transformOrigin: "center center",
        width: "40px",
        height: "40px",
        marginLeft: "-20px",
        marginTop: "-20px"
      }}
    >
      <img 
        src="/cursor.png" 
        alt="" 
        className="w-full h-full object-contain pointer-events-none select-none"
      />
    </div>
  );
}
