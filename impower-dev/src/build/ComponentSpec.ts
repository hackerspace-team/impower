export interface ComponentSpec<
  Props extends Record<string, unknown> = Record<string, unknown>,
  Stores extends Record<string, { current: any }> = Record<
    string,
    { current: any }
  >,
  Context extends Record<string, unknown> = Record<string, unknown>,
  Graphics extends Record<string, string> = Record<string, string>,
  Selectors extends Record<string, null | string | string[]> = Record<
    string,
    null | string | string[]
  >
> {
  tag: `${string}-${string}`;
  stores: Stores;
  graphics: Graphics;
  reducer: (stores: Stores) => Context;
  props: Props;
  css: string[];
  html?: (args: {
    graphics: Graphics;
    stores: Stores;
    context: Context;
    props: Props;
  }) => string;
  selectors: Selectors;
  shadowDOM: boolean;
}
