import styled from "@emotion/styled";
import React, { useMemo } from "react";
import { AggData } from "../../impower-data-state";
import {
  ContributionDocument,
  ProjectDocument,
} from "../../impower-data-store";
import Fallback from "../../impower-route/components/layouts/Fallback";
import PopulatedContributionList from "./PopulatedContributionList";

const StyledLoadingArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 200px;
  position: relative;
  z-index: 1;
`;

interface ContributionListContentProps {
  scrollParent?: HTMLElement;
  pitchIds?: { [contributionId: string]: string };
  pitchDocs?: { [pitchId: string]: ProjectDocument };
  contributionDocs?: { [id: string]: ContributionDocument };
  chunkMap?: { [id: string]: number };
  lastLoadedChunk?: number;
  onChangeScore?: (
    e: React.MouseEvent,
    score: number,
    contributionId: string
  ) => void;
  onKudo?: (
    e: React.MouseEvent | React.ChangeEvent,
    kudoed: boolean,
    pitchId: string,
    contributionId: string,
    data: AggData
  ) => void;
  onEdit?: (
    e: React.MouseEvent,
    pitchId: string,
    contributionId: string
  ) => void;
  onDelete?: (
    e: React.MouseEvent,
    pitchId: string,
    contributionId: string
  ) => void;
}

const ContributionListContent = React.memo(
  (props: ContributionListContentProps): JSX.Element => {
    const {
      scrollParent,
      pitchIds,
      pitchDocs,
      contributionDocs,
      chunkMap,
      lastLoadedChunk,
      onChangeScore,
      onKudo,
      onEdit,
      onDelete,
    } = props;

    const contributionEntries = useMemo(
      () => (contributionDocs ? Object.entries(contributionDocs) : undefined),
      [contributionDocs]
    );

    if (!contributionEntries) {
      return (
        <StyledLoadingArea>
          <Fallback disableShrink />
        </StyledLoadingArea>
      );
    }

    if (contributionEntries?.length === 0) {
      return null;
    }

    return (
      <>
        <PopulatedContributionList
          scrollParent={scrollParent}
          pitchIds={pitchIds}
          pitchDocs={pitchDocs}
          contributionDocs={contributionDocs}
          chunkMap={chunkMap}
          lastLoadedChunk={lastLoadedChunk}
          onChangeScore={onChangeScore}
          onKudo={onKudo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </>
    );
  }
);

export default ContributionListContent;
