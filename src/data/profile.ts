export const profile = {
  name: "David Power",
  firstName: "David",
  lastName: "Power",
  initials: "DP",
  title: "Software Engineering Tech Lead",
  subtitle: "Engineering Manager",
  company: "Hertz",
  location: "Dublin, Ireland",
  citizenship: "Irish Citizen",
  email: "powerd3@tcd.ie",
  phone: "(087) 6833198",
  phoneHref: "+353876833198",
  linkedin: "https://linkedin.com/in/powerd3",
  linkedinHandle: "powerd3",
  site: "https://davidpower.eu",

  /** One line. The thing a recruiter reads in 1.5 seconds. */
  tagline:
    "I take tangled platforms and the teams around them, and make both ship faster.",

  /** Three sentences. The thing a hiring manager reads in fifteen. */
  summary: [
    "Engineering leader with a decade in Dublin startups and enterprise, currently leading two teams on Hertz's European fleet maintenance platform.",
    "I've spent most of my career on the unglamorous, high-leverage work: separating entangled systems, cutting cloud spend, deleting legacy code, and building the delivery process that lets a team release without asking permission.",
    "Twenty-two months as acting CTO taught me that the hardest problems in engineering are rarely the code.",
  ],

  /** Numbers that survived a sanity check. */
  headline: [
    { value: "10", suffix: "yrs", label: "Shipping software" },
    { value: "22", suffix: "mo", label: "As acting CTO" },
    { value: "18", suffix: "", label: "Engineers led at peak" },
    { value: "90k", suffix: "", label: "Lines of legacy deleted" },
  ],

  availability: {
    status: "open" as const,
    label: "Open to Engineering Manager & Tech Lead roles",
    detail: "Dublin / hybrid / remote-EU",
  },
} as const;

export type Profile = typeof profile;
