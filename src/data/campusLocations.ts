export type BuildingShape = "tower" | "block" | "screen" | "books" | "bunks" | "pot" | "desk" | "coins" | "cabins" | "skull";

export interface CampusLocation {
  id: string;
  name: string;
  purpose: string;
  description: string;
  route: string;
  landmark: string;
  x: number;
  y: number;
  shape: BuildingShape;
  link?: { to: string; label: string };
  restricted?: boolean;
}

/** Coordinates are in the campus map's 1000×680 SVG space. */
export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: "main",
    name: "Main Academic Building",
    purpose: "Lectures, seminars, and the occasional duel.",
    description: "The tallest wreck on campus: three floors, two of them above water. The third floor is for the fish.",
    route: "Head straight up from the gangplank. If you reach the sea, you have gone too far, twice.",
    landmark: "The bell that rings whenever it wants",
    x: 470,
    y: 300,
    shape: "tower",
  },
  {
    id: "eng",
    name: "Engineering Block",
    purpose: "Workshops, labs, and the ongoing argument with gravity.",
    description: "Built by the Engineering students as their first practical. It floats. Mostly.",
    route: "Follow the sound of hammering and the smell of burnt solder east of the Main Building.",
    landmark: "A pile of prototypes that 'almost worked'",
    x: 680,
    y: 250,
    shape: "block",
  },
  {
    id: "cs",
    name: "Computer Laboratory",
    purpose: "Forty computers, six of them switched on, four of them working.",
    description: "Humming, blinking, and occasionally screaming. The ethernet cables are also used as mooring lines.",
    route: "Down the corridor with the humming. If the humming stops, run.",
    landmark: "The server rack wrapped in seaweed",
    x: 760,
    y: 380,
    shape: "screen",
    link: { to: "/faculty?dept=cs", label: "Meet the Computer Science crew" },
  },
  {
    id: "library",
    name: "Library",
    purpose: "Books, scrolls, and a librarian who has been dead for some time.",
    description: "The library: turn left at the suspiciously judgmental statue, then follow the smell of old paper.",
    route: "Turn left at the suspiciously judgmental statue, then follow the smell of old paper.",
    landmark: "The suspiciously judgmental statue",
    x: 300,
    y: 220,
    shape: "books",
    link: { to: "/library", label: "Enter Rum & Resources" },
  },
  {
    id: "hostel",
    name: "Hostel",
    purpose: "Hammocks, bunks, and a roommate who may be a ghost.",
    description: "Four blocks of sleeping quarters, each damper than the last. Hot water is a rumour.",
    route: "Past the laundry line where the Kraken feeds, then up the creaking gangway.",
    landmark: "The laundry line (now mostly empty)",
    x: 200,
    y: 430,
    shape: "bunks",
    link: { to: "/hostel/complaints", label: "File a hostel complaint" },
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    purpose: "Serving Kraken-sourced cuisine since last Tuesday.",
    description: "The menu has two items: 'stew' and 'stew (spicy)'. Both are the same stew.",
    route: "Follow the seagulls. They know the way, and they will get there first.",
    landmark: "A seagull wearing a tiny chef's hat",
    x: 380,
    y: 470,
    shape: "pot",
  },
  {
    id: "exam",
    name: "Examination Hall",
    purpose: "Where hope goes to be invigilated.",
    description: "Silent, cold, and arranged in rows so the invigilator can see everyone not knowing the answers.",
    route: "Through the double doors marked 'ABANDON PHONES, ALL YE WHO ENTER'.",
    landmark: "The repaired (?) cannon",
    x: 580,
    y: 440,
    shape: "desk",
    link: { to: "/results", label: "Check your (demo) results" },
  },
  {
    id: "admin",
    name: "Administration Office",
    purpose: "Fees, forms, and the stamp that says 'NO'.",
    description: "Open Mondays between 2:00 and 2:05 PM. Please take a number. The number is 4,812.",
    route: "Follow the queue. The queue has no end, so follow it backwards.",
    landmark: "A sign reading 'BACK IN 5 MINUTES' (since 2019)",
    x: 590,
    y: 150,
    shape: "coins",
    link: { to: "/fees", label: "Visit Booty & Fees" },
  },
  {
    id: "faculty",
    name: "Faculty Cabins",
    purpose: "Where faculty live, work, and ignore emails.",
    description: "A row of locked cabins. Doors open only for office hours, which are a myth.",
    route: "Up the creaky ladder behind the Main Building. Knock. Wait. Leave.",
    landmark: "A drift of unopened envelopes",
    x: 450,
    y: 130,
    shape: "cabins",
    link: { to: "/faculty", label: "Read the Crew Manifest" },
  },
  {
    id: "basement",
    name: "Mysterious Restricted Basement",
    purpose: "[REDACTED BY ORDER OF THE CAPTAIN]",
    description: "No one goes in. Sometimes, something comes out. Marine Sciences insists it is 'just a lab'.",
    route: "You do not find the basement. The basement finds you.",
    landmark: "A door with a skull and a 'NO' sign, both upside down",
    x: 860,
    y: 560,
    shape: "skull",
    restricted: true,
  },
];
