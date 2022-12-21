import { WidgetType } from "@codemirror/view";

const Icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.0.0-beta1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M192 320c0 17.67 14.33 32 32 32s32-14.33 32-32S241.7 288 224 288S192 302.3 192 320zM96 320c0 17.67 14.33 32 32 32s32-14.33 32-32S145.7 288 128 288S96 302.3 96 320zM639.1 69.79c0-11.26-4.295-22.52-12.89-31.11L601.3 12.89c-8.592-8.592-19.85-12.89-31.11-12.89S547.7 4.295 539.1 12.89L311.7 240.3c-3.072 3.072-5.164 6.984-6.016 11.24l-17.46 87.32c-.1486 .7434-.2188 1.471-.2188 2.191c0 6.012 4.924 10.94 10.94 10.94c.7197 0 1.449-.0707 2.192-.2194l87.33-17.46c4.258-.8516 8.168-2.945 11.24-6.016l227.4-227.4C635.7 92.31 639.1 81.05 639.1 69.79zM511.1 326.6C511.1 326.6 511.1 326.6 511.1 326.6L511.1 448H63.1V192h228.1l63.1-64H63.1C28.66 128 0 156.7 0 192v256c0 35.35 28.66 64 63.1 64h447.1c35.34 0 63.1-28.65 63.1-63.1L576 219.9l-64 63.99L511.1 326.6z"/></svg>`;

export class StructToolbarWidgetType extends WidgetType {
  toDOM(): HTMLElement {
    const root = document.createElement("span");
    root.className = "cm-struct-toolbar";
    root.style.marginLeft = "8px";
    root.style.opacity = "0.75";
    root.style.color = "white";
    root.style.float = "right";
    root.style.display = "flex";
    const button = document.createElement("button");
    button.className = "cm-struct-toolbar-autofill";
    button.innerHTML = Icon;
    button.style.color = "#2B83B7";
    button.style.fill = "currentColor";
    button.style.width = "1rem";
    button.style.height = "1rem";
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.backgroundColor = "transparent";
    button.style.padding = "0";
    button.style.margin = "2px 4px";
    button.style.border = "none";
    (button.firstElementChild as HTMLElement).style.pointerEvents = "none";
    root.appendChild(button);
    return root;
  }

  override ignoreEvent(): boolean {
    return false;
  }
}