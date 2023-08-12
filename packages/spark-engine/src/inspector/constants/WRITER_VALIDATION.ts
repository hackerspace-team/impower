import { Writer } from "../../game";
import { RecursiveValidation } from "../types/RecursiveValidation";
import { SYNTH_VALIDATION } from "./SYNTH_VALIDATION";

export const WRITER_VALIDATION: RecursiveValidation<Writer> = {
  letterDelay: [0.01, 0, 1],
  phrasePauseScale: [0.5, 1, 10],
  fadeDuration: [0.01, 0, 1],
  clackSound: SYNTH_VALIDATION,
};
