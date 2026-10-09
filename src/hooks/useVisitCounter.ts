import { useEffect } from "react";
import { useLocation } from "react-router";
import { useExperience } from "../app/PirateExperienceProvider";

/**
 * Feeds the Jar of Dirt. Registration is idempotent per route per session
 * (see JAR rule in PirateExperienceProvider), so rerenders and StrictMode
 * double effects never add duplicate dirt.
 */
export function useVisitCounter(): void {
  const { pathname } = useLocation();
  const { registerVisit } = useExperience();
  useEffect(() => {
    registerVisit(pathname);
  }, [pathname, registerVisit]);
}
