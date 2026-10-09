import type { ChatLink } from "../app/PirateExperienceProvider";
import { pick } from "../lib/random";

/**
 * The Dutchman's entire brain. It is a lookup table. It has always been a
 * lookup table. Nothing here leaves the browser.
 */
export interface DutchmanReply {
  text: string;
  links?: ChatLink[];
}

export const QUICK_REPLIES = [
  "Where is the library?",
  "How much is tuition?",
  "How do I calculate my attendance?",
  "Where are the placements?",
  "Who is in charge here?",
  "What is the meaning of this website?",
] as const;

const SCRIPTED: Record<(typeof QUICK_REPLIES)[number], DutchmanReply[]> = {
  "Where is the library?": [
    {
      text: "The library can be found beyond the corridor where hope goes to die. Mind the librarian. She is formal, and she is dead.",
      links: [
        { label: "Rum & Resources", to: "/library" },
        { label: "Show me on the map", to: "/treasure-maps" },
      ],
    },
  ],
  "How much is tuition?": [
    {
      text: "Tuition is payable in gold, paperwork, and approximately three emotional breakdowns. The finance department will happily itemise them.",
      links: [{ label: "Booty & Fees", to: "/fees" }],
    },
  ],
  "How do I calculate my attendance?": [
    {
      text: "Divide the classes ye attended by the classes held. Multiply by one hundred. Then weep. Or let the calculator weep for ye, mortal.",
      links: [{ label: "Attendance calculator", to: "/attendance" }],
    },
  ],
  "Where are the placements?": [
    {
      text: "Down in the vault of questionable offers. Bring a jar of dirt and lower expectations.",
      links: [{ label: "Placements", to: "/placements" }],
    },
  ],
  "Who is in charge here?": [
    {
      text: "The Captain. Or the previous captain. Blame is assigned by the tide. The crew manifest lists the officers who are still answering parrots.",
      links: [{ label: "Crew Manifest", to: "/faculty" }],
    },
  ],
  "What is the meaning of this website?": [
    {
      text: "I would help you, mortal, but the administrator has eaten the navigation map.",
      links: [{ label: "Back to the Poop Deck", to: "/" }],
    },
  ],
};

interface KeywordRule {
  words: string[];
  replies: DutchmanReply[];
}

const KEYWORDS: KeywordRule[] = [
  {
    words: ["fee", "fees", "pay", "payment", "money", "tuition", "cost", "gst", "invoice"],
    replies: SCRIPTED["How much is tuition?"],
  },
  {
    words: ["library", "book", "books", "resource", "resources", "read"],
    replies: SCRIPTED["Where is the library?"],
  },
  {
    words: ["attendance", "attend", "bunk", "absent", "present", "percentage"],
    replies: SCRIPTED["How do I calculate my attendance?"],
  },
  {
    words: ["placement", "placements", "job", "jobs", "career", "company", "salary", "internship", "resume"],
    replies: SCRIPTED["Where are the placements?"],
  },
  {
    words: ["result", "results", "cgpa", "gpa", "grade", "grades", "marks", "exam"],
    replies: [
      {
        text: "Your CGPA has been classified as buried treasure. Dig for it in the results portal. Bring a shovel. And a jar.",
        links: [{ label: "Walk the Plank", to: "/results" }],
      },
    ],
  },
  {
    words: ["admission", "admissions", "apply", "join", "enrol", "enroll", "application"],
    replies: [
      {
        text: "Ye wish to join the crew? The registrar will judge ye. Theatrically.",
        links: [{ label: "Join the Crew", to: "/admissions" }],
      },
    ],
  },
  {
    words: ["hostel", "room", "laundry", "roommate", "complaint", "plumbing", "water", "electricity"],
    replies: [
      {
        text: "File it in the hostel complaint barrel. The appropriate department is currently underwater, but the barrel floats.",
        links: [{ label: "Hostel Complaints", to: "/hostel/complaints" }],
      },
    ],
  },
  {
    words: ["map", "where", "building", "campus", "find", "lost", "direction", "directions"],
    replies: [
      {
        text: "Consult the treasure maps. They were drawn by a cartographer who was seasick, but they are mostly correct.",
        links: [{ label: "Treasure Maps", to: "/treasure-maps" }],
      },
    ],
  },
  {
    words: ["faculty", "professor", "teacher", "lecturer", "dean", "staff"],
    replies: SCRIPTED["Who is in charge here?"],
  },
  {
    words: ["help", "support", "it", "wifi", "broken", "projector", "emergency", "ticket"],
    replies: [
      {
        text: "Ring the Mutiny Hotline. A parrot will take your call. Whether it writes anything down is between it and the sea.",
        links: [{ label: "Mutiny Hotline", to: "/mutiny-hotline" }],
      },
    ],
  },
  {
    words: ["rule", "rules", "discipline", "brig", "appeal", "grievance", "lost and found"],
    replies: [
      {
        text: "The Brig handles discipline, grievances and lost property. Mostly it handles the lost property.",
        links: [{ label: "The Brig", to: "/brig" }],
      },
    ],
  },
  {
    words: ["rum"],
    replies: [{ text: "The rum is gone. It is always gone. Nobody knows where it goes. Ask the Senior Lecturer in Advanced Rum Management." }],
  },
  {
    words: ["secret", "easter", "konami", "code", "hidden", "dirt", "jar"],
    replies: [
      { text: "Secrets? The jar remembers every deck ye visit. The compass grows dizzy if spun too often. I have said too much. I am a skull." },
    ],
  },
  {
    words: ["hello", "hi", "ahoy", "hey", "greetings"],
    replies: [{ text: "Ahoy, mortal. I have been waiting four hundred years for someone to say that. It was not worth it." }],
  },
  {
    words: ["ai", "chatgpt", "robot", "bot", "real"],
    replies: [{ text: "I am no artificial intelligence. I am a scripted skull. Every answer I give was carved in advance by a bored pirate. Nothing ye type leaves this ship." }],
  },
];

const FALLBACKS: DutchmanReply[] = [
  { text: "The database has abandoned ship. Ask me something about fees, the library, attendance, placements, or who is in charge." },
  { text: "The cloud has been replaced by fog. Try one of the questions carved below." },
  { text: "This server be held together by rope and academic misconduct. I did not understand ye." },
  { text: "The captain has reviewed your request and chosen to ignore it. I am inclined to agree with him." },
];

export function dutchmanRespond(question: string): DutchmanReply {
  const exact = SCRIPTED[question as (typeof QUICK_REPLIES)[number]];
  if (exact) return pick(exact);
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const joined = ` ${words.join(" ")} `;
  for (const rule of KEYWORDS) {
    if (rule.words.some((w) => joined.includes(` ${w} `))) return pick(rule.replies);
  }
  return pick(FALLBACKS);
}
