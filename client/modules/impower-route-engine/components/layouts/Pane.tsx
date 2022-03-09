import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";
import React, { useRef } from "react";
import OverlayTransition from "../../../impower-route/components/animations/OverlayTransition";
import { PanelType } from "../../types/state/panelState";
import { WindowType } from "../../types/state/windowState";
import Panelbar from "../bars/Panelbar";
import AssetsPanel from "../panels/AssetsPanel";
import ContainerPanel from "../panels/ContainerPanel";
import DetailPanel from "../panels/DetailPanel";
import SetupPanel from "../panels/SetupPanel";
import TestPanel from "../panels/TestPanel";

const panelDisplayOrder: PanelType[] = [
  "Setup",
  "Entities",
  "Logic",
  "Detail",
  "Test",
];

const StyledPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props): string => props.theme.borderRadius.topTab};
  background-color: ${(props): string => props.theme.colors.darkForeground};
  pointer-events: auto;
  max-width: 100%;
  height: 100%;
`;

const StyledPanelContent = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledPanelArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface PanelContentProps {
  type: PanelType;
  windowType: WindowType;
}

const PanelContent = React.memo(
  (props: PanelContentProps): JSX.Element | null => {
    const { type, windowType } = props;

    if (!type) {
      return null;
    }

    switch (type) {
      case "Setup":
        return <SetupPanel key={type} />;
      case "Entities":
        return <ContainerPanel key={type} windowType={windowType} />;
      case "Logic":
        return <ContainerPanel key={type} windowType={windowType} />;
      case "Detail":
        if (
          windowType === "Setup" ||
          windowType === "Entities" ||
          windowType === "Logic"
        ) {
          return <DetailPanel key={type} windowType={windowType} />;
        }
        return null;
      case "Test":
        return <TestPanel key={type} />;
      case "Assets":
        return <AssetsPanel key={type} />;
      default:
        return null;
    }
  }
);

interface PanelAreaProps {
  type: PanelType;
  windowType: WindowType;
  preservePane: boolean;
  style?: React.CSSProperties;
}

const PanelArea = React.memo((props: PanelAreaProps): JSX.Element | null => {
  const { type, windowType, preservePane, style } = props;
  const previousZIndexRef = useRef(0);
  const zIndex = type === "Detail" ? 2 : 0;
  const previousZIndex = previousZIndexRef.current;
  previousZIndexRef.current = zIndex;
  const overlayDirection = zIndex - previousZIndex;
  const custom = { position: "static", overlayDirection, yDirection: 1 };

  return (
    <StyledPanelArea key={preservePane ? undefined : windowType} style={style}>
      <AnimatePresence initial={false} custom={custom} exitBeforeEnter>
        <OverlayTransition key={type} style={{ zIndex }} custom={custom}>
          <PanelContent type={type} windowType={windowType} />
        </OverlayTransition>
      </AnimatePresence>
    </StyledPanelArea>
  );
});

interface PaneContentProps {
  windowType: WindowType;
  panelFocusOrder: PanelType[];
  panelbar?: React.ReactNode;
  preservePane: boolean;
}

const PaneContent = React.memo(
  (props: PaneContentProps): JSX.Element | null => {
    const { windowType, panelFocusOrder, panelbar, preservePane } = props;

    const visiblePanelOrder = panelDisplayOrder.filter((panel) =>
      panelFocusOrder.includes(panel)
    );
    const openPanel = panelFocusOrder[0];

    if (!visiblePanelOrder) {
      return null;
    }

    if (panelbar) {
      return (
        <>
          <Panelbar openPanel={openPanel}>{panelbar}</Panelbar>
          <StyledPanelContent>
            <PanelArea
              windowType={windowType}
              type={openPanel}
              preservePane={preservePane}
            />
          </StyledPanelContent>
        </>
      );
    }

    return (
      <StyledPanelContent>
        <PanelArea
          windowType={windowType}
          type={openPanel}
          preservePane={preservePane}
        />
      </StyledPanelContent>
    );
  }
);

interface PaneProps {
  windowType: WindowType;
  panelFocusOrder: PanelType[];
  panelbar?: React.ReactNode;
  preservePane?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
}

const Pane = React.memo((props: PaneProps): JSX.Element | null => {
  const {
    windowType,
    panelFocusOrder,
    panelbar,
    preservePane = false,
    innerRef,
  } = props;

  if (panelFocusOrder.length === 0) {
    return null;
  }

  return (
    <StyledPane ref={innerRef}>
      <PaneContent
        windowType={windowType}
        panelFocusOrder={panelFocusOrder}
        panelbar={panelbar}
        preservePane={preservePane}
      />
    </StyledPane>
  );
});

export default Pane;
