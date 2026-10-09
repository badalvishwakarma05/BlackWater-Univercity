# Blackwater University

A satirical, fully interactive college website designed and operated (badly) by pirates.
Everything is fictional: no real students, fees, results, employers or payments.

Built with React 19, React Router, TypeScript, Vite and Tailwind CSS v4. All art is
original inline SVG (with custom high-resolution PNG elements); all sounds are synthesised live with the Web Audio API.

## Running it

Requires Node.js 20.19+ or 22.12+ (or Bun).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

Because it uses client-side routing, a static host must rewrite unknown paths to
`index.html` so deep links (and the 404 page) work.

## Routes

| Path | Deck |
| --- | --- |
| `/` | The Poop Deck (home) |
| `/admissions` | Join the Crew |
| `/fees` | Booty & Fees |
| `/treasure-maps` | Treasure Maps (supports `?loc=library` etc.) |
| `/results` | Walk the Plank (demo IDs: `BW-2026-0007`, any `BW-YYYY-NNNN`) |
| `/brig` | The Brig |
| `/library` | Rum & Resources |
| `/faculty` | Crew Manifest (supports `?dept=cs`) |
| `/attendance` | Attendance |
| `/placements` | Placements |
| `/hostel/complaints` | Hostel Complaints |
| `/mutiny-hotline` | Mutiny Hotline |
| `/the-code` | Secret: unlocked by the Jar of Dirt |
| `/faculty-cabin-map` | Secret: unlocked by the compass |
| anything else | The Abyss (404) |

## Features & Easter eggs

- **Boarding Pass (Login)**: Before accessing the ship (post-intro), ye must pass the Pirate Login Modal overlay by providing yer Pirate Name and Secret Code.
- **Custom Pirate Cursor**: A cinematic custom cursor featuring crossed flintlock pistol and cutlass. It follows your mouse smoothly, glows with gold, scales, and rotates when hovering over interactive elements.
- **Jar of Dirt** (bottom-left): gains one handful the first time you visit each normal
  page in a browser session. The total persists in `localStorage`. At 6 handfuls the lid
  opens and `/the-code` unlocks.
- **Compass** (top-right): each spin sails to a random page. Spin it 5 times in one
  session to reveal the Faculty Cabin Map.
- **Konami code**: ↑ ↑ ↓ ↓ ← → ← → B A (outside form fields) summons the storm. Enter it
  again or press "Calm the seas" to exit. The Code page also has a button for it.
- **Library after hours**: digital access is refused from 10:00 PM to 6:00 AM local time.
  Test it without touching your clock via the page's "Hourglass of Testing" or
  `/library?hour=22`.

To reset all progress, clear the site's local and session storage.

## Notes

- The intro plays once per browser session, is skippable (button or Escape) and has a
  16-second fail-safe. Reduced-motion users get a short still version.
- Forms are simulations. Nothing is sent anywhere; only non-sensitive demo state is kept in
  browser storage, and corrupted storage values are ignored safely.
- Fonts load from Google Fonts with local fallbacks.
