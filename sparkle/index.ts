import Badge from "./src/components/badge/badge";
import Box from "./src/components/box/box";
import BreakpointObserver from "./src/components/breakpoint-observer/breakpoint-observer";
import Button from "./src/components/button/button";
import Circle from "./src/components/circle/circle";
import Collapsible from "./src/components/collapsible/collapsible";
import Cutter from "./src/components/cutter/cutter";
import Divider from "./src/components/divider/divider";
import Icon from "./src/components/icon/icon";
import Popup from "./src/components/popup/popup";
import ProgressBar from "./src/components/progress-bar/progress-bar";
import ProgressCircle from "./src/components/progress-circle/progress-circle";
import Ripple from "./src/components/ripple/ripple";
import Router from "./src/components/router/router";
import Skeleton from "./src/components/skeleton/skeleton";
import SplitLayout from "./src/components/split-layout/split-layout";
import Tab from "./src/components/tab/tab";
import Tabs from "./src/components/tabs/tabs";
import ToastStack from "./src/components/toast-stack/toast-stack";
import Toast from "./src/components/toast/toast";
import Tooltip from "./src/components/tooltip/tooltip";
import Animations from "./src/helpers/animations";
import animationsCSS from "./src/themes/animations.css";
import darkCSS from "./src/themes/dark.css";
import fontsCSS from "./src/themes/fonts.css";
import globalCSS from "./src/themes/global.css";
import lightCSS from "./src/themes/light.css";
import { getAllAnimations } from "./src/utils/getAllAnimations";

/* Events */
export { default as SpAfterCollapseEvent } from "./src/events/after-collapse";
export { default as SpAfterExpandEvent } from "./src/events/after-expand";
export { default as SpAfterHideEvent } from "./src/events/after-hide";
export { default as SpAfterShowEvent } from "./src/events/after-show";
export { default as SpBlurEvent } from "./src/events/blur";
export { default as SpCancelEvent } from "./src/events/cancel";
export { default as SpChangeEvent } from "./src/events/change";
export { default as SpClearEvent } from "./src/events/clear";
export { default as SpCloseEvent } from "./src/events/close";
export { default as SpCollapseEvent } from "./src/events/collapse";
export { default as SpErrorEvent } from "./src/events/error";
export { default as SpExpandEvent } from "./src/events/expand";
export { default as SpFinishEvent } from "./src/events/finish";
export { default as SpFocusEvent } from "./src/events/focus";
export { default as SpHideEvent } from "./src/events/hide";
export { default as SpHoverEvent } from "./src/events/hover";
export { default as SpInitialFocusEvent } from "./src/events/initial-focus";
export { default as SpInputEvent } from "./src/events/input";
export { default as SpInvalidEvent } from "./src/events/invalid";
export { default as SpLazyChangeEvent } from "./src/events/lazy-change";
export { default as SpLazyLoadEvent } from "./src/events/lazy-load";
export { default as SpLoadEvent } from "./src/events/load";
export { default as SpMutationEvent } from "./src/events/mutation";
export { default as SpRemoveEvent } from "./src/events/remove";
export { default as SpRepositionEvent } from "./src/events/reposition";
export { default as SpRequestCloseEvent } from "./src/events/request-close";
export { default as SpResizeEvent } from "./src/events/resize";
export { default as SpSelectEvent } from "./src/events/select";
export { default as SpSelectionChangeEvent } from "./src/events/selection-change";
export { default as SpShowEvent } from "./src/events/show";
export { default as SpSlideChange } from "./src/events/slide-change";
export { default as SpStartEvent } from "./src/events/start";
export { default as SpTabHideEvent } from "./src/events/tab-hide";
export { default as SpTabShowEvent } from "./src/events/tab-show";

export const DEFAULT_SPARKLE_TAGS = {
  "s-box": "s-box",
  "s-circle": "s-circle",
  "s-icon": "s-icon",
  "s-popup": "s-popup",
  "s-divider": "s-divider",
  "s-progress-bar": "s-progress-bar",
  "s-progress-circle": "s-progress-circle",
  "s-ripple": "s-ripple",
  "s-skeleton": "s-skeleton",
  "s-badge": "s-badge",
  "s-cutter": "s-cutter",
  "s-collapsible": "s-collapsible",
  "s-button": "s-button",
  "s-tab": "s-tab",
  "s-tabs": "s-tabs",
  "s-tooltip": "s-tooltip",
  "s-toast-stack": "s-toast-stack",
  "s-toast": "s-toast",
  "s-split-layout": "s-split-layout",
  "s-router": "s-router",
  "s-breakpoint-observer": "s-breakpoint-observer",
};

const animateSheet = new CSSStyleSheet();
animateSheet.replaceSync(animationsCSS);
const fontsSheet = new CSSStyleSheet();
fontsSheet.replaceSync(fontsCSS);
const globalSheet = new CSSStyleSheet();
globalSheet.replaceSync(globalCSS);
const lightSheet = new CSSStyleSheet();
lightSheet.replaceSync(lightCSS);
const darkSheet = new CSSStyleSheet();
darkSheet.replaceSync(darkCSS);

export const DEFAULT_SPARKLE_STYLESHEETS = {
  fonts: fontsSheet,
  animations: animateSheet,
  global: globalSheet,
  light: lightSheet,
  dark: darkSheet,
};

export default abstract class Sparkle {
  static async define(
    tags = DEFAULT_SPARKLE_TAGS
  ): Promise<CustomElementConstructor[]> {
    return Promise.all([
      Box.define(tags["s-box"], tags),
      Circle.define(tags["s-circle"], tags),
      Icon.define(tags["s-icon"], tags),
      Popup.define(tags["s-popup"], tags),
      Divider.define(tags["s-divider"], tags),
      ProgressBar.define(tags["s-progress-bar"], tags),
      ProgressCircle.define(tags["s-progress-circle"], tags),
      Ripple.define(tags["s-ripple"], tags),
      Skeleton.define(tags["s-skeleton"], tags),
      Badge.define(tags["s-badge"], tags),
      Cutter.define(tags["s-cutter"], tags),
      Collapsible.define(tags["s-collapsible"], tags),
      Button.define(tags["s-button"], tags),
      Tab.define(tags["s-tab"], tags),
      Tabs.define(tags["s-tabs"], tags),
      Tooltip.define(tags["s-tooltip"], tags),
      ToastStack.define(tags["s-toast-stack"], tags),
      Toast.define(tags["s-toast"], tags),
      SplitLayout.define(tags["s-split-layout"], tags),
      Router.define(tags["s-router"], tags),
      BreakpointObserver.define(tags["s-breakpoint-observer"], tags),
    ]);
  }

  static adopt(styleSheets = DEFAULT_SPARKLE_STYLESHEETS): void {
    if (!document.adoptedStyleSheets) {
      document.adoptedStyleSheets = [];
    }
    document.adoptedStyleSheets.push(...Object.values(styleSheets));
    Animations.init(getAllAnimations(styleSheets.animations));
  }
}
