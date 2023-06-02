import transformer from "../../sparkle-style-transformer/src/index";
import Badge from "./components/badge/_badge";
import Box from "./components/box/_box";
import BreakpointObserver from "./components/breakpoint-observer/_breakpoint-observer";
import Button from "./components/button/_button";
import Circle from "./components/circle/_circle";
import Collapsible from "./components/collapsible/_collapsible";
import Dialog from "./components/dialog/_dialog";
import Divider from "./components/divider/_divider";
import Icon from "./components/icon/_icon";
import Popup from "./components/popup/_popup";
import ProgressBar from "./components/progress-bar/_progress-bar";
import ProgressCircle from "./components/progress-circle/_progress-circle";
import Ripple from "./components/ripple/_ripple";
import Router from "./components/router/_router";
import Skeleton from "./components/skeleton/_skeleton";
import SplitPane from "./components/split-pane/_split-pane";
import Tab from "./components/tab/_tab";
import Tabs from "./components/tabs/_tabs";
import ToastStack from "./components/toast-stack/_toast-stack";
import Toast from "./components/toast/_toast";
import Tooltip from "./components/tooltip/_tooltip";
import Transition from "./components/transition/_transition";
import Animations from "./styles/animations/_animations";
import Core from "./styles/core/_core";
import coreCSS from "./styles/core/core.css";
import Dark from "./styles/dark/_dark";
import Easings from "./styles/easings/_easings";
import Global from "./styles/global/_global";
import Gradients from "./styles/gradients/_gradients";
import Icons from "./styles/icons/_icons";
import iconsCSS from "./styles/icons/icons.css";
import Keyframes from "./styles/keyframes/_keyframes";
import Light from "./styles/light/_light";
import Masks from "./styles/masks/_masks";
import Normalize from "./styles/normalize/_normalize";
import Patterns from "./styles/patterns/_patterns";
import patternsCSS from "./styles/patterns/patterns.css";
import Shadows from "./styles/shadows/_shadows";

const config = {
  patterns: [patternsCSS],
  icons: [iconsCSS],
};

type Component = () => { html?: string; css?: string };

const style = (component: Component): Component => {
  const data = component();
  const html = data.html ? transformer(data.html, config) : data.html;
  const css = data.css || coreCSS;
  return () => {
    return { html, css };
  };
};

const components = {
  "s-box": style(Box),
  "s-circle": style(Circle),
  "s-icon": style(Icon),
  "s-popup": style(Popup),
  "s-divider": style(Divider),
  "s-progress-bar": style(ProgressBar),
  "s-progress-circle": style(ProgressCircle),
  "s-ripple": style(Ripple),
  "s-skeleton": style(Skeleton),
  "s-badge": style(Badge),
  "s-collapsible": style(Collapsible),
  "s-button": style(Button),
  "s-tab": style(Tab),
  "s-tabs": style(Tabs),
  "s-tooltip": style(Tooltip),
  "s-toast-stack": style(ToastStack),
  "s-toast": style(Toast),
  "s-dialog": style(Dialog),
  "s-split-pane": style(SplitPane),
  "s-transition": style(Transition),
  "s-router": style(Router),
  "s-breakpoint-observer": style(BreakpointObserver),
  "s-core": Core,
  "s-normalize": Normalize,
  "s-animations": Animations,
  "s-dark": Dark,
  "s-easings": Easings,
  "s-global": Global,
  "s-gradients": Gradients,
  "s-icons": Icons,
  "s-keyframes": Keyframes,
  "s-light": Light,
  "s-masks": Masks,
  "s-patterns": Patterns,
  "s-shadows": Shadows,
} as const;

export default components;