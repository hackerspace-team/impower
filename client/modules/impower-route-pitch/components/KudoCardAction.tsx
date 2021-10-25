import styled from "@emotion/styled";
import IconButton from "@material-ui/core/IconButton";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useMemo, useState } from "react";
import BellRegularIcon from "../../../resources/icons/regular/bell.svg";
import EllipsisVerticalRegularIcon from "../../../resources/icons/regular/ellipsis-vertical.svg";
import FlagRegularIcon from "../../../resources/icons/regular/flag.svg";
import BellSolidIcon from "../../../resources/icons/solid/bell.svg";
import { escapeURI, getDataStoreKey } from "../../impower-data-store";
import { useDialogNavigation } from "../../impower-dialog";
import { FontIcon } from "../../impower-icon";
import { UserContext, userDoFollow, userUndoFollow } from "../../impower-user";

const PostMenu = dynamic(
  () => import("../../impower-route/components/popups/PostMenu"),
  { ssr: false }
);

const StyledIconButton = styled(IconButton)`
  margin-bottom: ${(props): string => props.theme.spacing(-0.5)};
  @media (hover: hover) and (pointer: fine) {
    &.MuiIconButton-root:hover {
      background-color: ${(props): string => props.theme.colors.black10};
    }
  }
`;

interface KudoCardActionProps {
  targetId: string;
  id: string;
  createdBy: string;
}

const KudoCardAction = React.memo((props: KudoCardActionProps): JSX.Element => {
  const { targetId, id, createdBy } = props;

  const [userState, userDispatch] = useContext(UserContext);
  const { uid, my_follows } = userState;
  const followedUser =
    my_follows !== undefined
      ? Boolean(my_follows?.[getDataStoreKey("users", createdBy)])
      : undefined;

  const [postMenuOpen, setPostMenuOpen] = useState<boolean>();
  const [postMenuAnchor, setPostMenuAnchor] = useState<HTMLElement>();

  const url = `/p/${targetId}/k/${id}`;

  const handleBrowserNavigation = useCallback(
    (currState: Record<string, string>, prevState?: Record<string, string>) => {
      if (currState?.m !== prevState?.m) {
        setPostMenuOpen(currState?.m === id);
      }
    },
    [id]
  );
  const [openMenuDialog, closeMenuDialog] = useDialogNavigation(
    "m",
    handleBrowserNavigation
  );

  const handleBlockRipplePropogation = useCallback(
    (e: React.MouseEvent | React.TouchEvent): void => {
      e.stopPropagation();
    },
    []
  );

  const handleOpenPostMenu = useCallback(
    async (e: React.MouseEvent): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      setPostMenuAnchor(e.currentTarget as HTMLElement);
      setPostMenuOpen(true);
      openMenuDialog(id);
    },
    [openMenuDialog, id]
  );

  const handleClosePostMenu = useCallback(
    async (e: React.MouseEvent): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      setPostMenuOpen(false);
      closeMenuDialog();
    },
    [closeMenuDialog]
  );

  const handleFollowUser = useCallback(
    async (e: React.MouseEvent, followed: boolean): Promise<void> => {
      if (followed) {
        userDispatch(userDoFollow("users", createdBy));
      } else {
        userDispatch(userUndoFollow("users", createdBy));
      }
    },
    [createdBy, userDispatch]
  );

  const handleReport = useCallback(async (): Promise<void> => {
    const router = (await import("next/router")).default;
    // wait a bit for post dialog to close
    await new Promise((resolve) => window.setTimeout(resolve, 1));
    router.push(`/report?url=${escapeURI(url)}`);
  }, [url]);

  const handlePostMenuOption = useCallback(
    async (e: React.MouseEvent, option: string): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      if (option === "FollowUser") {
        handleFollowUser(e, !followedUser);
      }
      if (option === "Report") {
        handleReport();
      }
      handleClosePostMenu(e);
    },
    [followedUser, handleClosePostMenu, handleFollowUser, handleReport]
  );

  const postNotCreatorOptions = useMemo(
    (): {
      [option: string]: {
        label: string;
        icon: React.ReactNode;
      };
    } => ({
      FollowUser: {
        label: followedUser ? "Following User" : "Follow User",
        icon: followedUser ? <BellSolidIcon /> : <BellRegularIcon />,
      },
      Report: {
        label: "Report",
        icon: <FlagRegularIcon />,
      },
    }),
    [followedUser]
  );

  const options = useMemo(
    (): {
      [option: string]: {
        label: string;
        icon: React.ReactNode;
      };
    } => (createdBy === uid ? {} : { ...postNotCreatorOptions }),
    [createdBy, postNotCreatorOptions, uid]
  );

  const iconStyle: React.CSSProperties = useMemo(() => ({ opacity: 0.6 }), []);

  return (
    <>
      {options && Object.keys(options).length > 0 && (
        <StyledIconButton
          color="inherit"
          aria-label="Options"
          onClick={handleOpenPostMenu}
          onMouseDown={handleBlockRipplePropogation}
          onTouchStart={handleBlockRipplePropogation}
        >
          <FontIcon aria-label="Options" size={20} style={iconStyle}>
            <EllipsisVerticalRegularIcon />
          </FontIcon>
        </StyledIconButton>
      )}
      {postMenuOpen !== undefined && (
        <PostMenu
          anchorEl={postMenuAnchor}
          open={postMenuOpen}
          options={options}
          onClose={handleClosePostMenu}
          onOption={handlePostMenuOption}
        />
      )}
    </>
  );
});

export default KudoCardAction;
