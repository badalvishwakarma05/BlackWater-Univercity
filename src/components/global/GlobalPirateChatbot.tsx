import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { RotateCcw, Send, X } from "lucide-react";
import { useExperience } from "../../app/PirateExperienceProvider";
import { QUICK_REPLIES, dutchmanRespond } from "../../data/chatbot";
import { useTimeouts } from "../../hooks/useTimeouts";
import { DutchmanSkull } from "../svg/DutchmanSkull";
import { PirateTooltip } from "../interactions/PirateTooltip";

/**
 * THE DUTCHMAN. A floating, barnacled, scripted skull. Every reply comes from
 * a local lookup table; nothing typed here is sent anywhere.
 */
export function GlobalPirateChatbot() {
  const { abyss, chatOpen, setChatOpen, chatMessages, addChatMessages, resetChat, play } = useExperience();
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [talking, setTalking] = useState(false);
  const { later } = useTimeouts();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(chatOpen);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus({ preventScroll: true });
    else if (wasOpen.current) launcherRef.current?.focus({ preventScroll: true });
    wasOpen.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [chatMessages, thinking, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[aria-modal="true"]')) setChatOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chatOpen, setChatOpen]);

  if (abyss) return null;

  const ask = (question: string) => {
    const q = question.trim().slice(0, 240);
    if (!q || thinking) return;
    addChatMessages([{ from: "mortal", text: q }]);
    setThinking(true);
    setTalking(true);
    later(() => {
      const reply = dutchmanRespond(q);
      addChatMessages([{ from: "dutchman", text: reply.text, links: reply.links }]);
      setThinking(false);
      play("bubble");
      later(() => setTalking(false), 1100);
    }, 650 + Math.random() * 650);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
    setDraft("");
  };

  return (
    <div className="global-chat global-fixed">
      {chatOpen && (
        <section id={panelId} role="dialog" aria-labelledby={titleId} className="chat-panel tx-parchment-dark anim-chat-surface">
          <header className="chat-titlebar tx-wood">
            <DutchmanSkull size={40} talking={talking} />
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="font-pirate text-2xl leading-none text-gold">
                THE DUTCHMAN
              </h2>
              <p className="font-type text-[0.68rem] text-parchment">Scripted skull · no AI · nothing leaves this ship</p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory hover:bg-black/30"
              aria-label="Start the conversation over"
              title="Start over"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory hover:bg-black/30"
              aria-label="Close the Dutchman"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div ref={logRef} className="chat-log" role="log" aria-live="polite" aria-label="Conversation with the Dutchman">
            {chatMessages.map((m) => (
              <div key={m.id} className={`chat-bubble from-${m.from}`}>
                <span className="sr-only">{m.from === "dutchman" ? "The Dutchman says:" : "You said:"}</span>
                {m.text}
                {m.links && m.links.length > 0 && (
                  <div>
                    {m.links.map((link) => (
                      <Link
                        key={link.to + link.label}
                        to={link.to}
                        className="chat-link"
                        onClick={() => {
                          if (window.matchMedia("(max-width: 639px)").matches) setChatOpen(false);
                        }}
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="chat-bubble from-dutchman" aria-label="The Dutchman is gurgling">
                <span className="typing-dot">●</span> <span className="typing-dot">●</span> <span className="typing-dot">●</span>
              </div>
            )}
          </div>

          <div className="chat-quick" aria-label="Quick questions">
            {QUICK_REPLIES.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)} disabled={thinking}>
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 p-2">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Ask the Dutchman something
            </label>
            <input
              id={`${panelId}-input`}
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={240}
              placeholder="Speak, mortal…"
              autoComplete="off"
              className="pirate-input min-w-0 flex-1"
            />
            <button
              type="submit"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border-2 border-ink bg-gold text-ink"
              aria-label="Send to the Dutchman"
              disabled={thinking || !draft.trim()}
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <PirateTooltip text="What do you want from me, mortal?" placement="left">
        {(tooltipId) => (
          <button
            ref={launcherRef}
            type="button"
            className="chat-launch anim-bob"
            onClick={() => {
              play("bubble");
              setChatOpen(!chatOpen);
            }}
            aria-expanded={chatOpen}
            aria-controls={chatOpen ? panelId : undefined}
            aria-label={chatOpen ? "Close the Dutchman chat" : "Open the Dutchman chat"}
            aria-describedby={tooltipId}
          >
            <DutchmanSkull talking={talking && !chatOpen} />
            <span className="chat-launch-label" aria-hidden="true">
              THE DUTCHMAN
            </span>
          </button>
        )}
      </PirateTooltip>
    </div>
  );
}
