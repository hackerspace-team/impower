import { StyleSpec } from "style-mod";

const PREVIEW_THEME: {
  [selector: string]: StyleSpec;
} = {
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  "&": {
    flex: 1,
    backgroundSize: "auto",
    backgroundRepeat: "repeat",
    color: "#333",
  },
  "& .cm-scroller": {
    fontFamily: "Courier Prime",
    fontSize: "1rem",
    overflow: "visible",
    position: "relative",
  },
  "& .cm-line": {
    opacity: 0,
    padding: 0,
  },
  "& .collapse + .collapse": {
    display: "none",
  },
  "& .collapse:first-child": {
    display: "none",
  },
  "& .collapse:last-child": {
    display: "none",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "transparent",
  },
  "& .cm-content": {
    padding: "68px 24px 68px 24px", // 24px ≈ 0.25 inch
    margin: "auto",
    maxWidth: "640px",
    position: "relative",
    caretColor: "transparent",
    pointerEvents: "auto",
    "&:before": {
      content: "''",
      position: "absolute",
      inset: "0 -96px", // 96px ≈ 1 inch
      backgroundColor: "rgb(235, 234, 232)",
      backgroundImage: "var(--screenplay-preview-texture)",
      zIndex: "-1",
    },
  },
  "& .cm-lineWrapping": {
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
  "& .cm-line.cm-activeLine": {
    backgroundColor: "transparent",
    outline: "2px solid #00000012",
  },
  "& .cm-widgetBuffer": {
    display: "none",
  },
};

export default PREVIEW_THEME;
