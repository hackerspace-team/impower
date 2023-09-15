import { html, spec } from "../../../../../../packages/spec-component/src/spec";
import css from "../../styles/shared";
import workspace from "../../workspace/WorkspaceStore";

export default spec({
  tag: "se-header-title-button",
  stores: { workspace },
  context: ({ workspace }) => ({
    name: workspace?.current?.project?.name || "",
    syncState: workspace?.current?.project?.syncState || "",
    editingName: workspace?.current?.project?.editingName || false,
  }),
  html: ({ context }) => {
    const { name, syncState, editingName } = context;
    const label = "Project Name";
    const nameButton = () => html`
      <s-button
        id="nameButton"
        variant="text"
        text-size="lg"
        text-weight="500"
        color="fg"
        p="0 4"
        m="0 -4"
      >
        ${name}
      </s-button>
    `;
    const nameInput = () => html`
      <s-input
        id="nameInput"
        text-size="lg"
        text-weight="500"
        p="0 4"
        m="0 -4"
        placeholder-color="fab-bg"
        color="fg"
        value="${name}"
        label="${label}"
        size="sm"
        width="100%"
        autofocus
        autoselect
      ></s-input>
    `;
    const nameSkeleton = () => html`
      <s-skeleton id="name-skeleton">Untitled Project</s-skeleton>
    `;
    return html`
      <s-box child-layout="row" child-align="center" height="28">
        ${name && syncState
          ? editingName
            ? nameInput
            : nameButton
          : nameSkeleton}
      </s-box>
    `;
  },
  selectors: {
    nameButton: null,
    nameInput: null,
  } as const,
  css,
});
