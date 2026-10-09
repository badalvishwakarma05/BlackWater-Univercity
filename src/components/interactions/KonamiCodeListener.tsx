import { useCallback } from "react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { useKonamiCode } from "../../hooks/useKonamiCode";

/** Listens for ↑ ↑ ↓ ↓ ← → ← → B A and toggles the storm. Renders nothing. */
export function KonamiCodeListener() {
  const { stormMode, setStormMode, notify, play } = useExperience();
  const toggle = useCallback(() => {
    if (stormMode) {
      setStormMode(false);
      notify({ title: "The storm passes.", message: "Order has been restored. The rum, sadly, has not.", tone: "info" });
    } else {
      setStormMode(true);
      play("cannon");
      notify({
        title: "MUTINY ON THE MAINFRAME!",
        message: "The crew has seized the website. Enter the code again, or press 'Calm the seas', to restore order.",
        tone: "storm",
      });
    }
  }, [stormMode, setStormMode, notify, play]);
  useKonamiCode(toggle);
  return null;
}
