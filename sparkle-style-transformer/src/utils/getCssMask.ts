const getCssMask = (value: string): string => {
  return `var(--s-mask-${value})`;
};

export default getCssMask;
