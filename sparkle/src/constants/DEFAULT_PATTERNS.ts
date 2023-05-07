export const DEFAULT_PATTERNS: Record<string, string[]> = {
  zigzag: [
    "M 0 6 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4",
    "M 0 14 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4",
    "M 0 30 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4",
    "M 0 22 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4 l 4 -4 l 4 4",
  ],
  bubble: [
    "M 32 38 a 1 1 0 0 0 0 -12 a 1 1 0 0 0 0 12 z M 32 6 a 1 1 0 0 0 0 -12 a 1 1 0 0 0 0 12 z M 0 38 a 1 1 0 0 0 0 -12 a 1 1 0 0 0 0 12 z M 0 6 a 1 1 0 0 0 0 -12 a 1 1 0 0 0 0 12 z",
    "M 16 22 a 1 1 0 0 0 0 -12 a 1 1 0 0 0 0 12 z",
    "M 0 19 a 1 1 0 0 0 0 -6 a 1 1 0 0 0 0 6 z M 32 19 a 1 1 0 0 0 0 -6 a 1 1 0 0 0 0 6 z",
    "M 16 3 a 1 1 0 0 0 0 -6 a 1 1 0 0 0 0 6 z M 16 35 a 1 1 0 0 0 0 -6 a 1 1 0 0 0 0 6 z",
  ],
  circle: [
    "M 6 4 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 14 4 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 22 4 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 30 4 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z",
    "M 6 12 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 14 12 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 22 12 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 30 12 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z",
    "M 6 20 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 14 20 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 22 20 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 30 20 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z",
    "M 6 28 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 14 28 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 22 28 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z M 30 28 a 1 1 0 0 0 -4 0 a 1 1 0 0 0 4 0 z",
  ],
  grid: ["M 16 0 V 32 Z M 0 16 H 32 Z"],
  flower: [
    "M 31 31 c 0 0 0 -3 -1 -4 c -2 -3 -4 -1 -4 -1 c 0 0 -2 2 1 4 c 1 1 4 1 4 1 z M 31 1 c 0 0 -3 0 -4 1 c -3 2 -1 4 -1 4 c 0 0 2 2 4 -1 c 1 -1 1 -4 1 -4 z M 5 30 c 3 -2 1 -4 1 -4 c 0 0 -2 -2 -4 1 c -1 1 -1 4 -1 4 c 0 0 3 0 4 -1 z M 6 6 c 0 0 2 -2 -1 -4 c -1 -1 -4 -1 -4 -1 c 0 0 0 3 1 4 c 2 3 4 1 4 1 z",
    "M 24 16 c 0 0 -1 -2 -3 -2 c -2 0 -3 2 -3 2 c 0 0 1 2 3 2 c 2 0 3 -2 3 -2 z M 14 16 c 0 0 -1 -2 -3 -2 c -2 0 -3 2 -3 2 c 0 0 1 2 3 2 c 2 0 3 -2 3 -2 z M 18 11 c 0 -2 -2 -3 -2 -3 c 0 0 -2 1 -2 3 c 0 2 2 3 2 3 c 0 0 2 -1 2 -3 z M 14 21 c 0 2 2 3 2 3 c 0 0 2 -1 2 -3 c 0 -2 -2 -3 -2 -3 c 0 0 -2 1 -2 3 z",
  ],
  equal: [
    "M 12 19 l 8 0 M 12 15 l 8 0 M 28 2 l 8 0 M 28 30 l 8 0 M -4 30 l 8 0 M -4 2 l 8 0",
    "M 14 -4 l 0 8 M 18 -4 l 0 8 M 30 12 l 0 8 M 14 28 l 0 8 M 18 28 l 0 8 M 2 12 l 0 8",
  ],
  net: [
    "M -8 -4 l 16 8 l 16 -8 l 16 8 M -8 28 l 16 8 l 16 -8 l 16 8 M -8 12 l 16 8 l 16 -8 l 16 8 M -4 40 l 8 -16 l -8 -16 l 8 -16 M 28 40 l 8 -16 l -8 -16 l 8 -16 M 12 40 l 8 -16 l -8 -16 l 8 -16",
  ],
  octagon: [
    "M 12 0 l 0 5 c -3 1 -6 4 -7 7 l -5 0 M 0 20 l 5 0 c 1 3 4 6 7 7 l 0 5 M 20 32 l 0 -5 c 3 -1 6 -4 7 -7 l 5 0 M 32 12 l -5 0 c -1 -3 -4 -6 -7 -7 l 0 -5 ",
    "M 4 0 a 1 1 0 0 0 -8 0 a 1 1 0 0 0 8 0 z M 36 0 a 1 1 0 0 0 -8 0 a 1 1 0 0 0 8 0 z M 4 32 a 1 1 0 0 0 -8 0 a 1 1 0 0 0 8 0 z M 36 32 a 1 1 0 0 0 -8 0 a 1 1 0 0 0 8 0 z",
    "M 16 28 l 0 12 M 40 16 l -12 0 M 4 16 l -12 0 M 16 -8 l 0 12",
    "M 16 11 l 5 5 l -5 5 l -5 -5 l 5 -5 z",
  ],
  plus: [
    "M 40 16 h -6 M 30 16 h -6 M 32 24 v -6 M 32 14 v -6 M 8 16 h -6 M -2 16 h -6 M 0 24 v -6 M 0 14 v -6",
    "M 15 -1 l -4 -4 M 17 1 l 4 4 M 17 -1 l 4 -4 M 15 1 l -4 4 M 15 31 l -4 -4 M 17 33 l 4 4 M 17 31 l 4 -4 M 15 33 l -4 4",
  ],
  tile: [
    "M 32 8 l 0 16 M 0 8 l 0 16 M 8 0 l 16 0 M 8 32 l 16 0",
    "M 32 40 l -8 -8 l 8 -8 l 8 8 l -8 8 z M 0 40 l -8 -8 l 8 -8 l 8 8 l -8 8 z M 32 8 l -8 -8 l 8 -8 l 8 8 l -8 8 z M 0 8 l -8 -8 l 8 -8 l 8 8 l -8 8 z",
    "M 16 -8 l 0 16 M 16 24 l 0 16 M -8 16 l 16 0 M 24 16 l 16 0",
    "M 16 24 l -8 -8 l 8 -8 l 8 8 l -8 8 z",
  ],
  wave: [
    "M 0 6 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2",
    "M 0 14 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2",
    "M 0 22 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2",
    "M 0 30 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2 c 2 0 3 -1 4 -2 c 1 -1 2 -2 4 -2 c 2 0 3 1 4 2 c 1 1 2 2 4 2",
  ],
};
