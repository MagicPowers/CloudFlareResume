export type EraId =
  | "trinity"
  | "science-gallery"
  | "webio-early"
  | "webio-lead"
  | "webio-dx"
  | "revium"
  | "hertz"
  | "cycling"
  | "dnd"
  | "misc";

export type Era = {
  id: EraId;
  label: string;
  years: string;
  blurb: string;
  colour: string;
};

export type Photo = {
  src: string;
  /** Smaller copy for grids and cards. Falls back to `src` when absent. */
  thumb?: string;
  era: EraId;
  width: number;
  height: number;
  /** YYYY-MM-DD or YYYY-MM, read from the filename. */
  date?: string;
  caption?: string;
};
