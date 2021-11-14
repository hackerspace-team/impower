const getReadOnlyFields = (): string[] => {
  return [
    "score",
    "rating",
    "rank",
    "likes",
    "dislikes",
    "kudos",
    "contributions",
    "comments",
    "notes",
    "removed",
    "daysWhenWeekOld",
    "hoursWhenDayOld",
    "monthsWhenYearOld",
    "weeksWhenMonthOld",
    "nsfw",
    "terms",
    "flagged",
    "og",
    "delisted",
    "_serverUpdatedAt",
    "_aggregatedAt",
    "connects",
    "follows",
    "reports",
    "my_connects",
    "my_follows",
    "my_likes",
    "my_dislikes",
    "my_kudos",
    "my_submissions",
    "total_likes",
    "total_dislikes",
    "total_kudos",
    "total_reports",
  ];
};

export default getReadOnlyFields;
