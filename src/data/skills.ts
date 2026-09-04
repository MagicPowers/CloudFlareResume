export type SkillGroup = {
  id: string;
  label: string;
  hint: string;
  items: { name: string; years?: number; core?: boolean }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "leadership",
    label: "Leadership",
    hint: "The part of the job that isn't typing.",
    items: [
      { name: "Engineering management", years: 7, core: true },
      { name: "Technical strategy", years: 7, core: true },
      { name: "Hiring & onboarding", years: 6, core: true },
      { name: "Agile facilitation", years: 8, core: true },
      { name: "Developer experience", years: 2, core: true },
      { name: "Mentorship & career growth", years: 7 },
      { name: "Cross-team alignment", years: 6 },
      { name: "Conflict resolution", years: 5 },
      { name: "Stakeholder communication", years: 7 },
    ],
  },
  {
    id: "languages",
    label: "Languages & Frameworks",
    hint: "Still opens the editor most weeks.",
    items: [
      { name: "Java", years: 10, core: true },
      { name: "JavaScript / TypeScript", years: 10, core: true },
      { name: "React", years: 10, core: true },
      { name: "Redux", years: 9 },
      { name: "Node.js", years: 7, core: true },
      { name: "SQL", years: 10, core: true },
      { name: "JUnit / Mockito", years: 8 },
      { name: "Git", years: 10, core: true },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    hint: "Ten years of AWS bills, and how to shrink them.",
    items: [
      { name: "AWS EC2 / ECS / ELB", years: 8, core: true },
      { name: "Kubernetes", years: 3, core: true },
      { name: "Aurora / RDS", years: 7, core: true },
      { name: "S3", years: 8 },
      { name: "CloudWatch", years: 7 },
      { name: "QuickSight", years: 4 },
      { name: "AWS Secrets Manager", years: 2 },
      { name: "CI/CD pipelines", years: 8, core: true },
      { name: "Cost optimisation", years: 4, core: true },
    ],
  },
  {
    id: "data",
    label: "Data & Platform",
    hint: "Where the bodies are usually buried.",
    items: [
      { name: "MySQL", years: 10, core: true },
      { name: "PostgreSQL", years: 5 },
      { name: "MongoDB", years: 2 },
      { name: "Redis", years: 8 },
      { name: "ETL design", years: 4, core: true },
      { name: "DialogFlow / NLP", years: 3 },
    ],
  },
  {
    id: "tooling",
    label: "Tooling",
    hint: "The stuff on the second monitor.",
    items: [
      { name: "IntelliJ IDEA" },
      { name: "VS Code" },
      { name: "GitKraken" },
      { name: "TablePlus" },
      { name: "MySQL Workbench" },
      { name: "Postman" },
      { name: "Jira / Confluence" },
      { name: "GitLab" },
      { name: "SwaggerHub" },
      { name: "FigJam" },
      { name: "Photoshop" },
    ],
  },
  {
    id: "human",
    label: "Human Languages",
    hint: "A computer science degree with a linguistics habit.",
    items: [
      { name: "English", core: true },
      { name: "Gaeilge (Modern Irish)", core: true },
      { name: "Gàidhlig (Scottish Gaelic)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* The character sheet. Same person, different rulebook.               */
/* ------------------------------------------------------------------ */

export type Ability = {
  key: string;
  name: string;
  score: number;
  /** What this actually measures in the real world. */
  maps: string;
  evidence: string;
};

export const character = {
  name: "David Power",
  class: "Engineering Manager",
  subclass: "Oath of the Zero-Downtime Migration",
  multiclass: "Software Engineer 6 / Bard 2",
  level: 10,
  background: "Science Gallery Mediator",
  alignment: "Lawful Pragmatic",
  hitPoints: { current: 88, max: 92 },
  armourClass: 17,
  proficiencyBonus: 4,
  speed: "30 ft (120 ft by bicycle)",
  inspiration: true,
} as const;

export const abilities: Ability[] = [
  {
    key: "STR",
    name: "Infrastructure",
    score: 16,
    maps: "Cloud, Kubernetes, the load-bearing walls",
    evidence: "Stood up dedicated AWS infra, pipelines, auth, DBs and K8s for a whole product.",
  },
  {
    key: "DEX",
    name: "Hands-on Craft",
    score: 15,
    maps: "Still writing Java and React",
    evidence: "Kept ~30% of a leadership role in the codebase, deliberately.",
  },
  {
    key: "CON",
    name: "Operational Resilience",
    score: 18,
    maps: "Uptime, incidents, holding the line",
    evidence: "22 months as acting CTO with continuous production uptime.",
  },
  {
    key: "INT",
    name: "Architecture",
    score: 16,
    maps: "System design and technical strategy",
    evidence: "Decoupled a live 5,000-user platform from its legacy parent.",
  },
  {
    key: "WIS",
    name: "Judgement",
    score: 17,
    maps: "Knowing which fire to let burn",
    evidence: "Deleted 90k lines of legacy rather than maintaining it.",
  },
  {
    key: "CHA",
    name: "Communication",
    score: 18,
    maps: "Humans, from graduates to executives",
    evidence: "Two years explaining science to the public before ever managing engineers.",
  },
];

export type Feat = {
  name: string;
  type: "Action" | "Passive" | "Ritual" | "Legendary" | "Reaction";
  cost?: string;
  text: string;
  real: string;
};

export const feats: Feat[] = [
  {
    name: "Legacy Cleave",
    type: "Action",
    cost: "1 quarter",
    text: "Destroy up to 90,000 lines of legacy code in a single sweep. Deals no damage to production.",
    real: "Removed ~90k lines of dead code at Hertz while reducing, not raising, incident count.",
  },
  {
    name: "Zero-Downtime Migration",
    type: "Legendary",
    cost: "Once per platform",
    text: "Move 5,000 creatures to a new plane of existence. None of them notice.",
    real: "Separated the European OneFleet platform from the US application with no customer disruption.",
  },
  {
    name: "Aura of Cost Reduction",
    type: "Passive",
    text: "All allied cloud invoices within 60 ft are reduced by 66%. Stacks with Credit Bargaining.",
    real: "Cut Revium's AWS infrastructure cost by 66% with no performance regression.",
  },
  {
    name: "Credit Bargaining",
    type: "Action",
    text: "Persuade a cloud vendor to part with $125,000 in credits. DC 22 Charisma check.",
    real: "Secured over $125k in cloud and infrastructure credits.",
  },
  {
    name: "Summon Engineer",
    type: "Ritual",
    cost: "Personal network",
    text: "Conjure a competent engineer without paying the recruiter toll.",
    real: "Hired two engineers directly through industry contacts, reducing time-to-hire and fees.",
  },
  {
    name: "Rite of Remote Work",
    type: "Ritual",
    cost: "March 2020",
    text: "Relocate an entire organisation to their homes. Operations continue uninterrupted.",
    real: "Led Webio's remote-first transition through COVID-19, technical and non-technical staff alike.",
  },
  {
    name: "Tongues",
    type: "Passive",
    text: "Speak English, Gaeilge, Gàidhlig and Java. Understand product managers.",
    real: "Computer Science, Linguistics and Modern Irish at Trinity; Scottish Gaelic at Glasgow.",
  },
  {
    name: "Party Growth",
    type: "Passive",
    text: "The party expands from 8 to 18 without losing initiative order.",
    real: "Grew Webio's technical team from 8 to 18 engineers, including a new Polish team.",
  },
  {
    name: "Retrospective",
    type: "Reaction",
    cost: "Weekly",
    text: "After the party takes damage, the whole table learns something. 4 Ls or Three Little Pigs.",
    real: "Introduced company-wide weekly retrospectives at Revium and a tech-wide retro at Webio.",
  },
];

export const inventory = [
  { name: "IntelliJ IDEA", note: "+2 refactoring" },
  { name: "GitKraken", note: "reveals branch topology" },
  { name: "TablePlus", note: "attunement required" },
  { name: "Postman", note: "throws requests at range" },
  { name: "FigJam", note: "summons diagrams" },
  { name: "Road bicycle", note: "Mizen to Malin, attuned" },
  { name: "Set of dice", note: "d20, well used" },
];

export const savingThrows = [
  { name: "Production incident at 4pm Friday", modifier: "+7", proficient: true },
  { name: "Ambiguous requirements", modifier: "+6", proficient: true },
  { name: "Difficult one-to-one", modifier: "+7", proficient: true },
  { name: "Meeting that could have been an email", modifier: "-1", proficient: false },
  { name: "Undocumented legacy backend", modifier: "+8", proficient: true },
];
