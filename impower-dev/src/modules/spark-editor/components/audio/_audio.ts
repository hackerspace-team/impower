import { html } from "../../core/html";
import { WorkspaceState } from "../../workspace/types/WorkspaceState";

export default (state?: { store?: WorkspaceState }) => {
  const mode = state?.store?.audio?.panel || "sounds";
  return {
    html: html`
      <s-router directional key="window/audio" active="${mode}">
        <s-tabs
          color="tab-active"
          height="panel-nav"
          bg-color="panel"
          position="sticky-top"
          slot="header"
          active="${mode}"
        >
          <s-box
            bg-color="panel"
            position="absolute"
            i="0 0 0 0"
            height="100vh"
            translate-y="-100%"
          ></s-box>
          <s-tab
            color="tab-active"
            text-color="tab-inactive"
            text-color="tab-inactive"
            p="20"
            child-layout="row"
            icon="wave-saw"
            value="sounds"
            ${mode === "sounds" ? "active" : ""}
          >
            Sounds
          </s-tab>
          <s-tab
            color="tab-active"
            text-color="tab-inactive"
            text-color="tab-inactive"
            p="20"
            child-layout="row"
            icon="music"
            value="music"
            ${mode === "music" ? "active" : ""}
          >
            Music
          </s-tab>
        </s-tabs>
        <template value="sounds">
          <se-sounds></se-sounds>
        </template>
        <template value="music">
          <se-music></se-music>
        </template>
      </s-router>
    `,
  };
};
