export interface Chunk {
  tag?: string;
  control?: string;
  target?: string;
  button?: string;
  text?: string;
  assets?: string[];
  args?: string[];

  voicedSyllable?: boolean;
  punctuatedSyllable?: boolean;
  pitch?: number;

  speed: number;

  duration: number;

  voiced?: boolean;
  yelled?: number;
  emDash?: boolean;
  tilde?: boolean;

  centered?: number;
  bolded?: number;
  italicized?: number;
  underlined?: number;
  floating?: number;
  trembling?: number;
}
