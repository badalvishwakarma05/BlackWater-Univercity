import { useExperience } from "../../app/PirateExperienceProvider";
import { ParchmentPopup } from "../interactions/ParchmentPopup";
import { PirateToastRegion } from "../interactions/PirateToast";
import { RumTooltipLayer } from "../interactions/PirateTooltip";

/** Renders the popup stack (only the top one is interactive), the toasts, and the rum tooltip. */
export function GlobalPopupLayer() {
  const { popups, closePopup, toasts, dismissToast } = useExperience();
  return (
    <>
      {popups.map((popup, index) => (
        <ParchmentPopup
          key={popup.id}
          popup={popup}
          active={index === popups.length - 1}
          zIndex={100 + index * 2}
          onClose={() => closePopup(popup.id)}
        />
      ))}
      <PirateToastRegion toasts={toasts} onDismiss={dismissToast} />
      <RumTooltipLayer />
    </>
  );
}
