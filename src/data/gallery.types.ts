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
  era: EraId;
  width: number;
  height: number;
  caption?: string;
};
