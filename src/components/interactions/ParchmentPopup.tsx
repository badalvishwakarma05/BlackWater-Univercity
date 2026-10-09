import { useId } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import type { PopupConfig, PopupVariant } from "../../app/PirateExperienceProvider";
import { ModalShell } from "./ModalShell";
import { WaxSeal } from "../svg/WaxSeal";
import { GoldCoin } from "../svg/GoldCoin";

const VARIANTS: Record<PopupVariant, { panel: string; enter: string; titleClass: string; tone: "paper" | "dark" }> = {
  parchment: { panel: "tx-parchment torn-both", enter: "anim-paper-slap", titleClass: "text-ink", tone: "paper" },
  wooden: { panel: "tx-wood popup-wooden", enter: "anim-wooden-swing", titleClass: "text-gold", tone: "dark" },
  wax: { panel: "tx-parchment popup-wax", enter: "anim-letter-unfold", titleClass: "text-blood", tone: "paper" },
  dialogue: { panel: "tx-parchment-dark popup-dialogue", enter: "anim-paper-slap", titleClass: "text-ink", tone: "paper" },
  treasure: { panel: "tx-deep popup-treasure", enter: "anim-treasure-rise", titleClass: "text-gold", tone: "dark" },
  error: { panel: "tx-rust cracked popup-error", enter: "anim-error-shake", titleClass: "text-ivory", tone: "dark" },
  rum: { panel: "tx-parchment popup-rum", enter: "anim-rum-slosh", titleClass: "text-wreck", tone: "paper" },
};

interface Props {
  popup: PopupConfig;
  active: boolean;
  zIndex: number;
  onClose: () => void;
}

/** One popup from the global stack, dressed according to its variant. */
export function ParchmentPopup({ popup, active, zIndex, onClose }: Props) {
  const navigate = useNavigate();
  const titleId = useId();
  const bodyId = useId();
  const look = VARIANTS[popup.variant];
  const dismissible = popup.dismissible !== false;
  const size = popup.size ?? (popup.variant === "dialogue" ? "lg" : "md");

  const runAction = (index: number) => {
    const action = popup.actions?.[index];
    if (!action) return;
    action.onClick?.();
    if (action.closes !== false) onClose();
    if (action.to) navigate(action.to);
  };

  const dialogue = popup.variant === "dialogue" && popup.illustration;

  return (
    <ModalShell
      labelledBy={titleId}
      describedBy={bodyId}
      onDismiss={dismissible ? onClose : undefined}
      active={active}
      zIndex={zIndex}
      className={`popup-size-${size}`}
      backdropClassName={popup.variant === "error" ? "backdrop-red" : popup.variant === "treasure" ? "backdrop-gold" : ""}
    >
      <div className={`popup-inner ${look.panel} ${look.enter} ${look.tone === "paper" ? "on-paper" : "on-dark"}`}>
        {popup.variant === "wooden" && (
          <>
            <span className="nail tl" />
            <span className="nail tr" />
            <span className="nail bl" />
            <span className="nail br" />
          </>
        )}
        {popup.variant === "wax" && (
          <div className="popup-seal anim-seal-impact">
            <WaxSeal size={72} />
          </div>
        )}
        {popup.variant === "rum" && <span className="rum-stain" style={{ right: "-20px", top: "-14px" }} />}
        {popup.variant === "treasure" && (
          <div className="popup-coins" aria-hidden="true">
            <GoldCoin size={30} flip />
            <GoldCoin size={22} />
            <GoldCoin size={26} flip />
          </div>
        )}

        <button type="button" className="popup-close" onClick={onClose} aria-label="Close" data-autofocus={popup.actions?.length ? undefined : true}>
          <X size={20} aria-hidden="true" />
        </button>

        {dialogue ? (
          <div className="popup-dialogue-grid">
            <div className="popup-character">{popup.illustration}</div>
            <div className="popup-speech">
              {popup.speaker && <p className="popup-speaker">{popup.speaker}</p>}
              <h2 id={titleId} className={`popup-title ${look.titleClass}`}>
                {popup.title}
              </h2>
              <div id={bodyId} className="popup-body">
                {popup.body}
              </div>
            </div>
          </div>
        ) : (
          <>
            {popup.illustration && <div className="popup-illustration">{popup.illustration}</div>}
            {popup.speaker && <p className="popup-speaker">{popup.speaker}</p>}
            <h2 id={titleId} className={`popup-title ${look.titleClass}`}>
              {popup.title}
            </h2>
            <div id={bodyId} className="popup-body">
              {popup.body}
            </div>
          </>
        )}

        {popup.actions && popup.actions.length > 0 && (
          <div className="popup-actions">
            {popup.actions.map((action, i) => (
              <button
                key={action.label}
                type="button"
                className={`popup-action ${action.primary ? "is-primary" : ""}`}
                onClick={() => runAction(i)}
                data-autofocus={i === 0 ? true : undefined}
                data-rum=""
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}
