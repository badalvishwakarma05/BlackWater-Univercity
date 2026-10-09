import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { CrookedLink } from "../ui/CrookedButton";
import { ParchmentPanel } from "../ui/ParchmentPanel";

interface Props {
  unlocked: boolean;
  title: string;
  hint: ReactNode;
  children: ReactNode;
}

/** Secret pages stay sealed until their Easter egg has been found. */
export function SecretGate({ unlocked, title, hint, children }: Props) {
  if (unlocked) return <>{children}</>;
  return (
    <div className="page-wrap">
      <ParchmentPanel material="parchment-dark" torn="both" tilt={-1} nails={["tl", "tr"]} className="secret-gate p-8 text-center">
        <Lock size={42} className="mx-auto text-blood" aria-hidden="true" />
        <h1 className="title-big mt-3">{title}</h1>
        <p className="stamp mt-4">Sealed by order of the captain</p>
        <div className="mx-auto mt-5 max-w-md text-lg">{hint}</div>
        <div className="mt-6">
          <CrookedLink to="/" variant="plank" tilt={1}>
            Back to the Poop Deck
          </CrookedLink>
        </div>
      </ParchmentPanel>
    </div>
  );
}
