const STYLE_PROPS = {};

export const STYLE_DEFAULTS = {
  default: {
    ...STYLE_PROPS,
    xs: STYLE_PROPS,
    sm: STYLE_PROPS,
    md: STYLE_PROPS,
    lg: STYLE_PROPS,
    xl: STYLE_PROPS,
    hovered: STYLE_PROPS,
    pressed: STYLE_PROPS,
    focused: STYLE_PROPS,
    checked: STYLE_PROPS,
    disabled: STYLE_PROPS,
  },
  "hidden *": {
    opacity: 0,
    pointer_events: "none",
  },
  loading_bar: {
    z_index: 1000,
    position: "relative",
    width: "100%",
    height: 4,
  },
  loading_fill: {
    width: "100%",
    height: "100%",
    background_color: "cyan50",
    transform: "scaleX(var(--loading_progress))",
    transform_origin: "left",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    background_position: "center",
    background_size: "cover",
  },
  portrait: {
    position: "absolute",
    top: "10%",
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flex_direction: "column",
    background_size: "auto 100%",
    background_position: "center",
  },
  choice_menu: {
    position: "relative",
    flex: 1,
    display: "flex",
    flex_direction: "column",
    align_items: "center",
    justify_content: "center",
    font_size: "1rem",
    md: {
      font_size: "1.125rem",
    },
  },
  choice_list: {
    display: "flex",
    flex_direction: "column",
    align_items: "center",
    justify_content: "center",
    width: "100%",
    padding: 8,
  },
  choice: {
    color: "black",
    background_color: "white",
    padding: 8,
    margin: "8px 0",
    width: "90%",
    max_width: 800,
    text_align: "center",
  },
  box: {
    position: "relative",
    display: "flex",
    flex_direction: "column",
    max_width: 800,
    height: 224,
    width: "100%",
    margin: "0 auto",
    background_color: "white",
  },
  content: {
    flex: 1,
    display: "flex",
    flex_direction: "column",
    align_content: "center",
    position: "absolute",
    inset: 0,
    padding: 16,
    font_size: "1rem",
    md: { padding_left: 32, padding_right: 32, font_size: "1.125rem" },
  },
  indicator: {
    color: "black",
    width: 16,
    height: 16,
    position: "absolute",
    right: 16,
    bottom: 16,
    transition: `opacity 0.25s linear`,
    animation: "0.5s infinite bounce",
    animation_play_state: "paused",
  },
  description_group: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flex_direction: "column",
    align_items: "center",
    justify_content: "center",
  },
  description_content: {
    display: "flex",
    flex_direction: "column",
    align_items: "center",
    width: "100%",
    max_width: 640,
  },
  transition: {
    color: "black",
    text_align: "right",
    width: "100%",
  },
  scene: {
    color: "black",
    text_align: "center",
    font_weight: "bold",
  },
  dialogue_group: {
    flex: 1,
  },
  dialogue_content: {
    flex: 1,
    padding_top: 8,
    padding_bottom: 8,
    width: "80%",
    margin: "0 auto",
    md: { width: "68%" },
  },
  character_name: {
    color: "black",
    line_height: 1,
    font_size: "1.5rem",
    text_align: "center",
    md: { font_size: "1.75rem" },
  },
  parenthetical: {
    display: "block",
    color: "black",
    text_align: "center",
    position: "relative",
  },
  dialogue: {
    color: "black",
    flex: 1,
  },
  action: {
    color: "black",
  },
};
