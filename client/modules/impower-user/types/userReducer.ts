import { SubmissionDocumentPath, SubmissionType } from "../../impower-api";
import { DataDocument } from "../../impower-core";
import { AggData, MemberAccess, MemberData } from "../../impower-data-state";
import {
  CustomizationDocument,
  getLocalCreateAnnotatedDocument,
  getLocalUpdateAnnotatedDocument,
  isCommentDocument,
  isContributionDocument,
  isGameDocument,
  isPageDocument,
  isProjectDocument,
  isResourceDocument,
  isStudioDocument,
  isUserDocument,
  ProjectDocument,
  SettingsDocument,
} from "../../impower-data-store";
import isReportDocument from "../../impower-data-store/utils/isReportDocument";
import { USER_CHANGE_MEMBER } from "./actions/userChangeMemberAction";
import { USER_CREATE_SUBMISSION } from "./actions/userCreateSubmissionAction";
import { USER_DELETE_SUBMISSION } from "./actions/userDeleteSubmissionAction";
import { USER_DO_ACTIVITY } from "./actions/userDoActivityAction";
import { USER_LOAD_CONNECTS } from "./actions/userLoadConnectsAction";
import { USER_LOAD_CUSTOMIZATIONS } from "./actions/userLoadCustomizationsAction";
import { USER_LOAD_FOLLOWS } from "./actions/userLoadFollowsAction";
import { USER_LOAD_MY_CONNECTS } from "./actions/userLoadMyConnectsAction";
import { USER_LOAD_MY_DISLIKES } from "./actions/userLoadMyDislikesAction";
import { USER_LOAD_MY_FOLLOWS } from "./actions/userLoadMyFollowsAction";
import { USER_LOAD_MY_KUDOS } from "./actions/userLoadMyKudosAction";
import { USER_LOAD_MY_LIKES } from "./actions/userLoadMyLikesAction";
import { USER_LOAD_MY_MEMBERSHIPS } from "./actions/userLoadMyMembershipsAction";
import { USER_LOAD_MY_SUBMISSIONS } from "./actions/userLoadMySubmissionsAction";
import { USER_LOAD_SETTINGS } from "./actions/userLoadSettingsAction";
import { USER_LOAD_STUDIOS } from "./actions/userLoadStudiosAction";
import { USER_LOAD_SUBMISSIONS } from "./actions/userLoadSubmissionsAction";
import { USER_LOAD_USER_DOC } from "./actions/userLoadUserDocAction";
import { USER_SET_CUSTOMIZATION } from "./actions/userSetCustomizationAction";
import { USER_SET_SETTING } from "./actions/userSetSettingAction";
import { USER_SET_TEMP_EMAIL } from "./actions/userSetTempEmailAction";
import { USER_SET_TEMP_USERNAME } from "./actions/userSetTempUsernameAction";
import { USER_UNDO_ACTIVITY } from "./actions/userUndoActivityAction";
import { USER_UPDATE_SUBMISSION } from "./actions/userUpdateSubmissionAction";
import { UserAction } from "./userActions";
import { UserState } from "./userState";

export const getSubmissionType = (
  path: SubmissionDocumentPath
): SubmissionType => {
  const colSegs = path.slice(0, -1);
  const type = colSegs[colSegs.length - 1] as SubmissionType;
  return type;
};

export const userReducer = (
  state: UserState,
  action: UserAction,
  errorHandler?: (error: string) => void
): UserState => {
  switch (action.type) {
    case USER_SET_TEMP_EMAIL: {
      const { tempEmail } = action.payload;
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        Auth.instance.tempEmail = tempEmail;
      };
      setData();
      return {
        ...state,
        tempEmail,
      };
    }
    case USER_SET_TEMP_USERNAME: {
      const { tempUsername } = action.payload;
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        Auth.instance.tempUsername = tempUsername;
      };
      setData();
      return {
        ...state,
        tempUsername,
      };
    }
    case USER_LOAD_STUDIOS: {
      const { studios } = action.payload;
      return {
        ...state,
        studios,
      };
    }
    case USER_LOAD_USER_DOC: {
      const { userDoc } = action.payload;
      return {
        ...state,
        userDoc,
      };
    }
    case USER_LOAD_SUBMISSIONS: {
      const { submissions } = action.payload;
      return {
        ...state,
        submissions,
      };
    }
    case USER_LOAD_CUSTOMIZATIONS: {
      const { customizations } = action.payload;
      return {
        ...state,
        customizations,
      };
    }
    case USER_LOAD_SETTINGS: {
      const { settings } = action.payload;
      return {
        ...state,
        settings,
      };
    }
    case USER_LOAD_FOLLOWS: {
      const { follows } = action.payload;
      return {
        ...state,
        follows,
      };
    }
    case USER_LOAD_CONNECTS: {
      const { connects } = action.payload;
      return {
        ...state,
        connects,
      };
    }
    case USER_LOAD_MY_MEMBERSHIPS: {
      const { my_memberships } = action.payload;
      if (my_memberships === null) {
        return {
          ...state,
          my_studio_memberships: null,
          my_resource_memberships: null,
          my_game_memberships: null,
        };
      }
      const my_studio_memberships: {
        [id: string]: MemberData;
      } = {};
      const my_resource_memberships: {
        [id: string]: MemberData;
      } = {};
      const my_game_memberships: {
        [id: string]: MemberData;
      } = {};
      Object.entries(my_memberships).forEach(([target, data]) => {
        const docId = target.split("%").slice(-1).join("");
        if (data.g === "studios") {
          my_studio_memberships[docId] = data;
        }
        if (data.g === "resources") {
          my_resource_memberships[docId] = data;
        }
        if (data.g === "games") {
          my_game_memberships[docId] = data;
        }
      });
      return {
        ...state,
        my_studio_memberships,
        my_resource_memberships,
        my_game_memberships,
      };
    }
    case USER_LOAD_MY_FOLLOWS: {
      const { my_follows } = action.payload;
      return {
        ...state,
        my_follows,
      };
    }
    case USER_LOAD_MY_CONNECTS: {
      const { my_connects } = action.payload;
      return {
        ...state,
        my_connects,
      };
    }
    case USER_LOAD_MY_LIKES: {
      const { my_likes } = action.payload;
      return {
        ...state,
        my_likes,
      };
    }
    case USER_LOAD_MY_DISLIKES: {
      const { my_dislikes } = action.payload;
      return {
        ...state,
        my_dislikes,
      };
    }
    case USER_LOAD_MY_KUDOS: {
      const { my_kudos } = action.payload;
      return {
        ...state,
        my_kudos,
      };
    }
    case USER_LOAD_MY_SUBMISSIONS: {
      const { my_submissions } = action.payload;
      return {
        ...state,
        my_submissions,
      };
    }
    case USER_DO_ACTIVITY: {
      const { path, type, c, onFinished } = action.payload;
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        const DataStateWrite = (
          await import("../../impower-data-state/classes/dataStateWrite")
        ).default;
        const timestampServerValue = (
          await import("../../impower-data-state/utils/timestampServerValue")
        ).default;
        const incrementServerValue = (
          await import("../../impower-data-state/utils/incrementServerValue")
        ).default;
        const { uid, author } = Auth.instance;
        const aggRef = new DataStateWrite(...path, "agg", type);
        const a = author;
        const data: AggData = {
          t: timestampServerValue() as number,
          a,
        };
        if (c) {
          data.c = c;
        }
        try {
          await aggRef.update({
            count: incrementServerValue(1),
            [`data/${uid}`]: data,
          });
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      const myActivitiesName = `my_${type}`;
      let myActivities = state?.[myActivitiesName] || {};
      myActivities = { ...myActivities };
      const collectionPath = path.slice(0, -1).join("/");
      const g = collectionPath.split("/").slice(-1).join("");
      const target = path.join("%");
      const t = Date.now();
      myActivities[target] = {
        g,
        t,
        c,
      };
      const parentColId = path[0];
      const parentDocId = path[1];
      const targetColId = path[2];
      let my_recent_pitched_projects = state?.my_recent_pitched_projects;
      if (
        (parentColId === "pitched_games" ||
          parentColId === "pitched_resources") &&
        type === "kudos" &&
        !targetColId &&
        state?.my_recent_pitched_projects[parentDocId]
      ) {
        my_recent_pitched_projects = {
          ...(my_recent_pitched_projects || {}),
          [parentDocId]: {
            ...(my_recent_pitched_projects?.[parentDocId] || {}),
            kudos: (my_recent_pitched_projects?.[parentDocId]?.kudos || 0) + 1,
          } as ProjectDocument,
        };
      }
      return {
        ...state,
        [myActivitiesName]: myActivities,
        my_recent_pitched_projects,
      };
    }
    case USER_UNDO_ACTIVITY: {
      const { path, type, onFinished } = action.payload;
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        const DataStateWrite = (
          await import("../../impower-data-state/classes/dataStateWrite")
        ).default;
        const incrementServerValue = (
          await import("../../impower-data-state/utils/incrementServerValue")
        ).default;
        const { uid } = Auth.instance;
        const aggRef = new DataStateWrite(...path, "agg", type);
        try {
          await aggRef.update({
            count: incrementServerValue(-1),
            [`data/${uid}`]: null,
          });
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      const myActivitiesName = `my_${type}`;
      let myActivities = state?.[myActivitiesName] || {};
      myActivities = { ...myActivities };
      const target = path.join("%");
      if (myActivities[target]) {
        delete myActivities[target];
      }
      const parentColId = path[0];
      const parentDocId = path[1];
      const targetColId = path[2];
      let my_recent_pitched_projects = state?.my_recent_pitched_projects;
      if (
        (parentColId === "pitched_games" ||
          parentColId === "pitched_resources") &&
        type === "kudos" &&
        !targetColId &&
        state?.my_recent_pitched_projects[parentDocId]
      ) {
        my_recent_pitched_projects = {
          ...(my_recent_pitched_projects || {}),
          [parentDocId]: {
            ...(my_recent_pitched_projects?.[parentDocId] || {}),
            kudos: (my_recent_pitched_projects?.[parentDocId]?.kudos || 0) - 1,
          } as ProjectDocument,
        };
      }
      return {
        ...state,
        [myActivitiesName]: myActivities,
        my_recent_pitched_projects,
      };
    }
    case USER_CHANGE_MEMBER: {
      const { path, data, onFinished } = action.payload;
      const setData = async (): Promise<void> => {
        const DataStateWrite = (
          await import("../../impower-data-state/classes/dataStateWrite")
        ).default;
        try {
          const memberRef = new DataStateWrite(...path);
          await memberRef.update(data);
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      let my_studio_memberships = state?.my_studio_memberships || {};
      let my_resource_memberships = state?.my_resource_memberships || {};
      let my_game_memberships = state?.my_game_memberships || {};
      const id = path[path.length - 1];
      const parentDocId = path[path.length - 4];
      if (id === state?.uid) {
        if (data.g === "studios") {
          my_studio_memberships = { ...my_studio_memberships };
          my_studio_memberships[parentDocId] = data;
        }
        if (data.g === "resources") {
          my_resource_memberships = { ...my_resource_memberships };
          my_resource_memberships[parentDocId] = data;
        }
        if (data.g === "games") {
          my_game_memberships = { ...my_game_memberships };
          my_game_memberships[parentDocId] = data;
        }
      }
      return {
        ...state,
        my_studio_memberships,
        my_resource_memberships,
        my_game_memberships,
      };
    }
    case USER_CREATE_SUBMISSION: {
      const { path, doc, onFinished } = action.payload;
      const submissionType = getSubmissionType(path);
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        const DataStoreBatch = (
          await import("../../impower-data-store/classes/dataStoreBatch")
        ).default;
        const DataStoreWrite = (
          await import("../../impower-data-store/classes/dataStoreWrite")
        ).default;
        const { uid } = Auth.instance;
        const batch = await new DataStoreBatch().start();
        await new DataStoreWrite(...path).create(doc, batch);
        const existingSubmissionDoc = state?.submissions?.[submissionType];
        if (existingSubmissionDoc) {
          await new DataStoreWrite(
            "users",
            uid,
            "submissions",
            submissionType
          ).update({ path: path.join("/") }, batch);
        } else {
          await new DataStoreWrite(
            "users",
            uid,
            "submissions",
            submissionType
          ).create(
            {
              _documentType: "PathDocument",
              path: path.join("/"),
            },
            batch
          );
        }
        try {
          await batch.commit();
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      const newDoc = getLocalCreateAnnotatedDocument(doc);
      let studios = state?.studios;
      let my_likes = state?.my_likes;
      let my_studio_memberships = state?.my_studio_memberships;
      let my_resource_memberships = state?.my_resource_memberships;
      let my_game_memberships = state?.my_game_memberships;
      let my_submissions = state?.my_submissions;
      let my_recent_pages = state?.my_recent_pages;
      let my_recent_published_pages = state?.my_recent_published_pages;
      let my_recent_pitched_projects = state?.my_recent_pitched_projects;
      let my_recent_comments = state?.my_recent_comments;
      let my_recent_contributions = state?.my_recent_contributions;
      let my_recent_reports = state?.my_recent_reports;
      const key = path.join("%");
      const id = path[path.length - 1];
      const parentDocId = path[path.length - 3];
      my_submissions = {
        ...(my_submissions || {}),
        [key]: { t: Date.now(), g: submissionType },
      };
      if (isPageDocument(newDoc)) {
        if (isProjectDocument(newDoc) && newDoc.pitchedAt) {
          newDoc.pitchedAt =
            typeof newDoc.pitchedAt === "string"
              ? newDoc.pitchedAt
              : newDoc.pitchedAt.toDate().toJSON();
          if (newDoc.likes === 1) {
            my_likes = {
              ...(my_likes || {}),
              [`pitched_${key}`]: {
                g: submissionType,
                t: Date.now(),
              },
            };
          }
          my_recent_pitched_projects = {
            [id]: newDoc,
            ...(my_recent_pitched_projects || {}),
            [id]: newDoc,
          };
        }
        if (newDoc.publishedAt) {
          newDoc.pitchedAt =
            typeof newDoc.publishedAt === "string"
              ? newDoc.publishedAt
              : newDoc.publishedAt.toDate().toJSON();
          if (newDoc.likes === 1) {
            my_likes = {
              ...(my_likes || {}),
              [`published_${key}`]: {
                g: submissionType,
                t: Date.now(),
              },
            };
          }
          my_recent_published_pages = {
            ...(my_recent_published_pages || {}),
            [id]: newDoc,
          };
        }
        my_recent_pages = { ...(my_recent_pages || {}), [id]: newDoc };
      }
      if (isCommentDocument(newDoc)) {
        if (newDoc.likes === 1) {
          my_likes = {
            ...(my_likes || {}),
            [key]: {
              g: submissionType,
              t: Date.now(),
            },
          };
        }
        my_recent_comments = {
          ...(my_recent_comments || {}),
          [parentDocId]: {
            ...(my_recent_comments?.[parentDocId] || {}),
            [id]: newDoc,
          },
        };
      }
      if (isContributionDocument(newDoc)) {
        if (newDoc.likes === 1) {
          my_likes = {
            ...(my_likes || {}),
            [key]: {
              g: submissionType,
              t: Date.now(),
            },
          };
        }
        if (my_recent_pitched_projects?.[parentDocId]) {
          my_recent_pitched_projects = {
            ...(my_recent_pitched_projects || {}),
            [parentDocId]: {
              ...(my_recent_pitched_projects?.[parentDocId] || {}),
              contributions:
                (my_recent_pitched_projects?.[parentDocId]?.contributions ||
                  0) + 1,
            } as ProjectDocument,
          };
        }
        my_recent_contributions = {
          ...(my_recent_contributions || {}),
          [parentDocId]: {
            ...(my_recent_contributions?.[parentDocId] || {}),
            [id]: newDoc,
          },
        };
      }
      if (isReportDocument(newDoc)) {
        my_recent_reports = {
          ...(my_recent_reports || {}),
          [key]: newDoc,
        };
      }
      if (submissionType === "studios" && isStudioDocument(newDoc)) {
        studios = { ...(studios || {}), [id]: newDoc };
        my_studio_memberships = {
          ...(my_studio_memberships || {}),
          [id]: {
            access: MemberAccess.Owner,
            role: "",
            accessedAt: Date.now(),
            t: Date.now(),
            g: "studios",
          },
        };
      }
      if (submissionType === "resources" && isResourceDocument(newDoc)) {
        my_resource_memberships = {
          ...(my_resource_memberships || {}),
          [id]: {
            access: MemberAccess.Owner,
            role: "",
            accessedAt: Date.now(),
            t: Date.now(),
            g: "resources",
          },
        };
      }
      if (submissionType === "games" && isProjectDocument(newDoc)) {
        my_game_memberships = {
          ...(my_game_memberships || {}),
          [id]: {
            access: MemberAccess.Owner,
            role: "",
            accessedAt: Date.now(),
            t: Date.now(),
            g: "games",
          },
        };
      }
      const existingSubmissionDoc = state?.submissions?.[submissionType];
      const newSubmissionDoc = existingSubmissionDoc
        ? getLocalUpdateAnnotatedDocument(existingSubmissionDoc)
        : getLocalCreateAnnotatedDocument(existingSubmissionDoc);
      return {
        ...state,
        studios,
        my_likes,
        my_studio_memberships,
        my_resource_memberships,
        my_game_memberships,
        my_submissions,
        my_recent_pages,
        my_recent_published_pages,
        my_recent_pitched_projects,
        my_recent_comments,
        my_recent_contributions,
        my_recent_reports,
        submissions: {
          ...state.submissions,
          [submissionType]: newSubmissionDoc,
        },
      };
    }
    case USER_UPDATE_SUBMISSION: {
      const { path, doc, onFinished } = action.payload;
      const submissionType = getSubmissionType(path);
      const setData = async (): Promise<void> => {
        const DataStoreWrite = (
          await import("../../impower-data-store/classes/dataStoreWrite")
        ).default;
        try {
          await new DataStoreWrite(...path).update(doc);
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      const newDoc = getLocalUpdateAnnotatedDocument(doc);
      const userDoc = isUserDocument(doc) ? doc : state?.userDoc;
      let studios = state?.studios;
      let my_studio_memberships = state?.my_studio_memberships;
      let my_resource_memberships = state?.my_resource_memberships;
      let my_game_memberships = state?.my_game_memberships;
      let my_recent_pages = state?.my_recent_pages;
      let my_recent_published_pages = state?.my_recent_published_pages;
      let my_recent_pitched_projects = state?.my_recent_pitched_projects;
      let my_recent_comments = state?.my_recent_comments;
      let my_recent_contributions = state?.my_recent_contributions;
      const id = path[path.length - 1];
      const parentDocId = path[path.length - 3];
      if (isPageDocument(newDoc)) {
        if (isProjectDocument(newDoc) && newDoc.pitchedAt) {
          newDoc.pitchedAt =
            typeof newDoc.pitchedAt === "string"
              ? newDoc.pitchedAt
              : newDoc.pitchedAt.toDate().toJSON();
          if (newDoc.delisted) {
            const newDelistedProject = {
              ...newDoc,
              name: "[deleted]",
              summary: "[deleted]",
              _author: {
                u: "[deleted]",
                i: null,
                h: "#FFFFFF",
              },
            };
            my_recent_pitched_projects = {
              [id]: newDelistedProject,
              ...(my_recent_pitched_projects || {}),
              [id]: newDelistedProject,
            };
          } else {
            my_recent_pitched_projects = {
              [id]: newDoc,
              ...(my_recent_pitched_projects || {}),
              [id]: newDoc,
            };
          }
        }
        if (newDoc.published && newDoc.publishedAt) {
          newDoc.publishedAt =
            typeof newDoc.publishedAt === "string"
              ? newDoc.publishedAt
              : newDoc.publishedAt.toDate().toJSON();
          if (newDoc.delisted) {
            my_recent_published_pages = {
              ...(my_recent_published_pages || {}),
              [id]: {
                ...newDoc,
                name: "[deleted]",
                summary: "[deleted]",
                description: "[deleted]",
                statusInformation: "[deleted]",
                icon: { storageKey: "", fileUrl: "" },
                cover: { storageKey: "", fileUrl: "" },
                logo: { storageKey: "", fileUrl: "" },
                _author: {
                  u: "[deleted]",
                  i: null,
                  h: "#FFFFFF",
                },
              },
            };
          } else {
            my_recent_published_pages = {
              ...(my_recent_published_pages || {}),
              [id]: newDoc,
            };
          }
        }
        my_recent_pages = { ...(my_recent_pages || {}), [id]: newDoc };
      }
      if (isStudioDocument(newDoc)) {
        if (newDoc?.owners) {
          if (!newDoc?.owners?.includes(state?.uid)) {
            my_studio_memberships = {
              ...(my_studio_memberships || {}),
              [id]: {
                access: MemberAccess.Owner,
                role: "",
                accessedAt: Date.now(),
                t: Date.now(),
                g: "studios",
              },
            };
          } else {
            my_studio_memberships = {
              ...(my_studio_memberships || {}),
              [id]: null,
            };
          }
        }
      }
      if (isResourceDocument(newDoc)) {
        if (newDoc?.owners) {
          if (!newDoc?.owners?.includes(state?.uid)) {
            my_resource_memberships = {
              ...(my_resource_memberships || {}),
              [id]: {
                access: MemberAccess.Owner,
                role: "",
                accessedAt: Date.now(),
                t: Date.now(),
                g: "resources",
              },
            };
          } else {
            my_resource_memberships = {
              ...(my_resource_memberships || {}),
              [id]: null,
            };
          }
        }
      }
      if (isGameDocument(newDoc)) {
        if (newDoc?.owners) {
          if (!newDoc?.owners?.includes(state?.uid)) {
            my_game_memberships = {
              ...(my_game_memberships || {}),
              [id]: {
                access: MemberAccess.Owner,
                role: "",
                accessedAt: Date.now(),
                t: Date.now(),
                g: "games",
              },
            };
          } else {
            my_game_memberships = {
              ...(my_game_memberships || {}),
              [id]: null,
            };
          }
        }
      }
      if (isCommentDocument(newDoc)) {
        if (newDoc.delisted) {
          my_recent_comments = {
            ...(my_recent_comments || {}),
            [parentDocId]: {
              ...(my_recent_comments?.[parentDocId] || {}),
              [id]: {
                ...(my_recent_comments?.[parentDocId]?.[id] || {}),
                ...newDoc,
                content: "[deleted]",
                _author: {
                  u: "[deleted]",
                  i: null,
                  h: "#FFFFFF",
                },
              },
            },
          };
        } else {
          my_recent_comments = {
            ...(my_recent_comments || {}),
            [parentDocId]: {
              ...(my_recent_comments?.[parentDocId] || {}),
              [id]: newDoc,
            },
          };
        }
      }
      if (isContributionDocument(newDoc)) {
        if (newDoc.delisted) {
          if (my_recent_pitched_projects?.[parentDocId]) {
            my_recent_pitched_projects = {
              ...(my_recent_pitched_projects || {}),
              [parentDocId]: {
                ...(my_recent_pitched_projects?.[parentDocId] || {}),
                contributions:
                  (my_recent_pitched_projects?.[parentDocId]?.contributions ||
                    0) - 1,
              } as ProjectDocument,
            };
          }
          my_recent_contributions = {
            ...(my_recent_contributions || {}),
            [parentDocId]: {
              ...(my_recent_contributions?.[parentDocId] || {}),
              [id]: {
                ...(my_recent_contributions?.[parentDocId]?.[id] || {}),
                ...newDoc,
                content: "[deleted]",
                file: { storageKey: "", fileUrl: "" },
                _author: {
                  u: "[deleted]",
                  i: null,
                  h: "#FFFFFF",
                },
              },
            },
          };
        } else {
          my_recent_contributions = {
            ...(my_recent_contributions || {}),
            [parentDocId]: {
              ...(my_recent_contributions?.[parentDocId] || {}),
              [id]: newDoc,
            },
          };
        }
      }
      if (isUserDocument(newDoc)) {
        // Update author details across all session submissions
        my_recent_pages = { ...(my_recent_pages || {}) };
        Object.entries(my_recent_pages).forEach(([id, doc]) => {
          my_recent_pages[id] = {
            ...doc,
            _author: {
              ...doc._author,
              u: newDoc.username,
              i: newDoc.icon?.fileUrl,
              h: newDoc.hex,
            },
          };
        });
        my_recent_published_pages = { ...(my_recent_published_pages || {}) };
        Object.entries(my_recent_published_pages).forEach(([id, doc]) => {
          my_recent_published_pages[id] = {
            ...doc,
            _author: {
              ...doc._author,
              u: newDoc.username,
              i: newDoc.icon?.fileUrl,
              h: newDoc.hex,
            },
          };
        });
        my_recent_pitched_projects = { ...(my_recent_pitched_projects || {}) };
        Object.entries(my_recent_pitched_projects).forEach(([id, doc]) => {
          my_recent_pitched_projects[id] = {
            ...doc,
            _author: {
              ...doc._author,
              u: newDoc.username,
              i: newDoc.icon?.fileUrl,
              h: newDoc.hex,
            },
          };
        });
        my_recent_comments = { ...(my_recent_comments || {}) };
        Object.entries(my_recent_comments).forEach(([parentId, children]) => {
          Object.entries(children).forEach(([id, doc]) => {
            my_recent_comments[parentId] = {
              ...(my_recent_comments?.[parentId] || {}),
              [id]: {
                ...doc,
                _author: {
                  ...doc._author,
                  u: newDoc.username,
                  i: newDoc.icon?.fileUrl,
                  h: newDoc.hex,
                },
              },
            };
          });
        });
        my_recent_contributions = { ...(my_recent_contributions || {}) };
        Object.entries(my_recent_contributions).forEach(
          ([parentId, children]) => {
            Object.entries(children).forEach(([id, doc]) => {
              my_recent_contributions[parentId] = {
                ...(my_recent_contributions?.[parentId] || {}),
                [id]: {
                  ...doc,
                  _author: {
                    ...doc._author,
                    u: newDoc.username,
                    i: newDoc.icon?.fileUrl,
                    h: newDoc.hex,
                  },
                },
              };
            });
          }
        );
      }
      if (submissionType === "studios" && isStudioDocument(newDoc)) {
        studios = { ...(studios || {}), [id]: newDoc };
      }
      const existingSubmissionDoc = state?.submissions?.[submissionType];
      const newSubmissionDoc = existingSubmissionDoc
        ? getLocalUpdateAnnotatedDocument(existingSubmissionDoc)
        : getLocalCreateAnnotatedDocument(existingSubmissionDoc);
      return {
        ...state,
        studios,
        userDoc,
        my_studio_memberships,
        my_resource_memberships,
        my_game_memberships,
        my_recent_pages,
        my_recent_published_pages,
        my_recent_pitched_projects,
        my_recent_comments,
        my_recent_contributions,
        submissions: {
          ...state.submissions,
          [submissionType]: newSubmissionDoc,
        },
      };
    }
    case USER_DELETE_SUBMISSION: {
      const { path, onFinished } = action.payload;
      const submissionType = getSubmissionType(path);
      const setData = async (): Promise<void> => {
        const DataStoreWrite = (
          await import("../../impower-data-store/classes/dataStoreWrite")
        ).default;
        try {
          await new DataStoreWrite(...path).delete();
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      let studios = state?.studios;
      let my_studio_memberships = state?.my_studio_memberships;
      let my_resource_memberships = state?.my_resource_memberships;
      let my_game_memberships = state?.my_game_memberships;
      let my_recent_pages = state?.my_recent_pages;
      let my_recent_published_pages = state?.my_recent_published_pages;
      let my_recent_pitched_projects = state?.my_recent_pitched_projects;
      let my_recent_comments = state?.my_recent_comments;
      let my_recent_contributions = state?.my_recent_contributions;
      let my_recent_reports = state?.my_recent_reports;
      const key = path.join("%");
      const id = path[path.length - 1];
      const parentDocId = path[path.length - 3];
      if (my_recent_pitched_projects[id]) {
        my_recent_pitched_projects = {
          ...my_recent_pitched_projects,
          [id]: null,
        };
      }
      if (my_recent_published_pages[id]) {
        my_recent_published_pages = {
          ...my_recent_published_pages,
          [id]: null,
        };
      }
      if (my_recent_pages[id]) {
        my_recent_pages = { ...my_recent_pages, [id]: null };
      }
      if (my_recent_comments[parentDocId]) {
        my_recent_comments = { ...my_recent_comments };
        my_recent_comments[parentDocId][id] = null;
      }
      if (my_recent_contributions[parentDocId]) {
        my_recent_contributions = { ...my_recent_contributions };
        my_recent_contributions[parentDocId][id] = null;
      }
      if (my_recent_reports[parentDocId]) {
        my_recent_reports = { ...my_recent_reports };
        my_recent_reports[key] = null;
      }
      if (submissionType === "studios") {
        studios = { ...(studios || {}), [id]: null };
        my_studio_memberships = {
          ...(my_studio_memberships || {}),
          [id]: null,
        };
      }
      if (submissionType === "resources") {
        my_resource_memberships = {
          ...(my_resource_memberships || {}),
          [id]: null,
        };
      }
      if (submissionType === "games") {
        my_game_memberships = {
          ...(my_game_memberships || {}),
          [id]: null,
        };
      }
      if (my_studio_memberships[id]) {
        my_studio_memberships = {
          ...(my_studio_memberships || {}),
          [id]: null,
        };
      }
      if (my_resource_memberships[id]) {
        my_resource_memberships = {
          ...(my_studio_memberships || {}),
          [id]: null,
        };
      }
      if (my_game_memberships[id]) {
        my_game_memberships = {
          ...(my_studio_memberships || {}),
          [id]: null,
        };
      }
      const existingSubmissionDoc = state?.submissions?.[submissionType];
      const newSubmissionDoc =
        existingSubmissionDoc?.path === path
          ? ({
              _author: existingSubmissionDoc._author,
              _createdBy: existingSubmissionDoc._createdBy,
              _updatedBy: existingSubmissionDoc._updatedBy,
              _createdAt: existingSubmissionDoc._createdAt,
              _updatedAt: existingSubmissionDoc._updatedAt,
              _updates: existingSubmissionDoc._updates,
            } as DataDocument)
          : existingSubmissionDoc;
      return {
        ...state,
        studios,
        my_studio_memberships,
        my_resource_memberships,
        my_game_memberships,
        my_recent_pages,
        my_recent_published_pages,
        my_recent_pitched_projects,
        my_recent_comments,
        my_recent_contributions,
        submissions: {
          ...state.submissions,
          [submissionType]: newSubmissionDoc,
        },
      };
    }
    case USER_SET_CUSTOMIZATION: {
      const { customizationType, phraseTags, onFinished } = action.payload;
      const existingCustomization = state?.customizations?.[customizationType];
      const newCustomizationDoc = existingCustomization
        ? getLocalUpdateAnnotatedDocument<CustomizationDocument>({
            _documentType: "CustomizationDocument",
            phraseTags,
          })
        : getLocalCreateAnnotatedDocument<CustomizationDocument>({
            _documentType: "CustomizationDocument",
            phraseTags,
          });
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        const DataStoreWrite = (
          await import("../../impower-data-store/classes/dataStoreWrite")
        ).default;
        try {
          const { uid } = Auth.instance;
          if (existingCustomization) {
            await new DataStoreWrite(
              "users",
              uid,
              "customizations",
              customizationType
            ).update(newCustomizationDoc);
          } else {
            await new DataStoreWrite(
              "users",
              uid,
              "customizations",
              customizationType
            ).create(newCustomizationDoc);
          }
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      return {
        ...state,
        customizations: {
          ...state.customizations,
          [customizationType]: newCustomizationDoc,
        },
      };
    }
    case USER_SET_SETTING: {
      const { settingsType, doc, onFinished } = action.payload;
      const existingSettings = state?.settings?.[settingsType];
      const newSettingsDoc = existingSettings
        ? getLocalUpdateAnnotatedDocument({
            _documentType: "SettingsDocument",
            ...doc,
          } as SettingsDocument)
        : getLocalCreateAnnotatedDocument({
            _documentType: "SettingsDocument",
            ...doc,
          } as SettingsDocument);
      const setData = async (): Promise<void> => {
        const Auth = (await import("../../impower-auth/classes/auth")).default;
        const DataStoreWrite = (
          await import("../../impower-data-store/classes/dataStoreWrite")
        ).default;
        try {
          const { uid } = Auth.instance;
          if (existingSettings) {
            await new DataStoreWrite(
              "users",
              uid,
              "settings",
              settingsType
            ).update(newSettingsDoc);
          } else {
            await new DataStoreWrite(
              "users",
              uid,
              "settings",
              settingsType
            ).create(newSettingsDoc);
          }
        } catch (e) {
          const logWarn = (await import("../../impower-logger/utils/logWarn"))
            .default;
          logWarn("DataState", e);
          errorHandler?.(e.code);
        }
        if (onFinished) {
          onFinished();
        }
      };
      setData();
      return {
        ...state,
        settings: {
          ...state.settings,
          [settingsType]: newSettingsDoc,
        },
      };
    }
    default:
      throw new Error(`Action not recognized: ${action}`);
  }
};
