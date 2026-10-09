export interface Department {
  id: "cs" | "eng" | "bus" | "hum" | "mar";
  name: string;
  motto: string;
  head: string;
  building: string;
  courses: string[];
  confession: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: "cs",
    name: "Computer Science",
    motto: "We have successfully deployed three websites and one suspicious calculator.",
    head: "Captain Ada Bytebeard",
    building: "Computer Laboratory",
    courses: ["Data Structures & Buried Arrays", "Operating Ships", "Compiler Design (Mostly Cursing)", "Networks: The Message-in-a-Bottle Protocol"],
    confession: "Ships with exactly one working semicolon key, shared on a rota.",
  },
  {
    id: "eng",
    name: "Engineering",
    motto: "If it floats, it passes the first practical.",
    head: "Bosun Gideon Fuse",
    building: "Engineering Block",
    courses: ["Applied Buoyancy", "Thermodynamics of Cannon Fire", "Structural Rope Analysis", "Leak Management Lab"],
    confession: "The second practical is whether it keeps floating. Nobody has passed the second practical.",
  },
  {
    id: "bus",
    name: "Business",
    motto: "Our accounting department has misplaced the treasure again.",
    head: "Quartermaster Ledgerly Vane",
    building: "Administration Office",
    courses: ["Plunder Economics", "Accounting for Missing Treasure", "Negotiating with Mutineers", "Ethics (Elective, Rarely Chosen)"],
    confession: "The balance sheet balances if you tilt it 14 degrees to port.",
  },
  {
    id: "hum",
    name: "Humanities",
    motto: "We have read every book on board. Twice. One of them was a menu.",
    head: "Dean Morwenna Draft",
    building: "Main Academic Building",
    courses: ["Sea Shanty Composition", "The Literature of Shipwrecks", "Philosophy of Walking Planks", "Advanced Insults in Three Languages"],
    confession: "Our dissertations are excellent. We will finish one any day now.",
  },
  {
    id: "mar",
    name: "Marine Sciences",
    motto: "The ocean has filed a complaint regarding our research methods.",
    head: "Professor Coraline Barnacle",
    building: "Mysterious Restricted Basement",
    courses: ["Cephalopod Diplomacy", "Tidal Mechanics", "Field Methods: Falling In", "Kraken Relations Seminar"],
    confession: "The Kraken is a research partner, not a test subject. It insisted we write that down.",
  },
];

export function departmentName(id: string): string {
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? "Unknown Deck";
}
