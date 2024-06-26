import { _ui } from "../_ui";

export const UI_DEFAULTS = {
  default: _ui({ $name: "default" }),
  image: _ui({ $name: "image", image: {} }),
  text: _ui({ $name: "text", text: {} }),
  loading: _ui({
    $name: "loading",
    loading_bar: {
      loading_fill: {},
    },
  }),
  stage: _ui({
    $name: "stage",
    background: {
      backdrop: {
        image: {},
      },
      portrait: {
        image: {},
      },
      middle: {
        choices: {
          choice_0: {
            choice: {
              text: {},
            },
          },
          choice_1: {
            choice: {
              text: {},
            },
          },
          choice_2: {
            choice: {
              text: {},
            },
          },
          choice_3: {
            choice: {
              text: {},
            },
          },
          choice_4: {
            choice: {
              text: {},
            },
          },
          choice_5: {
            choice: {
              text: {},
            },
          },
        },
      },
      textbox: {
        box_background: {},
      },
    },
    textbox: {
      content: {
        dialogue_group: {
          character_name: {
            text: {},
          },
          character_parenthetical: {
            text: {},
          },
          dialogue_content: {
            parenthetical: {
              text: {},
            },
            dialogue: {
              text: {},
            },
          },
        },
        action: {
          text: {},
        },
        transition: {
          text: {},
        },
        scene: {
          text: {},
        },
      },
      indicator: {
        text: "▼",
      },
    },
    screen: {},
  }),
};
