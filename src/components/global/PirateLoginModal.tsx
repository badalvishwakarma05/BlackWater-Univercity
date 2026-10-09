import { useState } from "react";
import { useExperience } from "../../app/PirateExperienceProvider";

export function PirateLoginModal() {
  const { isAuthenticated, login, introDone } = useExperience();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Only show if the intro is done, and user is not authenticated
  if (!introDone || isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="panel bg-[var(--deep-sea)] p-8 border-2 border-[var(--cursed-gold)] shadow-[0_0_20px_rgba(195,154,67,0.3)] relative overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--cursed-gold)]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--cursed-gold)]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--cursed-gold)]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--cursed-gold)]" />

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-4xl text-[var(--cursed-gold)] font-[var(--font-pirate)] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
              Halt, Scallywag!
            </h2>
            <p className="text-[var(--salt-ivory)]/80 italic font-[var(--font-fell)]">
              State yer credentials before boardin'.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[var(--salt-ivory)] font-[var(--font-pirate)] text-xl tracking-wide mb-2">
                Pirate Name (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                className="w-full bg-[var(--ocean-abyss)] border border-[var(--faded-gold)] p-3 text-[var(--salt-ivory)] focus:outline-none focus:border-[var(--cursed-gold)] focus:ring-1 focus:ring-[var(--cursed-gold)] transition-colors font-[var(--font-fell)]"
                placeholder="e.g. Captain Blackbeard"
              />
            </div>
            
            <div>
              <label className="block text-[var(--salt-ivory)] font-[var(--font-pirate)] text-xl tracking-wide mb-2">
                Secret Code (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="w-full bg-[var(--ocean-abyss)] border border-[var(--faded-gold)] p-3 text-[var(--salt-ivory)] focus:outline-none focus:border-[var(--cursed-gold)] focus:ring-1 focus:ring-[var(--cursed-gold)] transition-colors font-[var(--font-fell)]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[var(--blood-red)] text-sm font-bold animate-pulse text-center">
                Ye must enter both yer name and code!
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--blood-red)] hover:bg-[var(--rust-red)] text-[var(--salt-ivory)] border-2 border-[var(--faded-gold)] py-3 px-6 font-[var(--font-pirate)] text-2xl tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            >
              Board the Ship
            </button>
          </form>
          
          {/* Faint skull background watermark */}
          <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none mix-blend-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64">
              <path d="M12 2C7.58 2 4 5.58 4 10c0 1.95.7 3.73 1.86 5.11l-.86 3.89 3.12-1.56A7.95 7.95 0 0012 18c4.42 0 8-3.58 8-8s-3.58-8-8-8zm-2.5 7.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm5 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 15c-1.66 0-3-1.12-3-2.5h6c0 1.38-1.34 2.5-3 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
