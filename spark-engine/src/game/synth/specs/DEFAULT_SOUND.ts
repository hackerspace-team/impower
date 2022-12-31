import { Sound } from "../types/Sound";
import { A } from "./A";

export const DEFAULT_SOUND: Sound = {
  wave: "triangle",
  amplitude: {
    volume: 0.5,
    volumeRamp: 0,
    delay: 0,
    attack: 0,
    decay: 0,
    sustain: 0,
    release: 0,
    sustainLevel: 0.5,
  },
  frequency: {
    pitch: A[4],
    pitchRamp: 0,
    accel: 0,
    jerk: 0,
    offset: 0,
  },
  lowpass: {
    cutoff: A[8],
    cutoffRamp: 0,
    resonance: 0,
  },
  highpass: {
    cutoff: 0,
    cutoffRamp: 0,
  },
  distortion: {
    on: false,
    edge: 0.5,
    edgeRamp: 0,
    grit: 0,
    gritRamp: 0,
  },
  arpeggio: {
    on: false,
    rate: 12,
    rateRamp: 0,
    maxOctaves: 1,
    maxNotes: 160,
    direction: "up",
    tones: [],
    shapes: [],
    levels: [],
  },
  vibrato: {
    on: false,
    shape: "sine",
    strength: 0.5,
    strengthRamp: 0,
    rate: 6,
    rateRamp: 0,
  },
  tremolo: {
    on: false,
    shape: "sine",
    strength: 0.5,
    strengthRamp: 0,
    rate: 12,
    rateRamp: 0,
  },
  ring: {
    on: false,
    shape: "sine",
    strength: 0.5,
    strengthRamp: 0,
    rate: A[6],
    rateRamp: 0,
  },
  wahwah: {
    on: false,
    shape: "sine",
    strength: 0.5,
    strengthRamp: 0,
    rate: 6,
    rateRamp: 0,
  },
  harmony: {
    on: false,
    count: 1,
    falloff: 0.5,
    falloffRamp: 0,
    shapes: [],
  },
  reverb: {
    on: false,
    strength: 0.5,
    strengthRamp: 0,
    delay: 0.15,
    delayRamp: 0,
  },
  noiseSeed: "",
};
