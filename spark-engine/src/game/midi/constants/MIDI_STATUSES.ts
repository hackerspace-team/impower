/**
 * Status Byte
 * (first 8 bits of message)
 */
export const MIDI_STATUSES = {
  0x80: "voice_00_note_off",
  0x81: "voice_01_note_off",
  0x82: "voice_02_note_off",
  0x83: "voice_03_note_off",
  0x84: "voice_04_note_off",
  0x85: "voice_05_note_off",
  0x86: "voice_06_note_off",
  0x87: "voice_07_note_off",
  0x88: "voice_08_note_off",
  0x89: "voice_09_note_off",
  0x8a: "voice_10_note_off",
  0x8b: "voice_11_note_off",
  0x8c: "voice_12_note_off",
  0x8d: "voice_13_note_off",
  0x8e: "voice_14_note_off",
  0x8f: "voice_15_note_off",

  0x90: "voice_00_note_on",
  0x91: "voice_01_note_on",
  0x92: "voice_02_note_on",
  0x93: "voice_03_note_on",
  0x94: "voice_04_note_on",
  0x95: "voice_05_note_on",
  0x96: "voice_06_note_on",
  0x97: "voice_07_note_on",
  0x98: "voice_08_note_on",
  0x99: "voice_09_note_on",
  0x9a: "voice_10_note_on",
  0x9b: "voice_11_note_on",
  0x9c: "voice_12_note_on",
  0x9d: "voice_13_note_on",
  0x9e: "voice_14_note_on",
  0x9f: "voice_15_note_on",

  0xa0: "voice_00_polyphonic",
  0xa1: "voice_01_polyphonic",
  0xa2: "voice_02_polyphonic",
  0xa3: "voice_03_polyphonic",
  0xa4: "voice_04_polyphonic",
  0xa5: "voice_05_polyphonic",
  0xa6: "voice_06_polyphonic",
  0xa7: "voice_07_polyphonic",
  0xa8: "voice_08_polyphonic",
  0xa9: "voice_09_polyphonic",
  0xaa: "voice_10_polyphonic",
  0xab: "voice_11_polyphonic",
  0xac: "voice_12_polyphonic",
  0xad: "voice_13_polyphonic",
  0xae: "voice_14_polyphonic",
  0xaf: "voice_15_polyphonic",

  0xb0: "voice_00_control",
  0xb1: "voice_01_control",
  0xb2: "voice_02_control",
  0xb3: "voice_03_control",
  0xb4: "voice_04_control",
  0xb5: "voice_05_control",
  0xb6: "voice_06_control",
  0xb7: "voice_07_control",
  0xb8: "voice_08_control",
  0xb9: "voice_09_control",
  0xba: "voice_10_control",
  0xbb: "voice_11_control",
  0xbc: "voice_12_control",
  0xbd: "voice_13_control",
  0xbe: "voice_14_control",
  0xbf: "voice_15_control",

  0xc0: "voice_00_program",
  0xc1: "voice_01_program",
  0xc2: "voice_02_program",
  0xc3: "voice_03_program",
  0xc4: "voice_04_program",
  0xc5: "voice_05_program",
  0xc6: "voice_06_program",
  0xc7: "voice_07_program",
  0xc8: "voice_08_program",
  0xc9: "voice_09_program",
  0xca: "voice_10_program",
  0xcb: "voice_11_program",
  0xcc: "voice_12_program",
  0xcd: "voice_13_program",
  0xce: "voice_14_program",
  0xcf: "voice_15_program",

  0xd0: "voice_00_pressure",
  0xd1: "voice_01_pressure",
  0xd2: "voice_02_pressure",
  0xd3: "voice_03_pressure",
  0xd4: "voice_04_pressure",
  0xd5: "voice_05_pressure",
  0xd6: "voice_06_pressure",
  0xd7: "voice_07_pressure",
  0xd8: "voice_08_pressure",
  0xd9: "voice_09_pressure",
  0xda: "voice_10_pressure",
  0xdb: "voice_11_pressure",
  0xdc: "voice_12_pressure",
  0xdd: "voice_13_pressure",
  0xde: "voice_14_pressure",
  0xdf: "voice_15_pressure",

  0xe0: "voice_00_pitch",
  0xe1: "voice_01_pitch",
  0xe2: "voice_02_pitch",
  0xe3: "voice_03_pitch",
  0xe4: "voice_04_pitch",
  0xe5: "voice_05_pitch",
  0xe6: "voice_06_pitch",
  0xe7: "voice_07_pitch",
  0xe8: "voice_08_pitch",
  0xe9: "voice_09_pitch",
  0xea: "voice_10_pitch",
  0xeb: "voice_11_pitch",
  0xec: "voice_12_pitch",
  0xed: "voice_13_pitch",
  0xee: "voice_14_pitch",
  0xef: "voice_15_pitch",

  0xf0: "system_exclusive_begin",
  0xf1: "",
  0xf2: "system_song_position",
  0xf3: "system_song_select",
  0xf4: "",
  0xf5: "",
  0xf6: "system_tune_request",
  0xf7: "system_exclusive_end",
  0xf8: "system_realtime_timing",
  0xf9: "",
  0xfa: "system_realtime_start",
  0xfb: "system_realtime_continue",
  0xfc: "system_realtime_stop",
  0xfd: "",
  0xfe: "system_realtime_sensing",
  0xff: "system_realtime_reset",
} as const;
