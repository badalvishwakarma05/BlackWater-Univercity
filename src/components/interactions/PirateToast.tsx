import { useNavigate } from "react-router";
import { X } from "lucide-react";
import type { ToastConfig } from "../../app/PirateExperienceProvider";

interface Props {
  toasts: ToastConfig[];
  onDismiss: (id: string) => void;
}

/** Notices nailed to the top of the screen. Polite live region; never steals focus. */
export function PirateToastRegion({ toasts, onDismiss }: Props) {
  const navigate = useNavigate();
  return (
    <div className="toast-region" role="status" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pirate-toast anim-toast tone-${toast.tone ?? "info"}`}>
          <span className="nail tl" />
          <div className="pirate-toast-text">
            <p className="pirate-toast-title">{toast.title}</p>
            {toast.message && <p className="pirate-toast-message">{toast.message}</p>}
          </div>
          {toast.action && (
            <button
              type="button"
              className="pirate-toast-action"
              onClick={() => {
                toast.action?.onClick?.();
                if (toast.action?.to) navigate(toast.action.to);
                onDismiss(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button type="button" className="pirate-toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notice">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
