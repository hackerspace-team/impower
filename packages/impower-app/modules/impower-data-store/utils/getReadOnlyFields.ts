const getReadOnlyFields = (): string[] => {
  return [
    "_aggregatedAt",
    "_serverUpdatedAt",
    "comments",
    "connects",
    "contributions",
    "daysWhenWeekOld",
    "delisted",
    "dislikes",
    "fileClassifications",
    "flagged",
    "follows",
    "hoursWhenDayOld",
    "kudos",
    "likes",
    "monthsWhenYearOld",
    "my_connects",
    "my_dislikes",
    "my_follows",
    "my_kudos",
    "my_likes",
    "my_submissions",
    "notes",
    "nsfw",
    "nsfwData",
    "nsfwWords",
    "og",
    "rank",
    "rating",
    "removed",
    "reports",
    "score",
    "terms",
    "total_dislikes",
    "total_kudos",
    "total_likes",
    "total_reports",
    "violation",
    "weeksWhenMonthOld",
    "changedMembers",
    "studioInfo",
  ];
};

export default getReadOnlyFields;