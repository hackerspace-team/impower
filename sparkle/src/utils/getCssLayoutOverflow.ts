export const getCssLayoutOverflow = (value: string): string => {
  if (value === "") {
    return "wrap";
  }
  if (value === "visible") {
    return "nowrap";
  }
  if (value === "reverse") {
    return "wrap-reverse";
  }
  return value;
};
