import getCssColor from "../../../../sparkle-style-transformer/src/utils/getCssColor";
import getCssMask from "../../../../sparkle-style-transformer/src/utils/getCssMask";
import { Properties } from "../../../../spec-component/src/types/Properties";
import getAttributeNameMap from "../../../../spec-component/src/utils/getAttributeNameMap";
import getDependencyNameMap from "../../../../spec-component/src/utils/getDependencyNameMap";
import getKeys from "../../../../spec-component/src/utils/getKeys";
import {
  DEFAULT_SPARKLE_ATTRIBUTES,
  DEFAULT_SPARKLE_TRANSFORMERS,
} from "../../core/sparkle-element";
import SparkleElement from "../../core/sparkle-element.js";
import type Ripple from "../ripple/ripple";
import spec from "./_input";

const DEFAULT_DEPENDENCIES = getDependencyNameMap(["s-ripple"]);

const DEFAULT_TRANSFORMERS = {
  ...DEFAULT_SPARKLE_TRANSFORMERS,
  "placeholder-color": getCssColor,
};

const DEFAULT_ATTRIBUTES = {
  ...DEFAULT_SPARKLE_ATTRIBUTES,
  ...getAttributeNameMap([
    "type",
    "name",
    "value",
    "size",
    "readonly",
    "required",
    "pattern",
    "autocorrect",
    "autocomplete",
    "autofocus",
    "spellcheck",
    "label",
    "min",
    "max",
    "min-length",
    "max-length",
    "no-spin-buttons",
    "input-mode",
    "enter-key-hint",
    ...getKeys(DEFAULT_TRANSFORMERS),
  ]),
};

export default class Input
  extends SparkleElement
  implements Properties<typeof DEFAULT_ATTRIBUTES>
{
  static override get tag() {
    return spec.tag;
  }

  override get props() {
    return {
      ...super.props,
      type: this.type,
      name: this.name,
      autofocus: this.autofocus,
      autocomplete: this.autocomplete,
      autocorrect: this.autocorrect,
      autocapitalize: this.autocapitalize,
      spellcheck: this.spellcheck,
      maxLength: this.maxLength,
      minLength: this.minLength,
      pattern: this.pattern,
      label: this.label,
      enterKeyHint: this.enterKeyHint,
      inputMode: this.inputMode,
      readonly: this.readonly,
      required: this.required,
      value: this.value,
    };
  }

  override get html() {
    return spec.html({ props: this.props, state: this.state });
  }

  override get css() {
    return spec.css;
  }

  static override get dependencies() {
    return DEFAULT_DEPENDENCIES;
  }

  static override get attrs() {
    return DEFAULT_ATTRIBUTES;
  }

  override get transformers() {
    return DEFAULT_TRANSFORMERS;
  }

  /**
   * The type of input. Works the same as a native `<input>` element, but only a subset of types are supported. Defaults
   * to `text`.
   */
  get type():
    | "date"
    | "datetime-local"
    | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | null {
    return this.getStringAttribute(Input.attrs.type);
  }
  set type(value) {
    this.setStringAttribute(Input.attrs.type, value);
  }

  /** The name of the input, submitted as a name/value pair with form data. */
  get name() {
    return this.getStringAttribute(Input.attrs.name);
  }
  set name(value) {
    this.setStringAttribute(Input.attrs.name, value);
  }

  /** Makes the input readonly. */
  get readonly() {
    return this.getBooleanAttribute(Input.attrs.readonly);
  }
  set readonly(value) {
    this.setBooleanAttribute(Input.attrs.readonly, value);
  }

  /** Makes the input a required field. */
  get required() {
    return this.getBooleanAttribute(Input.attrs.required);
  }
  set required(value) {
    this.setBooleanAttribute(Input.attrs.required, value);
  }

  /** Pattern the value must match to be valid. */
  get pattern():
    | "text"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "password"
    | null {
    return this.getStringAttribute(Input.attrs.pattern);
  }
  set pattern(value) {
    this.setStringAttribute(Input.attrs.pattern, value);
  }

  /** Indicates whether the browser's autocorrect feature is on or off. */
  get autocorrect(): "off" | "on" | null {
    return this.getStringAttribute(Input.attrs.autocorrect);
  }
  set autocorrect(value) {
    this.setStringAttribute(Input.attrs.autocorrect, value);
  }

  /**
   * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
   * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
   */
  get autocomplete() {
    return this.getStringAttribute(Input.attrs.autocomplete);
  }
  set autocomplete(value) {
    this.setStringAttribute(Input.attrs.autocomplete, value);
  }

  /** The input's minimum value. Only applies to date and number input types. */
  get min() {
    return this.getStringAttribute(Input.attrs.min);
  }
  set min(value) {
    this.setStringAttribute(Input.attrs.min, value);
  }

  /** The input's maximum value. Only applies to date and number input types. */
  get max() {
    return this.getStringAttribute(Input.attrs.max);
  }
  set max(value) {
    this.setStringAttribute(Input.attrs.max, value);
  }

  /** The minimum length of input that will be considered valid. */
  get minLength() {
    return this.getNumberAttribute(Input.attrs.minLength);
  }
  set minLength(value) {
    this.setNumberAttribute(Input.attrs.minLength, value);
  }

  /** The maximum length of input that will be considered valid. */
  get maxLength() {
    return this.getNumberAttribute(Input.attrs.maxLength);
  }
  set maxLength(value) {
    this.setNumberAttribute(Input.attrs.maxLength, value);
  }

  /** Don't display spin buttons in number field. */
  get noSpinButtons() {
    return this.getStringAttribute(Input.attrs.noSpinButtons);
  }
  set noSpinButtons(value) {
    this.setStringAttribute(Input.attrs.noSpinButtons, value);
  }

  /** The input's size. */
  get size(): "sm" | "md" | "lg" | null {
    return this.getStringAttribute(Input.attrs.size);
  }
  set size(value) {
    this.setStringAttribute(Input.attrs.size, value);
  }

  /** Label text to show as a hint when the input is empty. */
  get label() {
    return this.getStringAttribute(Input.attrs.label);
  }
  set label(value) {
    this.setStringAttribute(Input.attrs.label, value);
  }

  /** The current value of the input, submitted as a name/value pair with form data. */
  get value() {
    return this.getStringAttribute(Input.attrs.value);
  }
  set value(value) {
    this.setStringAttribute(Input.attrs.value, value);
  }

  /** The color to use for the placeholder text. */
  get placeholderColor() {
    return this.getStringAttribute(Input.attrs.placeholderColor);
  }
  set placeholderColor(value) {
    this.setStringAttribute(Input.attrs.placeholderColor, value);
  }

  get inputEl() {
    return this.getElementByTag<HTMLInputElement>("input");
  }

  get rippleEl(): Ripple | null {
    return this.getElementByTag<Ripple>(Input.dependencies.ripple);
  }

  override onAttributeChanged(name: string, newValue: string): void {
    if (name === Input.attrs.disabled) {
      const ripple = this.rippleEl;
      if (ripple) {
        ripple.hidden = newValue != null;
      }
    }
    if (name === Input.attrs.mask) {
      const ripple = this.rippleEl;
      if (ripple) {
        if (newValue) {
          const mask = getCssMask(newValue);
          ripple.root.style.webkitMask = mask;
          ripple.root.style.mask = mask;
        }
      }
    }
  }

  override onConnected(): void {
    this.rippleEl?.bind?.(this.root);
  }

  override onDisconnected(): void {
    this.rippleEl?.unbind?.(this.root);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sl-input": Input;
  }
}
