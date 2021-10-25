import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import getLocalizationConfigParameters from "../../../../lib/getLocalizationConfigParameters";
import getTagConfigParameters from "../../../../lib/getTagConfigParameters";
import { initAdminApp } from "../../../../lib/initAdminApp";
import { ConfigParameters } from "../../../../modules/impower-config";
import ConfigCache from "../../../../modules/impower-config/classes/configCache";
import {
  confirmDialogClose,
  ConfirmDialogContext,
} from "../../../../modules/impower-confirm-dialog";
import {
  ContributionDocument,
  getSerializableDocument,
  ProjectDocument,
} from "../../../../modules/impower-data-store";
import DataStoreCache from "../../../../modules/impower-data-store/classes/dataStoreCache";
import { useDialogNavigation } from "../../../../modules/impower-dialog";
import {
  NavigationContext,
  navigationSetBackgroundColor,
  navigationSetElevation,
  navigationSetLinks,
  navigationSetSearchbar,
  navigationSetText,
  navigationSetType,
} from "../../../../modules/impower-navigation";
import { PageHead, ShareArticleHead } from "../../../../modules/impower-route";
import ContributionCard from "../../../../modules/impower-route-pitch/components/ContributionCard";
import ContributionCardLayout from "../../../../modules/impower-route-pitch/components/ContributionCardLayout";
import PostFooter from "../../../../modules/impower-route-pitch/components/PostFooter";
import PostLayout from "../../../../modules/impower-route-pitch/components/PostLayout";
import PageNotFound from "../../../../modules/impower-route/components/layouts/PageNotFound";
import useBodyBackgroundColor from "../../../../modules/impower-route/hooks/useBodyBackgroundColor";
import useHTMLBackgroundColor from "../../../../modules/impower-route/hooks/useHTMLBackgroundColor";
import useThemeColor from "../../../../modules/impower-route/hooks/useThemeColor";
import { UserContext } from "../../../../modules/impower-user";

const DelistedContributionBanner = dynamic(
  () =>
    import(
      "../../../../modules/impower-route-pitch/components/DelistedContributionBanner"
    ),
  { ssr: false }
);

const CreateContributionDialog = dynamic(
  () =>
    import(
      "../../../../modules/impower-route-pitch/components/CreateContributionDialog"
    ),
  { ssr: false }
);

const StyledPage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledPageContent = styled.div`
  flex: 1;
  position: relative;
`;

const StyledAbsoluteContent = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
`;

interface ContributionPostPageProps {
  pid: string;
  cid: string;
  pitchDoc: ProjectDocument;
  contributionDoc: ContributionDocument;
  config: ConfigParameters;
  ogImage: string;
}

const ContributionPostPageContent = React.memo(
  (props: ContributionPostPageProps) => {
    const pitchedCollection = "pitched_games";

    const { pid, cid, pitchDoc, contributionDoc, config, ogImage } = props;

    const [, navigationDispatch] = useContext(NavigationContext);
    const [, confirmDialogDispatch] = useContext(ConfirmDialogContext);
    const [userState] = useContext(UserContext);
    const { my_recent_contributions } = userState;

    // Use user's recent submission if it exists, otherwise use doc from server.
    // This allows us to display a user's submission instantly
    // (even before it is finished uploading to the server)
    const recentSubmission = my_recent_contributions?.[pid]?.[cid];
    const validContributionDoc = recentSubmission || contributionDoc;
    const [contributionDocState, setContributionDocState] = useState(
      validContributionDoc || undefined
    );
    const [viewingArchvied, setViewingArchived] = useState(false);
    const contributionDocRef = useRef(validContributionDoc || undefined);
    const { _author: author, content, _createdAt } = contributionDocState;
    const hasUnsavedChangesRef = useRef(false);

    const createdAtISO =
      typeof _createdAt === "string"
        ? _createdAt
        : _createdAt?.toDate()?.toJSON();

    const theme = useTheme();

    ConfigCache.instance.set(config);

    useBodyBackgroundColor(theme.colors.lightForeground);
    useHTMLBackgroundColor(theme.colors.lightForeground);
    useThemeColor(theme.palette.primary.main);

    useEffect(() => {
      if (validContributionDoc) {
        contributionDocRef.current = validContributionDoc;
        setContributionDocState(validContributionDoc);
      } else {
        const loadContributionDoc = async (): Promise<void> => {
          try {
            const DataStoreRead = (
              await import(
                "../../../../modules/impower-data-store/classes/dataStoreRead"
              )
            ).default;
            const snap = await new DataStoreRead(
              pitchedCollection,
              pid,
              "contributions",
              cid
            ).get();
            const doc = snap.data() as ContributionDocument;
            if (doc) {
              contributionDocRef.current = doc;
              setContributionDocState(contributionDocRef.current);
            } else {
              contributionDocRef.current = null;
              setContributionDocState(contributionDocRef.current);
            }
          } catch {
            contributionDocRef.current = null;
            setContributionDocState(contributionDocRef.current);
          }
        };
        loadContributionDoc();
      }
    }, [cid, pid, validContributionDoc]);

    useEffect(() => {
      contributionDocRef.current = validContributionDoc;
      setContributionDocState(validContributionDoc);
    }, [validContributionDoc]);

    useEffect(() => {
      DataStoreCache.instance.clear();
    }, []);

    useEffect(() => {
      navigationDispatch(navigationSetType("none"));
      navigationDispatch(navigationSetText(undefined, "Contribution"));
      navigationDispatch(navigationSetLinks());
      navigationDispatch(navigationSetSearchbar());
      navigationDispatch(navigationSetElevation());
      navigationDispatch(navigationSetBackgroundColor());
    }, [navigationDispatch]);

    const url = useMemo(() => `/p/${pid}/c/${cid}`, [cid, pid]);

    const [editDialogOpen, setEditDialogOpen] = useState<boolean>();

    const handleChangeScore = useCallback(
      (e: React.MouseEvent<Element, MouseEvent>, score: number): void => {
        contributionDocRef.current.score = score || 0;
        DataStoreCache.instance.override(cid, { score });
        setContributionDocState({ ...contributionDocRef.current });
      },
      [cid]
    );

    const handleKudo = useCallback(
      (
        e: React.MouseEvent,
        kudoed: boolean,
        pitchId: string,
        contributionId: string
      ): void => {
        if (pitchId === pid && contributionId === cid) {
          const kudos = kudoed
            ? (contributionDocRef.current.kudos || 0) + 1
            : (contributionDocRef.current.kudos || 0) - 1;
          const currentDoc = contributionDocRef.current;
          const newDoc = { ...currentDoc, kudos };
          contributionDocRef.current = newDoc;
          DataStoreCache.instance.override(contributionId, { kudos });
          setContributionDocState({ ...contributionDocRef.current });
        }
      },
      [cid, pid]
    );

    const [, closeAppDialog] = useDialogNavigation("a");

    const handleDeleteContribution = useCallback((): void => {
      if (contributionDocRef.current) {
        contributionDocRef.current = {
          ...contributionDocRef.current,
          contributed: false,
          delisted: true,
          content: "[deleted]",
          file: { storageKey: "", fileUrl: "" },
          _author: { u: "[deleted]", i: null, h: "#FFFFFF" },
        };
      }
      setContributionDocState(contributionDocRef.current);
      confirmDialogDispatch(confirmDialogClose());
      closeAppDialog();
    }, [confirmDialogDispatch, closeAppDialog]);

    const handleBrowserNavigation = useCallback(
      (
        currState: Record<string, string>,
        prevState?: Record<string, string>
      ) => {
        if (currState?.e !== prevState?.e) {
          setEditDialogOpen(currState?.e === "contribution");
        }
      },
      []
    );
    const [openEditDialog, closeEditDialog] = useDialogNavigation(
      "e",
      handleBrowserNavigation
    );

    const handleOpenEditDialog = useCallback((): void => {
      setEditDialogOpen(true);
      openEditDialog("contribution");
    }, [openEditDialog]);

    const handleCloseEditDialog = useCallback((): void => {
      if (hasUnsavedChangesRef.current) {
        return;
      }
      setEditDialogOpen(false);
      closeEditDialog();
    }, [closeEditDialog]);

    const handleUnsavedChange = useCallback(
      (hasUnsavedChanges: boolean): void => {
        hasUnsavedChangesRef.current = hasUnsavedChanges;
      },
      []
    );

    const handleBack = useCallback(async () => {
      const router = (await import("next/router")).default;
      router.push(`/p/${pid}`);
    }, [pid]);

    const handleViewArchived = useCallback(
      async (value: ContributionDocument) => {
        setContributionDocState(value);
        setViewingArchived(true);
      },
      []
    );

    const postStyle: React.CSSProperties = useMemo(
      () => ({
        backgroundColor: "white",
        boxShadow: theme.shadows[1],
        overflowX: "hidden",
        overflowY: "scroll",
        overscrollBehavior: "contain",
        maxHeight: "100%",
        borderRadius: 0,
      }),
      [theme.shadows]
    );

    const cardStyle: React.CSSProperties = useMemo(
      () => ({
        borderRadius: 0,
      }),
      []
    );

    const buttonContentStyle: React.CSSProperties = useMemo(
      () => ({
        padding: 0,
      }),
      []
    );

    const delisted = contributionDocState?.delisted;

    if (contributionDocState === undefined) {
      return (
        <>
          <PostLayout style={postStyle}>
            <ContributionCardLayout />
          </PostLayout>
        </>
      );
    }

    if (!contributionDocState) {
      return <PageNotFound />;
    }

    return (
      <StyledPage>
        <ShareArticleHead
          author={author?.u}
          publishedTime={createdAtISO}
          modifiedTime={createdAtISO}
          section={`Game Contribution`}
          title={`Impower Games`}
          description={content}
          url={url}
          image={ogImage}
        />
        <StyledPageContent>
          <StyledAbsoluteContent>
            <PostLayout style={postStyle}>
              {delisted && (
                <DelistedContributionBanner
                  pitchId={pid}
                  id={cid}
                  archived={viewingArchvied}
                  removed={contributionDocState?.removed}
                  onChange={handleViewArchived}
                />
              )}
              <ContributionCard
                pitchId={pid}
                id={cid}
                doc={contributionDocState}
                style={cardStyle}
                buttonContentStyle={buttonContentStyle}
                showBackButton
                hideFooterCover
                onClose={handleBack}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteContribution}
                onChangeScore={handleChangeScore}
              />
              <PostFooter
                pitchId={pid}
                contributionId={cid}
                doc={contributionDocState}
                kudoCount={contributionDocState?.kudos}
                mountList
                mode="kudo"
                onKudo={handleKudo}
              />
            </PostLayout>
            {editDialogOpen !== undefined && (
              <CreateContributionDialog
                open={editDialogOpen}
                pitchId={pid}
                pitchDoc={pitchDoc}
                doc={contributionDocState}
                editing
                onClose={handleCloseEditDialog}
                onUnsavedChange={handleUnsavedChange}
              />
            )}
          </StyledAbsoluteContent>
        </StyledPageContent>
      </StyledPage>
    );
  }
);

const ContributionPostPage = React.memo((props: ContributionPostPageProps) => {
  return (
    <>
      <PageHead title={`Impower Contribution`} />
      <ContributionPostPageContent {...props} />
    </>
  );
});

export default ContributionPostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const pitchedCollection = "pitched_games";
  const { pid, cid } = context.params;
  const pDocId = Array.isArray(pid) ? pid[0] : pid;
  const cDocId = Array.isArray(cid) ? cid[0] : cid;
  const adminApp = await initAdminApp();
  const pitchSnapshot = await adminApp
    .firestore()
    .doc(`${pitchedCollection}/${pDocId}`)
    .get();
  const pitchDoc = getSerializableDocument<ProjectDocument>(
    pitchSnapshot.data()
  );
  const contributionSnapshot = await adminApp
    .firestore()
    .doc(`${pitchedCollection}/${pDocId}/contributions/${cDocId}`)
    .get();
  const contributionDoc = getSerializableDocument<ContributionDocument>(
    contributionSnapshot.data()
  );
  const config = {
    ...getLocalizationConfigParameters(),
    ...getTagConfigParameters(),
  };
  let ogImage = contributionDoc?.file?.fileUrl;
  if (!ogImage) {
    ogImage = pitchDoc?.og;
    if (!ogImage) {
      const storage = adminApp.storage();
      const bucket = storage.bucket();
      const ogFilePath = `public/og/p/${pid}`;
      const ogFile = bucket.file(ogFilePath);
      ogImage = ogFile.publicUrl();
    }
  }

  // Regenerate the page:
  // - When a request comes in
  // - At most once every 60 seconds
  return {
    props: {
      pid: pDocId,
      cid: cDocId,
      pitchDoc,
      contributionDoc,
      config,
      revalidate: 60,
      ogImage,
    },
  };
};
