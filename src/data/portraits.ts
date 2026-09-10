/**
 * A decade of professional headshots, in order.
 *
 * Dates and stories are David's own except where marked UNCONFIRMED.
 */
export type Portrait = {
  src: string;
  year: number;
  /** Shown next to the year. Omit for entries where only the year is known. */
  month?: string;
  /** Small chip above the caption. Keep it to one or two words. */
  tag?: string;
  /** The headline caption, set in display type. One or two lines. */
  note: string;
  /** Optional longer story beneath the caption. */
  story?: string;
  /** Where to anchor the face when the frame crops. 0% = top of image. */
  focus?: string;
};

export const portraits: Portrait[] = [
  {
    src: "/portraits/01-waistcoat-tie.jpg",
    year: 2015,
    tag: "Graduation",
    note: "Trinity photographed every graduating student that year.",
    story:
      "Computer Science, Linguistics and Modern Irish, finally done. It is also the only photograph on this page in which I am wearing a tie.",
    focus: "50% 18%",
  },
  {
    src: "/portraits/02-grey-waistcoat.jpg",
    year: 2020,
    month: "August",
    tag: "Peak beard",
    note: "Acting CTO, and every barber in Ireland was shut.",
    story:
      "Five months into the pandemic the beard reached its all-time maximum, entirely by default. Somewhere around here I decided that if I was going to be stuck with the hair too, it may as well be for something — so I kept growing it.",
    focus: "50% 22%",
  },
  {
    src: "/portraits/03-mono-long-hair.jpg",
    year: 2022,
    month: "November",
    tag: "LauraLynn",
    note: "Fourteen inches, which is exactly what they need.",
    story:
      "Two and a half years of growing it out, donated to the LauraLynn foundation to be made into a wig for a child going through cancer treatment. They wrote afterwards to confirm it had been used. That was the good thing I wanted out of the pandemic, and I got it. Still at Webio at this point.",
    focus: "50% 20%",
  },
  {
    src: "/portraits/06-navy-moustache.jpg",
    year: 2025,
    month: "November",
    tag: "Movember",
    note: "One month, one fairly committed moustache, €1,000 raised.",
    story:
      "Almost a full year into Hertz by this stage. The moustache was not a permanent decision, but it was a productive one.",
    focus: "50% 25%",
  },
  {
    src: "/portraits/07-navy-laughing.jpg",
    year: 2025,
    month: "November",
    tag: "Movember",
    note: "The same moustache, enjoying itself.",
    focus: "50% 25%",
  },

  {
    src: "/portraits/04-office-light.jpg",
    year: 2026,
    month: "July",
    note: "A proper shoot, and the beard finally behaving itself.",
    focus: "50% 25%",
  },
  {
    src: "/portraits/05-outdoors-navy.jpg",
    year: 2026,
    month: "July",
    note: "Same afternoon, outside. Which brings us up to now.",
    focus: "50% 25%",
  },
];

export const portraitSpan = {
  first: portraits[0].year,
  last: portraits[portraits.length - 1].year,
};
