import Badge from "./components/badge/badge";
import Box from "./components/box/box";
import BreakpointObserver from "./components/breakpoint-observer/breakpoint-observer";
import Button from "./components/button/button";
import Circle from "./components/circle/circle";
import Collapsible from "./components/collapsible/collapsible";
import Dialog from "./components/dialog/dialog";
import Divider from "./components/divider/divider";
import Icon from "./components/icon/icon";
import Popup from "./components/popup/popup";
import ProgressBar from "./components/progress-bar/progress-bar";
import ProgressCircle from "./components/progress-circle/progress-circle";
import Ripple from "./components/ripple/ripple";
import Router from "./components/router/router";
import Skeleton from "./components/skeleton/skeleton";
import SplitLayout from "./components/split-layout/split-layout";
import Tab from "./components/tab/tab";
import Tabs from "./components/tabs/tabs";
import ToastStack from "./components/toast-stack/toast-stack";
import Toast from "./components/toast/toast";
import Tooltip from "./components/tooltip/tooltip";
import SparkleElement from "./core/sparkle-element";
import initialize from "./initialize/initialize";
import animations from "./styles/animations/animations.css";
import dark from "./styles/dark/dark.css";
import easings from "./styles/easings/easings.css";
import global from "./styles/global/global.css";
import gradients from "./styles/gradients/gradients.css";
import icons from "./styles/icons/icons.css";
import keyframes from "./styles/keyframes/keyframes.css";
import light from "./styles/light/light.css";
import masks from "./styles/masks/masks.css";
import patterns from "./styles/patterns/patterns.css";
import shadows from "./styles/shadows/shadows.css";
import { SparkleElementTag } from "./types/sparkleElementTag";
import { SparkleStyleType } from "./types/sparkleStyleType";

export const DEFAULT_SPARKLE_CONSTRUCTORS: Record<
  SparkleElementTag,
  typeof SparkleElement
> = {
  "s-box": Box,
  "s-circle": Circle,
  "s-icon": Icon,
  "s-popup": Popup,
  "s-divider": Divider,
  "s-progress-bar": ProgressBar,
  "s-progress-circle": ProgressCircle,
  "s-ripple": Ripple,
  "s-skeleton": Skeleton,
  "s-badge": Badge,
  "s-collapsible": Collapsible,
  "s-button": Button,
  "s-tab": Tab,
  "s-tabs": Tabs,
  "s-tooltip": Tooltip,
  "s-toast-stack": ToastStack,
  "s-toast": Toast,
  "s-dialog": Dialog,
  "s-split-layout": SplitLayout,
  "s-router": Router,
  "s-breakpoint-observer": BreakpointObserver,
};

export const DEFAULT_SPARKLE_STYLES: Record<SparkleStyleType, string> = {
  global,
  light,
  dark,
  icons,
  shadows,
  gradients,
  masks,
  easings,
  keyframes,
  animations,
  patterns,
};

export default abstract class Sparkle {
  static async init(
    useShadowDom = true,
    styles = DEFAULT_SPARKLE_STYLES,
    constructors = DEFAULT_SPARKLE_CONSTRUCTORS,
    dependencies?: Record<SparkleElementTag, string>
  ): Promise<CustomElementConstructor[]> {
    return initialize(styles, constructors, dependencies, useShadowDom);
  }
}