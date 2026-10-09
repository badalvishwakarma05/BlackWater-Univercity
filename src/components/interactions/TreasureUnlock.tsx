import { TreasureChest } from "../svg/Props";
import { GoldCoin } from "../svg/GoldCoin";

/** The illustration used whenever a secret is unearthed. */
export function TreasureUnlock({ caption }: { caption?: string }) {
  return (
    <div className="treasure-unlock" aria-hidden="true">
      <div className="treasure-unlock-coins">
        <GoldCoin size={26} flip />
        <GoldCoin size={18} />
        <GoldCoin size={22} flip />
      </div>
      <TreasureChest size={150} open />
      {caption && <p className="treasure-unlock-caption">{caption}</p>}
    </div>
  );
}
