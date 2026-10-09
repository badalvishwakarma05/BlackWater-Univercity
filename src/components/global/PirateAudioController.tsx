import { useEffect } from "react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { unlockAudio } from "../../lib/audio";

/**
 * Browsers only allow sound after a user gesture. This waits for the first
 * tap or key press, then wakes the ship's orchestra (if sound is enabled).
 * It also tracks when a text field has focus (so fixed controls can step
 * aside for the on-screen keyboard) and when the page is scrolled (so they
 * shrink and cover less content).
 */
export function PirateAudioController() {
  const { soundOn } = useExperience();

  useEffect(() => {
    if (!soundOn) return;
    const wake = () => unlockAudio();
    window.addEventListener("pointerdown", wake, { once: true });
    window.addEventListener("keydown", wake, { once: true });
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, [soundOn]);

  useEffect(() => {
    const isTextField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT" ||
        (t.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "range"].includes((t as HTMLInputElement).type)));
    const onIn = (e: FocusEvent) => {
      if (isTextField(e.target)) document.body.classList.add("is-typing");
    };
    const onOut = () => document.body.classList.remove("is-typing");
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      document.body.classList.remove("is-typing");
    };
  }, []);

  // Tuck the fixed controls in once the visitor scrolls past the header.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      document.documentElement.classList.toggle("deck-scrolled", window.scrollY > 160);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
