export interface CaptainNotice {
  id: string;
  date: string;
  /** Some dates have "probably" scrawled beside them */
  probably?: boolean;
  title: string;
  detail: string;
  material: "parchment" | "lined" | "damp" | "canvas";
}

export const NOTICES: CaptainNotice[] = [
  {
    id: "cannon",
    date: "13th of Monsoon",
    probably: true,
    title: "Mid-semester examinations postponed until the cannon has been repaired.",
    detail:
      "The Examinations Office reminds all crew that the cannon is not a timer and must not be used to signal the end of an exam. New dates will be announced by bell, flag, or rumour.",
    material: "parchment",
  },
  {
    id: "vault",
    date: "2nd of the Dry Season",
    title: "The Finance Department denies having a second treasure vault.",
    detail:
      "Any students who have seen the second vault are asked to forget it. A complimentary memory-wipe biscuit is available at the bursar's window, between 2:00 and 2:05 PM.",
    material: "lined",
  },
  {
    id: "crowsnest",
    date: "Every Tuesday",
    title: "Mandatory attendance inspection. Please stop hiding in the crow's nest.",
    detail:
      "The crow's nest is not a lecture hall, a library, or a valid excuse. The crows have also complained about the noise.",
    material: "damp",
  },
  {
    id: "kraken",
    date: "Last Thursday",
    probably: true,
    title: "The cafeteria has officially recognized the Kraken as a supplier.",
    detail:
      "Calamari Mondays are cancelled out of respect for our new business partner. The Kraken has asked us to stop calling it 'the menu'.",
    material: "canvas",
  },
  {
    id: "projector",
    date: "Ongoing",
    title: "Lost: one projector remote. Last seen in the custody of a seagull.",
    detail:
      "If found, return it to the Keeper of the Broken Projector. Do not attempt to negotiate with the seagull. The seagull has a lawyer.",
    material: "parchment",
  },
];
