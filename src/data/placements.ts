/** EVERYTHING HERE IS FICTIONAL DEMONSTRATION DATA. No real companies, salaries, or outcomes. */

export interface Employer {
  id: string;
  name: string;
  motto: string;
  role: string;
  /** Demonstration package, in lakhs per annum, plus perks */
  packageLpa: number;
  perk: string;
  minCgpa: number;
  maxBacklogs: number;
  minAttendance: number;
  requiresSwimming?: boolean;
}

export const EMPLOYERS: Employer[] = [
  {
    id: "arrr",
    name: "Arrr Technologies",
    motto: "We put the 'arr' in 'array'.",
    role: "Junior Plank Engineer",
    packageLpa: 6.5,
    perk: "one parrot (used)",
    minCgpa: 6.5,
    maxBacklogs: 1,
    minAttendance: 60,
  },
  {
    id: "pearl",
    name: "Black Pearl Systems",
    motto: "Enterprise solutions, cursed since 1719.",
    role: "Associate Curse Engineer",
    packageLpa: 11,
    perk: "a cabin with a porthole",
    minCgpa: 7.5,
    maxBacklogs: 0,
    minAttendance: 70,
  },
  {
    id: "seven",
    name: "Seven Seas Consulting",
    motto: "We'll tell you what you already know, at sea.",
    role: "Analyst (Seasick)",
    packageLpa: 9,
    perk: "unlimited hardtack",
    minCgpa: 5,
    maxBacklogs: 2,
    minAttendance: 50,
  },
  {
    id: "kraken",
    name: "Kraken Cloud Services",
    motto: "Eight arms. Infinite scale. Occasional data loss.",
    role: "Deep-Sea Site Reliability Engineer",
    packageLpa: 18,
    perk: "a ship (ship not included)",
    minCgpa: 8,
    maxBacklogs: 0,
    minAttendance: 75,
    requiresSwimming: true,
  },
  {
    id: "rumrunner",
    name: "RumRunner Software",
    motto: "Ship fast. Ship drunk. Ship anyway.",
    role: "Release Smuggler",
    packageLpa: 5.2,
    perk: "the rum (gone)",
    minCgpa: 6,
    maxBacklogs: 3,
    minAttendance: 50,
  },
];

export const PLACEMENT_STATS = [
  { label: "Crew placed (demo)", value: "61%", note: "of those who didn't abandon ship" },
  { label: "Median package (demo)", value: "₹4.2 LPA", note: "plus scurvy insurance" },
  { label: "Highest package (demo)", value: "₹18 LPA", note: "and a ship, ship not included" },
  { label: "Offers rescinded (demo)", value: "2", note: "both by the Kraken" },
];

/** Demo share of students placed per department (percent). */
export const DEPT_PLACEMENT: { dept: string; pct: number }[] = [
  { dept: "Computer Science", pct: 72 },
  { dept: "Engineering", pct: 64 },
  { dept: "Business", pct: 58 },
  { dept: "Humanities", pct: 41 },
  { dept: "Marine Sciences", pct: 33 },
];

export const CAREER_TIPS = [
  "Know your data structures. The ocean does not care about your excuses, matey.",
  "Your resume needs fewer adjectives and more evidence, matey.",
  "Git commit messages are not a suitable place to confess to crimes.",
  "If the interviewer asks where you see yourself in five years, 'captain' is acceptable. 'Captain of their ship' is not.",
  "A portfolio with one finished project beats a fleet of abandoned ones.",
  "Practise explaining your code out loud. The parrot will judge you, but it will also prepare you.",
  "Read the job description before the interview. The whole thing. Even the boring treasure map at the bottom.",
  "Never say 'it works on my machine'. Your machine is not invited to the job.",
];

export const RECRUITMENT_NOTICES = [
  { company: "Arrr Technologies", text: "Pre-placement talk on the Poop Deck, three bells after noon. Bring your own lifejacket." },
  { company: "Kraken Cloud Services", text: "Coding round moved underwater. Waterproof laptops recommended, gills preferred." },
  { company: "Seven Seas Consulting", text: "Case interview: 'How many barrels of rum are in this harbour?' Show your working." },
  { company: "RumRunner Software", text: "Walk-in interviews. Stagger-ins also accepted." },
];

export const PREP_RESOURCES = [
  { title: "The Interview Plank: 40 questions, 0 mercy", detail: "Common technical questions, answered by survivors." },
  { title: "Mock interviews with the Admiral of Algorithms", detail: "Thursdays at low tide. He will ask about Big-O. He will be disappointed." },
  { title: "Group discussion survival drill", detail: "Learn to speak over a parrot without becoming a parrot." },
  { title: "Aptitude practice scrolls", detail: "Trains, pipes, and how long it takes three pirates to dig one hole." },
];
