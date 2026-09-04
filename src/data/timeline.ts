import type { EraId } from "./gallery.types";

export type MilestoneKind = "role" | "ship" | "study" | "life" | "team";

export type Milestone = {
  id: string;
  /** YYYY-MM */
  at: string;
  kind: MilestoneKind;
  title: string;
  org?: string;
  detail: string;
  era: EraId;
  colour: string;
  /** Rendered larger, with a filled marker. */
  major?: boolean;
};

export const KIND_LABEL: Record<MilestoneKind, string> = {
  role: "New role",
  ship: "Shipped",
  study: "Study",
  life: "Life",
  team: "Team",
};

export const timeline: Milestone[] = [
  {
    id: "tcd-start",
    at: "2011-09",
    kind: "study",
    title: "Trinity College Dublin",
    org: "CS, Linguistics & Modern Irish",
    detail:
      "Started a degree that nobody could quite categorise. It turned out to be excellent training for a job that is mostly translation.",
    era: "trinity",
    colour: "#8B9DFF",
    major: true,
  },
  {
    id: "science-gallery",
    at: "2013-05",
    kind: "role",
    title: "Mediator",
    org: "Science Gallery Dublin",
    detail:
      "Two and a half years explaining hard science to whoever walked through the door, plus soldering workshops in the MakeShop and TEDx Dublin.",
    era: "science-gallery",
    colour: "#E86A92",
  },
  {
    id: "glasgow",
    at: "2013-09",
    kind: "study",
    title: "Erasmus, University of Glasgow",
    org: "Computing Science & Scottish Gaelic",
    detail: "A year in Scotland. Added a third language and a taste for hills.",
    era: "trinity",
    colour: "#8B9DFF",
  },
  {
    id: "anatomy",
    at: "2014-06",
    kind: "life",
    title: "Curator, Anatomy Department",
    org: "Trinity College Dublin",
    detail:
      "A summer restoring century-old pathological specimens. Genuinely the strangest line on the CV.",
    era: "trinity",
    colour: "#E86A92",
  },
  {
    id: "graduation",
    at: "2015-05",
    kind: "study",
    title: "Graduated",
    org: "Trinity College Dublin",
    detail: "Second Class Honours, First Division.",
    era: "trinity",
    colour: "#8B9DFF",
  },
  {
    id: "webio-join",
    at: "2016-09",
    kind: "role",
    title: "Graduate Developer",
    org: "Webio",
    detail:
      "Joined a startup team called the PreCogs. Learned React, Redux, Java, MySQL and Redis roughly all at once.",
    era: "webio-early",
    colour: "#F5A65C",
    major: true,
  },
  {
    id: "chatbot",
    at: "2017-04",
    kind: "ship",
    title: "The chatbot that bought us time",
    org: "Webio",
    detail:
      "Built a hotel booking chatbot on DialogFlow's NLP under real pressure. It helped secure funding at a moment the company badly needed it.",
    era: "webio-early",
    colour: "#F5A65C",
    major: true,
  },
  {
    id: "senior",
    at: "2017-09",
    kind: "role",
    title: "Senior Engineer",
    org: "Webio",
    detail:
      "Became the person who onboarded everyone else, ran the support rota, and held the system together while the company found its feet.",
    era: "webio-early",
    colour: "#F5A65C",
  },
  {
    id: "team-lead",
    at: "2019-03",
    kind: "role",
    title: "Technical Team Lead",
    org: "Webio",
    detail:
      "First real leadership role. Agile ceremonies, six direct reports, and the beginning of caring more about the team than the codebase.",
    era: "webio-lead",
    colour: "#F5A65C",
    major: true,
  },
  {
    id: "remote",
    at: "2020-03",
    kind: "team",
    title: "Everyone home, in a weekend",
    org: "Webio",
    detail:
      "Led the remote-first transition through COVID-19 — technical teams and non-technical teams alike. Operations never stopped.",
    era: "webio-lead",
    colour: "#4ECDC4",
    major: true,
  },
  {
    id: "acting-cto",
    at: "2020-06",
    kind: "role",
    title: "Acting CTO",
    org: "Webio · 22 months",
    detail:
      "Full production access, all server-side operations on AWS, and the CTO's calendar. Continuous uptime the whole way through.",
    era: "webio-lead",
    colour: "#F5A65C",
    major: true,
  },
  {
    id: "series-a",
    at: "2021-06",
    kind: "team",
    title: "Series A, and the growth after it",
    org: "Webio",
    detail:
      "Team went from 8 to 18 engineers, including integrating a new Polish counterpart team.",
    era: "webio-lead",
    colour: "#F5A65C",
  },
  {
    id: "dx",
    at: "2023-03",
    kind: "role",
    title: "Senior Tech & Developer Experience Lead",
    org: "Webio",
    detail:
      "Created the DX function. A 29-question monthly survey, a tooling overhaul, and four disciplines pulling in the same direction.",
    era: "webio-dx",
    colour: "#4ECDC4",
    major: true,
  },
  {
    id: "imi",
    at: "2023-09",
    kind: "study",
    title: "Leadership Development Program",
    org: "Irish Management Institute",
    detail: "Formal training to go with seven years of learning it the hard way.",
    era: "webio-dx",
    colour: "#4ECDC4",
  },
  {
    id: "revium",
    at: "2024-04",
    kind: "role",
    title: "Lead Software Engineer",
    org: "Revium",
    detail:
      "Contractors in Ukraine, England and Ireland. One sprint board, weekly retros, and a 30% lift in delivery.",
    era: "revium",
    colour: "#7C6BFF",
    major: true,
  },
  {
    id: "aws-cut",
    at: "2024-08",
    kind: "ship",
    title: "66% off the AWS bill",
    org: "Revium",
    detail:
      "Cut infrastructure cost by two-thirds without touching performance, then negotiated $125,000 in cloud credits on top.",
    era: "revium",
    colour: "#7C6BFF",
    major: true,
  },
  {
    id: "hertz",
    at: "2024-12",
    kind: "role",
    title: "Software Engineering Tech Lead",
    org: "Hertz",
    detail:
      "Two teams, European fleet maintenance, and a platform that needed to be pulled free of its American parent.",
    era: "hertz",
    colour: "#D4F55C",
    major: true,
  },
  {
    id: "onefleet",
    at: "2025-09",
    kind: "ship",
    title: "OneFleet stands on its own",
    org: "Hertz",
    detail:
      "Separated a live platform serving 5,000+ users from the legacy US application. Dedicated AWS infrastructure, pipelines, auth, databases, Kubernetes. Zero customer disruption.",
    era: "hertz",
    colour: "#D4F55C",
    major: true,
  },
  {
    id: "legacy",
    at: "2026-03",
    kind: "ship",
    title: "90,000 lines, deleted",
    org: "Hertz",
    detail:
      "The best code is the code you get to remove. Incident count went down, not up.",
    era: "hertz",
    colour: "#D4F55C",
  },
];

export const timelineSorted = [...timeline].sort((a, b) =>
  a.at.localeCompare(b.at),
);
