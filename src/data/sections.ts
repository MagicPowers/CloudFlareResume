export type Section = {
  id: string;
  label: string;
  /** Shown in the command palette and the terminal's `ls`. */
  hint: string;
  nav: boolean;
};

export const sections: Section[] = [
  { id: "work", label: "Work", hint: "Roles, in reverse order", nav: true },
  { id: "timeline", label: "Timeline", hint: "The whole decade, scrollable", nav: true },
  { id: "portraits", label: "Portraits", hint: "Eleven years of headshots", nav: false },
  { id: "skills", label: "Skills", hint: "What I actually use", nav: true },
  { id: "character", label: "Character Sheet", hint: "The same CV, in d20", nav: true },
  { id: "gallery", label: "Gallery", hint: "Photos from every era", nav: true },
  { id: "cycling", label: "Cycling", hint: "Mizen to Malin, and back roads", nav: false },
  { id: "contact", label: "Contact", hint: "Say hello", nav: true },
];
