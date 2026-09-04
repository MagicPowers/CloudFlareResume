export type Role = {
  id: string;
  company: string;
  companyId: string;
  title: string;
  /** Shown when the title alone undersells the job. */
  altTitle?: string;
  start: string;
  end: string | "present";
  location: string;
  arrangement?: string;
  /** The single sentence that matters. Used in compact/recruiter mode. */
  headline: string;
  /** Full bullets, from the CV. */
  bullets: string[];
  /** Pulled-out numbers rendered as stat chips. */
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** Photo slugs from src/data/gallery.ts that belong to this era. */
  photos?: string[];
  accent: string;
};

export type Company = {
  id: string;
  name: string;
  blurb: string;
  url?: string;
};

export const companies: Company[] = [
  {
    id: "hertz",
    name: "Hertz",
    blurb: "Global vehicle rental. European fleet maintenance platform.",
    url: "https://www.hertz.com",
  },
  {
    id: "revium",
    name: "Revium",
    blurb: "Early-stage sales intelligence startup.",
  },
  {
    id: "webio",
    name: "Webio",
    blurb: "Conversational AI for credit and collections.",
    url: "https://www.webio.com",
  },
  {
    id: "science-gallery",
    name: "Science Gallery Dublin",
    blurb: "Where art and science collide, at Trinity College Dublin.",
  },
  {
    id: "tcd-anatomy",
    name: "Anatomy Dept, Trinity College Dublin",
    blurb: "Historic pathological specimen collection.",
  },
];

export const roles: Role[] = [
  {
    id: "hertz-tech-lead",
    company: "Hertz",
    companyId: "hertz",
    title: "Software Engineering Tech Lead",
    altTitle: "Engineering Manager",
    start: "2024-12",
    end: "present",
    location: "Dublin, Ireland",
    arrangement: "Hybrid",
    headline:
      "Split a live 5,000-user platform away from its US parent application without a minute of customer disruption.",
    bullets: [
      "Lead two engineering teams responsible for Hertz's European fleet maintenance platform, managing five engineers while setting technical direction across architecture, delivery and operational excellence.",
      "Separated the European OneFleet platform from the legacy US maintenance application without customer disruption, decoupling a live production platform serving more than 5,000 users. The migration eliminated release dependencies between geographically distributed teams, removing deployment bottlenecks, reducing cross-team regressions and enabling independent release schedules.",
      "Established OneFleet as an independently deployable product by delivering dedicated AWS infrastructure, deployment pipelines, authentication, databases and Kubernetes workloads, allowing the European engineering organisation to release autonomously.",
      "Improved platform reliability by eliminating recurring production incidents, stabilising Kubernetes workloads and redesigning critical ETL processes to prevent third-party integration bottlenecks.",
      "Accelerated engineering delivery through modern CI/CD pipelines, automated quality gates and removal of approximately 90,000 lines of legacy code, significantly reducing technical debt.",
    ],
    metrics: [
      { value: "5,000+", label: "users migrated, zero disruption" },
      { value: "90k", label: "lines of legacy code removed" },
      { value: "2", label: "teams led" },
    ],
    stack: [
      "AWS",
      "Kubernetes",
      "Java",
      "CI/CD",
      "ETL",
      "Terraform",
      "PostgreSQL",
    ],
    accent: "#D4F55C",
  },
  {
    id: "revium-lead",
    company: "Revium",
    companyId: "revium",
    title: "Lead Software Engineer",
    start: "2024-04",
    end: "2024-11",
    location: "Dublin, Ireland",
    arrangement: "Hybrid",
    headline:
      "Cut AWS spend by 66% and raised $125k in cloud credits while pulling three countries' worth of contractors into one working team.",
    bullets: [
      "Orchestrated cross-functional communication among geographically dispersed contractors across Ukraine, England and Ireland, resulting in a 30% increase in development efficiency.",
      "Implemented agile methodologies — standups, backlog refinement, sprint planning, retrospectives — improving sprint completion rates by 25%.",
      "Resolved a critical security vulnerability by introducing AWS Secrets Manager for key storage, removing plaintext credentials and bringing the platform into security compliance.",
      "Secured over $125,000 in cloud and infrastructure credits, reducing operational costs while enhancing the company's ability to scale.",
      "Achieved a 66% reduction in AWS infrastructure costs without compromising system performance.",
      "Introduced weekly company-wide retrospectives (4 Ls, Three Little Pigs), increasing cross-departmental transparency and improving team alignment.",
      "Delivered key system features including Intercom for customer communication and a BrightData LinkedIn scraper for prospect data collection.",
      "Led recruitment, hiring two engineers through personal industry contacts and reducing time-to-hire.",
      "Managed and resolved critical bugs across the MERN stack, improving system stability and reducing downtime.",
    ],
    metrics: [
      { value: "-66%", label: "AWS infrastructure cost" },
      { value: "$125k", label: "cloud credits secured" },
      { value: "+30%", label: "development efficiency" },
    ],
    stack: [
      "MongoDB",
      "Express",
      "React",
      "Node.js",
      "AWS Secrets Manager",
      "Intercom",
      "BrightData",
    ],
    accent: "#7C6BFF",
  },
  {
    id: "webio-dx-lead",
    company: "Webio",
    companyId: "webio",
    title: "Senior Tech & Developer Experience Lead",
    start: "2023-03",
    end: "2023-12",
    location: "Dublin, Ireland",
    arrangement: "Hybrid",
    headline:
      "Invented the Developer Experience function at Webio and ran it across Platform, Frontend, DevOps and ML.",
    bullets: [
      "Spearheaded the Developer Experience initiative, leading a strategic overhaul of development workflows, tooling and documentation across Platform, Phoenix (Frontend), DevOps and MADS (Machine Learning & Data Science) teams.",
      "Instituted a comprehensive feedback system — a monthly 29-question developer experience survey plus direct consultations — to identify pain points and drive targeted improvements.",
      "Directed adoption and management of key development tools including Jira, GitLab, Confluence and SwaggerHub for API documentation, and provided product feedback to SmartBear on their Portal application.",
      "Enhanced agile practice across multiple teams, introducing a tech-wide retrospective and facilitating a bi-weekly managers' meeting aligning technical, product and operations.",
      "Oversaw the growth and well-being of six direct reports while still spending roughly 30% of my time hands-on in Java and React/Redux.",
    ],
    metrics: [
      { value: "4", label: "disciplines harmonised" },
      { value: "29", label: "question monthly DX survey" },
      { value: "30%", label: "of my time still writing code" },
    ],
    stack: ["Java", "React", "Redux", "Jira", "GitLab", "Confluence", "SwaggerHub"],
    accent: "#4ECDC4",
  },
  {
    id: "webio-team-lead",
    company: "Webio",
    companyId: "webio",
    title: "Technical Team Lead",
    altTitle: "Acting CTO, 22 months",
    start: "2019-03",
    end: "2023-03",
    location: "Greater Dublin",
    headline:
      "Held the CTO seat for 22 months, grew the team from 8 to 18, and moved the whole company remote mid-pandemic.",
    bullets: [
      "Served as acting CTO for 22 months, assuming comprehensive server-side management and full production access on AWS — EC2, ECS, ELB, Aurora RDS, CloudWatch and QuickSight — maintaining operational stability through the transition.",
      "Integrated DialogFlow V2 and AWS QuickSight reporting, significantly extending system capability while holding continuous uptime.",
      "Led the transformation to a remote-first operation during COVID-19, equipping technical and non-technical teams with the tools and resources for effective remote collaboration.",
      "Implemented comprehensive agile ceremonies — sprint planning, backlog refinement, retrospectives — inspired by JJ Sutherland's The Scrum Fieldbook, improving team efficiency and project management.",
      "Oversaw expansion of the technical team from 8 to 18 engineers, including integration of a new Polish counterpart team, while directly managing six reports.",
      "Played a key role in the company's expansion following Series A funding.",
    ],
    metrics: [
      { value: "8 → 18", label: "engineers" },
      { value: "22", label: "months as acting CTO" },
      { value: "Series A", label: "scaled through it" },
    ],
    stack: [
      "AWS EC2",
      "ECS",
      "ELB",
      "Aurora RDS",
      "CloudWatch",
      "QuickSight",
      "DialogFlow V2",
      "Java",
    ],
    accent: "#F5A65C",
  },
  {
    id: "webio-senior",
    company: "Webio",
    companyId: "webio",
    title: "Senior Engineer",
    start: "2017-09",
    end: "2019-03",
    location: "Dublin, Ireland",
    headline:
      "Became the person who onboarded everyone else, and steadied the system while the company found its feet.",
    bullets: [
      "Spearheaded onboarding for new developers, guiding them through the tech stack — particularly React and Redux — and the intricacies of the backend systems.",
      "Managed and optimised system maintenance and led the support rota, addressing a wide range of technical issues.",
      "Conducted daily standups and sprint planning, keeping team focus and project tracking tight.",
      "Played a central role in stabilising operations during a period of recovery and growth.",
    ],
    stack: ["React", "Redux", "Java", "MySQL", "Redis"],
    accent: "#F5A65C",
  },
  {
    id: "webio-dev",
    company: "Webio",
    companyId: "webio",
    title: "Graduate Developer",
    start: "2016-09",
    end: "2017-09",
    location: "County Dublin, Ireland",
    headline:
      "Built a hotel booking chatbot on DialogFlow's NLP that helped secure funding at a moment the company badly needed it.",
    bullets: [
      "Joined the 'PreCogs' team as a graduate and rapidly picked up ReactJS and Redux for frontend work, plus Java, MySQL and Redis for full-stack capability.",
      "Owned the Reporting Screen feature end to end: React components, encrypted Tibco Jaspersoft calls, backend connectivity, MySQL schema migrations, and CI/CD via TeamCity and Octopus Deploy.",
      "Innovated under pressure by creating a hotel booking chatbot with DialogFlow's NLP, helping secure critical funding during a difficult phase.",
      "As the team shrank through funding challenges, took on the backend systems left behind by departing senior engineers — intense learning with little guidance and no documentation.",
    ],
    stack: [
      "ReactJS",
      "Redux",
      "Java",
      "MySQL",
      "Redis",
      "DialogFlow",
      "TeamCity",
      "Octopus Deploy",
    ],
    accent: "#F5A65C",
  },
  {
    id: "science-gallery",
    company: "Science Gallery Dublin",
    companyId: "science-gallery",
    title: "Mediator",
    start: "2013-05",
    end: "2015-11",
    location: "Dublin, Ireland",
    headline:
      "Two and a half years explaining hard science to strangers — the single best training I ever had for technical leadership.",
    bullets: [
      "Conveyed complex scientific concepts to the general public in an interdisciplinary space, through guided tours and one-to-one interactions.",
      "Delivered hands-on technical workshops in soldering and electronics for adults and children at Science Gallery's MakeShop.",
      "Facilitated diverse events in the Gallery and offsite, including TEDx Dublin.",
    ],
    stack: ["Science communication", "Public speaking", "Electronics", "Workshops"],
    accent: "#E86A92",
  },
  {
    id: "tcd-curator",
    company: "Anatomy Dept, Trinity College Dublin",
    companyId: "tcd-anatomy",
    title: "Curator",
    start: "2014-06",
    end: "2014-08",
    location: "Dublin, Ireland",
    headline:
      "A summer restoring century-old anatomical specimens in the basement of Trinity's Anatomy Department.",
    bullets: [
      "Restored, cleaned and stored century-old specimen containers.",
      "Catalogued and stored various pathological specimens.",
      "Cleared out the lecture hall and dissection theatre, and prepared the museum for Discover Research Dublin.",
    ],
    stack: ["Cataloguing", "Restoration", "Curation"],
    accent: "#E86A92",
  },
];

export const education = [
  {
    id: "tcd",
    institution: "Trinity College Dublin",
    degree: "Computer Science, Linguistics and Modern Irish",
    grade: "Second Class Honours, First Division",
    start: "2011-09",
    end: "2015-05",
    note: "An unusual triple — compilers and Old Irish grammar turn out to be the same problem wearing different hats.",
  },
  {
    id: "glasgow",
    institution: "University of Glasgow",
    degree: "Computing Science, Linguistics and Scottish Gaelic",
    grade: "Second Class Honours, First Division",
    start: "2013-09",
    end: "2014-05",
    note: "Erasmus year.",
  },
];

export const certifications = [
  {
    id: "imi",
    name: "Leadership Development Program",
    issuer: "Irish Management Institute",
    year: "2023",
  },
];
