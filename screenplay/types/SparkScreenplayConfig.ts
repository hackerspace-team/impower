export interface SparkScreenplayConfig {
  refresh_stats_on_save: boolean;
  embolden_scene_headers: boolean;
  underline_scene_headers: boolean;
  embolden_character_names: boolean;
  show_page_numbers: boolean;
  split_dialogue: boolean;
  print_title_page: boolean;
  print_profile: string;
  double_space_between_scenes: boolean;
  print_sections: boolean;
  print_synopsis: boolean;
  print_actions: boolean;
  print_headers: boolean;
  print_dialogues: boolean;
  number_sections: boolean;
  use_dual_dialogue: boolean;
  print_notes: boolean;
  print_header: string;
  print_footer: string;
  print_watermark: string;
  scenes_numbers: string;
  each_scene_on_new_page: boolean;
  merge_empty_lines: boolean;
  create_bookmarks: boolean;
  invisible_section_bookmarks: boolean;
  synchronized_markup_and_preview: boolean;
  preview_theme: string;
  preview_texture: boolean;
  text_more: string;
  text_contd: string;
  text_scene_continued: string;
  scene_continuation_top: boolean;
  scene_continuation_bottom: boolean;
  parenthetical_newline_helper: boolean;
}
