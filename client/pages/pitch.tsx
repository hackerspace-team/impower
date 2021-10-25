import { useTheme } from "@emotion/react";
import { GetStaticProps } from "next";
import React, { useContext, useEffect } from "react";
import getIconSvgData from "../lib/getIconSvgData";
import getLocalizationConfigParameters from "../lib/getLocalizationConfigParameters";
import getTagConfigParameters from "../lib/getTagConfigParameters";
import { initAdminApp } from "../lib/initAdminApp";
import { ConfigParameters } from "../modules/impower-config";
import ConfigCache from "../modules/impower-config/classes/configCache";
import {
  getSerializableDocument,
  ProjectDocument,
} from "../modules/impower-data-store";
import DataStoreCache from "../modules/impower-data-store/classes/dataStoreCache";
import {
  IconLibraryContext,
  iconLibraryRegister,
  SvgData,
} from "../modules/impower-icon";
import {
  NavigationContext,
  navigationSetBackgroundColor,
  navigationSetElevation,
  navigationSetLinks,
  navigationSetSearchbar,
  navigationSetText,
  navigationSetType,
} from "../modules/impower-navigation";
import { PageHead } from "../modules/impower-route";
import Pitch from "../modules/impower-route-pitch/components/Pitch";
import useBodyBackgroundColor from "../modules/impower-route/hooks/useBodyBackgroundColor";
import useHTMLBackgroundColor from "../modules/impower-route/hooks/useHTMLBackgroundColor";

const LOAD_INITIAL_LIMIT = 5;

interface PitchPageProps {
  config: ConfigParameters;
  icons: { [name: string]: SvgData };
  pitchDocs: { [id: string]: ProjectDocument };
}

const PitchPageContent = React.memo((props: PitchPageProps) => {
  const { config, pitchDocs, icons } = props;

  const [, navigationDispatch] = useContext(NavigationContext);
  const [, iconLibraryDispatch] = useContext(IconLibraryContext);

  ConfigCache.instance.set(config);
  iconLibraryDispatch(iconLibraryRegister("solid", icons));

  const theme = useTheme();

  useBodyBackgroundColor(theme.colors.lightForeground);
  useHTMLBackgroundColor(theme.colors.lightForeground);

  useEffect(() => {
    DataStoreCache.instance.clear();
  }, []);

  useEffect(() => {
    navigationDispatch(navigationSetType("page"));
    navigationDispatch(navigationSetText(undefined, "Pitch"));
    navigationDispatch(navigationSetLinks());
    navigationDispatch(
      navigationSetSearchbar({
        label: "Search Pitches",
        placeholder: "Try searching for mechanics, genres, or subjects",
        value: "",
      })
    );
    navigationDispatch(navigationSetElevation(0));
    navigationDispatch(navigationSetBackgroundColor());
  }, [navigationDispatch]);

  return <Pitch config={config} icons={icons} pitchDocs={pitchDocs} />;
});

const PitchPage = React.memo((props: PitchPageProps) => {
  return (
    <>
      <PageHead title={`Impower Pitches`} />
      <PitchPageContent {...props} />
    </>
  );
});

export default PitchPage;

export const getStaticProps: GetStaticProps<PitchPageProps> = async () => {
  const config = {
    ...getLocalizationConfigParameters(),
    ...getTagConfigParameters(),
  };
  const pitchedCollection = "pitched_games";
  const adminApp = await initAdminApp();
  const pitchesSnapshot = await adminApp
    .firestore()
    .collection(`${pitchedCollection}`)
    .where("nsfw", "==", false)
    .where("delisted", "==", false)
    .orderBy("rank", "desc")
    .limit(LOAD_INITIAL_LIMIT)
    .get();
  const pitchDocs: { [id: string]: ProjectDocument } = {};
  const iconNamesSet = new Set<string>();
  pitchesSnapshot.docs.forEach((s) => {
    const serializableData = getSerializableDocument<ProjectDocument>(s.data());
    pitchDocs[s.id] = serializableData;
    const mainTag = serializableData?.tags?.[0] || "";
    const tagIconName = config.tagIconNames[mainTag];
    if (tagIconName) {
      iconNamesSet.add(tagIconName);
    }
  });
  const iconNames = Array.from(iconNamesSet);
  const iconData = await Promise.all(
    iconNames.map(async (name) => {
      if (name) {
        const component = (await import(`../resources/icons/solid/${name}.svg`))
          .default;
        return getIconSvgData(component);
      }
      return null;
    })
  );
  const icons = {};
  iconData.forEach((data, index) => {
    if (data) {
      icons[iconNames[index]] = data;
    }
  });
  return {
    props: {
      pitchDocs,
      config,
      icons,
    },
    // Regenerate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    revalidate: 60,
  };
};
