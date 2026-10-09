export type ResourceCategory =
  | "programming"
  | "research"
  | "notes"
  | "papers"
  | "handbooks"
  | "recommendations"
  | "survival";

export const RESOURCE_CATEGORIES: { id: ResourceCategory; label: string }[] = [
  { id: "programming", label: "Programming manuals" },
  { id: "research", label: "Research papers" },
  { id: "notes", label: "Examination notes" },
  { id: "papers", label: "Previous-year papers" },
  { id: "handbooks", label: "Department handbooks" },
  { id: "recommendations", label: "Faculty recommendations" },
  { id: "survival", label: "Pirate survival guides" },
];

export interface LibraryResource {
  id: string;
  title: string;
  type: string;
  category: ResourceCategory;
  description: string;
  /** Path to a real file in /public. Only entries with a file get an open/download action. */
  file?: string;
}

export const RESOURCES: LibraryResource[] = [
  {
    id: "pointers",
    title: "Ye Olde C Pointers: A Survival Guide",
    type: "Waterlogged manual",
    category: "programming",
    description: "Chapter 1 explains pointers. Chapter 2 is the author's apology for Chapter 1.",
  },
  {
    id: "barnacle-js",
    title: "JavaScript: The Barnacle-Encrusted Parts",
    type: "Manual (abridged by the sea)",
    category: "programming",
    description: "Covers why `undefined` is not a function and why the ship is not a function either.",
  },
  {
    id: "regex",
    title: "Regular Expressions for Desperate Sailors",
    type: "Pocket scroll",
    category: "programming",
    description: "Every page is a regex. Nobody aboard can read it, including the author.",
  },
  {
    id: "buoyancy",
    title: "On the Buoyancy of Unread Theses",
    type: "Journal of Damp Studies, Vol. 3",
    category: "research",
    description: "A longitudinal study concluding that theses float precisely until someone opens them.",
  },
  {
    id: "projectors",
    title: "A Census of Missing Projectors, 1719 to Present",
    type: "Research paper",
    category: "research",
    description: "Peer-reviewed by three barnacles. Two approved. One fell off.",
  },
  {
    id: "ds-4h",
    title: "Data Structures in the Four Hours Before the Exam",
    type: "Handwritten notes, rum-stained",
    category: "notes",
    description: "Includes a tree, a heap, and a diagram that is either a linked list or a sea serpent.",
  },
  {
    id: "thermo",
    title: "Thermodynamics, Summarised by a Parrot",
    type: "Exam notes",
    category: "notes",
    description: "Every law has been reduced to the word 'CRACKER'. Surprisingly, it mostly works.",
  },
  {
    id: "nav-101",
    title: "Previous-Year Paper: Navigation 101 (partially eaten)",
    type: "Exam paper, 2025",
    category: "papers",
    description: "Questions 4 to 7 were eaten by the Kraken. Answers to them are accepted in any form.",
  },
  {
    id: "acct-midsem",
    title: "Mid-Semester Paper: Accounting for Missing Treasure",
    type: "Exam paper",
    category: "papers",
    description: "Section B asks you to find the treasure. Nobody has passed Section B.",
  },
  {
    id: "handbook",
    title: "The Blackwater Student Handbook",
    type: "Department handbook (actual scroll)",
    category: "handbooks",
    description: "Rules, rights, and a list of decks you must not enter. A real, readable file in this archive.",
    file: "/library/blackwater-handbook.txt",
  },
  {
    id: "eng-handbook",
    title: "Engineering Handbook: The Floating Edition",
    type: "Department handbook",
    category: "handbooks",
    description: "Laminated, because the previous edition dissolved in the second practical.",
  },
  {
    id: "dean-recs",
    title: "Dean Draft Recommends: Unfinished Works",
    type: "Reading list",
    category: "recommendations",
    description: "Thirty great books the Dean intends to finish reading. Annotations end abruptly at page 12.",
  },
  {
    id: "grog-recs",
    title: "Barnaby Grog's Liquid Reading List",
    type: "Faculty recommendation",
    category: "recommendations",
    description: "Every recommendation is a barrel label. The library refuses to shelve it.",
  },
  {
    id: "survival",
    title: "Pirate Survival Guide (Abridged)",
    type: "Survival guide (actual scroll)",
    category: "survival",
    description: "How to survive vivas, group projects, and the cafeteria. A real, readable file in this archive.",
    file: "/library/pirate-survival-guide.txt",
  },
  {
    id: "viva-parrot",
    title: "How to Survive a Viva with Only a Parrot",
    type: "Survival guide",
    category: "survival",
    description: "Spoiler: you cannot. The parrot can, however, and it is now a doctor.",
  },
];
