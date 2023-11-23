const STYLE_PROPS = {};

export const STYLE_DEFAULTS = {
  "": {
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
    pointerEvents: "none",
  },
  LoadingBar: {
    zIndex: 1000,
    position: "relative",
    width: "100%",
    height: 4,
  },
  LoadingFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "cyan50",
    transform: "scaleX({LOADING_PROGRESS})",
    transformOrigin: "left",
  },
  Backdrop: {
    position: "absolute",
    inset: 0,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  Portrait: {
    position: "absolute",
    top: "10%",
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    backgroundSize: "auto 100%",
    backgroundPosition: "center",
  },
  ChoiceGroup: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    md: {
      fontSize: "1.125rem",
    },
  },
  Choices: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 8,
  },
  Choice: {
    color: "black",
    backgroundColor: "white",
    padding: 8,
    margin: "8px 0",
    width: "90%",
    maxWidth: 800,
    textAlign: "center",
  },
  Box: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    height: 224,
    width: "100%",
    margin: "0 auto",
    backgroundColor: "white",
  },
  Content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    position: "absolute",
    inset: 0,
    padding: 16,
    fontSize: "1rem",
    md: { paddingLeft: 32, paddingRight: 32, fontSize: "1.125rem" },
  },
  Indicator: {
    color: "black",
    width: 16,
    height: 16,
    position: "absolute",
    right: 16,
    bottom: 16,
    animation: "0.25s ease infinite alternate SLIDE_UP",
    animationPlayState: "paused",
  },
  DescriptionGroup: {
    width: "100%",
    height: "100%",
  },
  DescriptionBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  DescriptionContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 640,
  },
  Centered: {
    color: "black",
    textAlign: "center",
  },
  Transition: {
    color: "black",
    textAlign: "right",
    width: "100%",
  },
  Scene: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  DialogueGroup: {
    flex: 1,
  },
  DialogueContent: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    width: "80%",
    margin: "0 auto",
    md: { width: "68%" },
  },
  CharacterName: {
    color: "black",
    lineHeight: 1,
    fontSize: "1.5rem",
    textAlign: "center",
    md: { fontSize: "1.75rem" },
  },
  Parenthetical: {
    color: "black",
    textAlign: "center",
  },
  Dialogue: {
    color: "black",
    flex: 1,
  },
  Action: {
    color: "black",
  },
};
