export interface OsuUser {
  id?: string;
  discord?: string;
  osu?: Osu;
}

export interface Osu {
  avatarURL?: string;
  countryCode?: string;
  defaultGroup?: string;
  id?: number;
  isActive?: boolean;
  isBot?: boolean;
  isDeleted?: boolean;
  isOnline?: boolean;
  isSupporter?: boolean;
  lastVisit?: Date;
  pmFriendsOnly?: boolean;
  profileColour?: string;
  username?: string;
  coverURL?: string;
  discord?: string;
  hasSupported?: boolean;
  interests?: null;
  joinDate?: Date;
  kudosu?: Kudosu;
  location?: null;
  maxBlocks?: number;
  maxFriends?: number;
  occupation?: null;
  playmode?: string;
  playstyle?: string[];
  postCount?: number;
  profileOrder?: string[];
  title?: null;
  twitter?: string;
  website?: string;
  country?: Country;
  cover?: Cover;
  isRestricted?: boolean;
  accountHistory?: any[];
  activeTournamentBanner?: null;
  badges?: Badge[];
  favouriteBeatmapsetCount?: number;
  followerCount?: number;
  graveyardBeatmapsetCount?: number;
  groups?: Group[];
  lovedBeatmapsetCount?: number;
  monthlyPlaycounts?: Count[];
  page?: Page;
  pendingBeatmapsetCount?: number;
  previousUsernames?: any[];
  rankedBeatmapsetCount?: number;
  replaysWatchedCounts?: Count[];
  scoresFirstCount?: number;
  statistics?: Statistics;
  supportLevel?: number;
  userAchievements?: UserAchievement[];
  rankHistory?: RankHistory;
}

export interface Badge {
  awardedAt?: Date;
  description?: string;
  imageURL?: string;
  url?: string;
}

export interface Country {
  code?: string;
  name?: string;
}

export interface Cover {
  customURL?: string;
  url?: string;
  id?: null;
}

export interface Group {
  id?: number;
  identifier?: string;
  name?: string;
  shortName?: string;
  description?: string;
  colour?: string;
}

export interface Kudosu {
  total?: number;
  available?: number;
}

export interface Count {
  startDate?: Date;
  count?: number;
}

export interface Page {
  html?: string;
  raw?: string;
}

export interface RankHistory {
  mode?: string;
  data?: number[];
}

export interface Statistics {
  level?: Level;
  pp?: number;
  globalRank?: number;
  rankedScore?: number;
  hitAccuracy?: number;
  playCount?: number;
  playTime?: number;
  totalScore?: number;
  totalHits?: number;
  maximumCombo?: number;
  replaysWatchedByOthers?: number;
  isRanked?: boolean;
  gradeCounts?: GradeCounts;
  rank?: Rank;
}

export interface GradeCounts {
  ss?: number;
  ssh?: number;
  s?: number;
  sh?: number;
  a?: number;
}

export interface Level {
  current?: number;
  progress?: number;
}

export interface Rank {
  global?: number;
  country?: number;
}

export interface UserAchievement {
  achievedAt?: Date;
  achievementID?: number;
}
