import { html } from "../../../../../../packages/spark-element/src/utils/html";

export default (state: { attrs?: { "directory-path": string | null } }) => {
  const directoryPath = state?.attrs?.["directory-path"] || "";
  return {
    html: html`
      <s-button
        class="root"
        id="item"
        width="100%"
        height="56"
        corner="0"
        variant="text"
        size="lg"
        color="fg-80"
        text-weight="normal"
        position="relative"
        value="${directoryPath}"
      >
        <s-box
          position="absolute"
          i="0"
          child-layout="row"
          child-align="center"
        >
          <s-box
            position="relative"
            height="100%"
            child-layout="row"
            child-align="center"
            grow
          >
            <s-box p="0 0 0 32" position="absolute" text-overflow="ellipsis">
              <slot></slot>
            </s-box>
          </s-box>
          <se-file-options-button></se-file-options-button>
        </s-box>
      </s-button>
    `,
  };
};
