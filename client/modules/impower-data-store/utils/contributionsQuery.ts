import { PitchedProjectDocumentPath } from "../../impower-api";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const contributionsQuery = async (
  options: {
    sort: "rating" | "new";
    nsfw?: boolean;
  },
  ...path: PitchedProjectDocumentPath
) => {
  const { sort, nsfw } = options;

  const DataStoreQuery = await (
    await import("../classes/dataStoreQuery")
  ).default;
  let query = new DataStoreQuery(...path, "contributions");

  query = query.where("delisted", "==", false);

  if (!nsfw) {
    query = query.where("nsfw", "==", false);
  }

  if (sort === "new") {
    query = query.orderBy("_createdAt", "desc");
  }

  if (sort === "rating") {
    query = query.orderBy("rating", "desc");
  }

  return query;
};

export default contributionsQuery;
