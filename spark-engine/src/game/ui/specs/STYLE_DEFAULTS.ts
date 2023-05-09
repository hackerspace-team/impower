import { SparkStyleProperties } from "../types/Style";

const STYLE_PROPS: SparkStyleProperties = {
  placement: "relative",
  anchor: "stretch",
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  widthMin: 0,
  widthMax: -1,
  heightMin: 0,
  heightMax: -1,
  aspectRatio: "none",
  stretch: 1,
  depth: 0,
  cornerShape: "round",
  cornerRadius: 8,
  backgroundColor: "none",
  backgroundGradient: "none",
  backgroundPattern: "none",
  backgroundGraphic: "none",
  backgroundRepeat: false,
  backgroundAlign: "center",
  backgroundFit: "cover",
  backgroundShadow: "none",
  backdropFilter: "none",
  filter: "none",
  textRole: "body",
  textSize: "md",
  textColor: "black",
  textBold: false,
  textItalic: false,
  textUnderline: false,
  textStrikethrough: false,
  textWrap: false,
  textAlign: "center",
  textCase: "none",
  textFont: "auto",
  textHeight: "auto",
  textKerning: "auto",
  textStroke: "auto",
  textUnderlineThickness: "auto",
  textUnderlineOffset: "auto",
  layout: "column",
  layoutAlign: "center",
  layoutJustify: "center",
  layoutWrap: false,
  overflow: "hidden",
  opacity: 1,
  opacityDuration: 0,
  opacityDelay: 0,
  opacityEase: "linear",
  transformPositionX: 0,
  transformPositionY: 0,
  transformPositionZ: 0,
  transformRotationX: 0,
  transformRotationY: 0,
  transformRotationZ: 0,
  transformScaleX: 1,
  transformScaleY: 1,
  transformScaleZ: 1,
  transformPivot: "center",
  transformDuration: 0,
  transformDelay: 0,
  transformEase: "standard",
  animation: "none",
  animationEase: "linear",
  animationDuration: 0,
  animationDelay: 0,
  animationRepeat: false,
  animationDirection: "forward",
  animationRunning: false,
};

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
  Background: {
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
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  Choice: {
    backgroundColor: "white",
    padding: 8,
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
    textAlign: "center",
  },
  Transition: {
    textAlign: "right",
    width: "100%",
  },
  Scene: {
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
  Character: {
    lineHeight: 1,
    fontSize: "1.5rem",
    textAlign: "center",
    md: { fontSize: "1.75rem" },
  },
  Parenthetical: {
    textAlign: "center",
  },
  Dialogue: {
    flex: 1,
  },
};