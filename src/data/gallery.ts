import { generatedPhotos } from "./gallery.generated";
import type { Era, EraId, Photo } from "./gallery.types";

export type { Era, EraId, Photo };

/**
 * Eras are the folders you drop photos into: public/photos/<era>/.
 * Order here is the order they appear in the gallery filter bar.
 */
export const eras: Era[] = [
  {
    id: "trinity",
    label: "Trinity & Glasgow",
    years: "2011–2015",
    blurb: "Computer science, linguistics, and two languages nobody expected.",
    colour: "#8B9DFF",
  },
  {
    id: "science-gallery",
    label: "Science Gallery",
    years: "2013–2015",
    blurb: "Soldering irons, TEDx, and explaining hard things to strangers.",
    colour: "#E86A92",
  },
  {
    id: "webio-early",
    label: "Webio — Building",
    years: "2016–2019",
    blurb: "Graduate to senior, in a startup that kept changing shape.",
    colour: "#F5A65C",
  },
  {
    id: "webio-lead",
    label: "Webio — Leading",
    years: "2019–2023",
    blurb: "Acting CTO, a pandemic, and a team that went from 8 to 18.",
    colour: "#F5A65C",
  },
  {
    id: "webio-dx",
    label: "Webio — DX",
    years: "2023",
    blurb: "Developer experience as an actual discipline.",
    colour: "#4ECDC4",
  },
  {
    id: "revium",
    label: "Revium",
    years: "2024",
    blurb: "Three time zones, one sprint board, a much smaller AWS bill.",
    colour: "#7C6BFF",
  },
  {
    id: "hertz",
    label: "Hertz",
    years: "2024–now",
    blurb: "Fleet maintenance at European scale.",
    colour: "#D4F55C",
  },
  {
    id: "cycling",
    label: "On the bike",
    years: "Ongoing",
    blurb: "Mizen to Malin, Dublin to Galway, and a lot of rain.",
    colour: "#5CC8F5",
  },
  {
    id: "dnd",
    label: "Dungeons & Dragons",
    years: "Ongoing",
    blurb: "Dungeon Master. The best management training available.",
    colour: "#C97BE8",
  },
  {
    id: "misc",
    label: "Elsewhere",
    years: "—",
    blurb: "Everything that refused to file neatly.",
    colour: "#9A9A98",
  },
];

export const photos: Photo[] = generatedPhotos;

export const photosByEra = (era: EraId) => photos.filter((p) => p.era === era);

export const erasWithPhotos = () =>
  eras.filter((e) => photos.some((p) => p.era === e.id));

export const hasPhotos = photos.length > 0;
