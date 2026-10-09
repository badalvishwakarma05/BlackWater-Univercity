import { useExperience } from "../app/PirateExperienceProvider";

/** Returns a `play(sound)` function that respects the visitor's mute setting. */
export function usePirateAudio() {
  const { play, soundOn, toggleSound } = useExperience();
  return { play, soundOn, toggleSound };
}
