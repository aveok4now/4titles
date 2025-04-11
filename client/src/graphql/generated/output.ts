import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AssignPermissionToRoleInput = {
  permissionId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
};

export type AssignRoleInput = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type AuthModel = {
  __typename?: 'AuthModel';
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
};

export type ChangeNotificationSettingsInput = {
  isSiteNotificationsEnabled: Scalars['Boolean']['input'];
  isTelegramNotificationsEnabled: Scalars['Boolean']['input'];
};

export type ChangeNotificationSettingsResponse = {
  __typename?: 'ChangeNotificationSettingsResponse';
  notificationSettings: NotificationSettings;
  telegramAuthToken?: Maybe<Scalars['String']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangeProfileInfoInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  location?: Maybe<TitleFilmingLocation>;
  locationId?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Comment>;
  parentId?: Maybe<Scalars['String']['output']>;
  replies: Array<Comment>;
  title: Title;
  titleId?: Maybe<Scalars['String']['output']>;
  type: CommentableType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['String']['output'];
};

export enum CommentableType {
  Location = 'LOCATION',
  Title = 'TITLE'
}

export type Country = {
  __typename?: 'Country';
  englishName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  titles?: Maybe<Array<TitleCountry>>;
};

export enum CountryRelation {
  Origin = 'ORIGIN',
  Production = 'PRODUCTION'
}

export type CreateCountryInput = {
  englishName: Scalars['String']['input'];
  iso: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFeedbackInput = {
  message: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Float']['input']>;
  type?: FeedbackType;
};

export type CreateGenreInput = {
  names: GenreNamesInput;
  tmdbId: Scalars['String']['input'];
};

export type CreateGlobalNotificationInput = {
  /** Notification message */
  message: Scalars['String']['input'];
};

export type CreateLanguageInput = {
  englishName: Scalars['String']['input'];
  iso: Scalars['String']['input'];
  nativeName?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePermissionInput = {
  action: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  resource: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateUserWithRoleInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: RolesEnum;
  username: Scalars['String']['input'];
};

export type DeactivateAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type DeviceModel = {
  __typename?: 'DeviceModel';
  brand: Scalars['String']['output'];
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type EnableTotpInput = {
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type Feedback = {
  __typename?: 'Feedback';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  responseMessage?: Maybe<Scalars['String']['output']>;
  source: FeedbackSource;
  status: FeedbackStatus;
  type: FeedbackType;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

/** Source of feedback */
export enum FeedbackSource {
  Email = 'EMAIL',
  Other = 'OTHER',
  Telegram = 'TELEGRAM',
  Website = 'WEBSITE'
}

export type FeedbackStats = {
  __typename?: 'FeedbackStats';
  averageRating: Scalars['Float']['output'];
  bugReportsCount: Scalars['Float']['output'];
  closedCount: Scalars['Float']['output'];
  featureRequestsCount: Scalars['Float']['output'];
  inProgressCount: Scalars['Float']['output'];
  newCount: Scalars['Float']['output'];
  rejectedCount: Scalars['Float']['output'];
  resolvedCount: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

/** Status of feedback */
export enum FeedbackStatus {
  Closed = 'CLOSED',
  InProgress = 'IN_PROGRESS',
  New = 'NEW',
  Rejected = 'REJECTED',
  Resolved = 'RESOLVED'
}

export type FeedbackSubmitResponse = {
  __typename?: 'FeedbackSubmitResponse';
  feedback?: Maybe<Feedback>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Type of feedback */
export enum FeedbackType {
  BugReport = 'BUG_REPORT',
  ContentIssue = 'CONTENT_ISSUE',
  FeatureRequest = 'FEATURE_REQUEST',
  General = 'GENERAL',
  Other = 'OTHER'
}

export type FilmingLocation = {
  __typename?: 'FilmingLocation';
  address: Scalars['String']['output'];
  city?: Maybe<Scalars['String']['output']>;
  coordinates?: Maybe<Point>;
  country: Country;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enhancedDescription?: Maybe<Scalars['String']['output']>;
  formattedAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  placeId?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export type FilterFeedbackInput = {
  source?: InputMaybe<FeedbackSource>;
  status?: InputMaybe<FeedbackStatus>;
  type?: InputMaybe<FeedbackType>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Follow = {
  __typename?: 'Follow';
  createdAt: Scalars['DateTime']['output'];
  follower?: Maybe<User>;
  followerId: Scalars['String']['output'];
  following?: Maybe<User>;
  followingId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Genre = {
  __typename?: 'Genre';
  englishName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  titles?: Maybe<Array<Title>>;
  tmdbId: Scalars['String']['output'];
};

export type GenreNamesInput = {
  en?: InputMaybe<Scalars['String']['input']>;
  ru: Scalars['String']['input'];
};

export type GenresByLanguage = {
  __typename?: 'GenresByLanguage';
  en?: Maybe<Array<TmdbGenre>>;
  ru?: Maybe<Array<TmdbGenre>>;
};

export type GeocodingResult = {
  __typename?: 'GeocodingResult';
  city?: Maybe<Scalars['String']['output']>;
  confidence: Scalars['Float']['output'];
  countryCode: Scalars['String']['output'];
  formattedAddress: Scalars['String']['output'];
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  placeId: Scalars['String']['output'];
  resultType?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type Language = {
  __typename?: 'Language';
  englishName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  iso: Scalars['String']['output'];
  nativeName: Scalars['String']['output'];
  titles?: Maybe<Array<TitleLanguage>>;
};

export type LocationCountryModel = {
  __typename?: 'LocationCountryModel';
  en: Scalars['String']['output'];
  ru: Scalars['String']['output'];
};

export type LocationModel = {
  __typename?: 'LocationModel';
  city: Scalars['String']['output'];
  country: LocationCountryModel;
  latidute: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  region: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignPermissionToRole: Scalars['Boolean']['output'];
  assignRole: Scalars['Boolean']['output'];
  changeAvatar: Scalars['Boolean']['output'];
  changeEmail: Scalars['Boolean']['output'];
  changePassword: Scalars['Boolean']['output'];
  changeProfileInfo: Scalars['Boolean']['output'];
  /** Change notification settings */
  changeSettings: ChangeNotificationSettingsResponse;
  cleanUpTitleSyncData: Scalars['Boolean']['output'];
  clearSessionCookie: Scalars['Boolean']['output'];
  createAccount: Scalars['Boolean']['output'];
  createAccountWithRole: Scalars['Boolean']['output'];
  createCountry: Scalars['Boolean']['output'];
  createGenre: Scalars['Boolean']['output'];
  /** Create a global notification for all users */
  createGlobalNotification: Notification;
  createLanguage: Scalars['Boolean']['output'];
  createPermission: Permission;
  createRole: Role;
  createSocialLink: Scalars['Boolean']['output'];
  /** Deactivate an account */
  deactivate: AuthModel;
  deleteAccount: Scalars['Boolean']['output'];
  /** Disable TOTP for the user */
  disable: Scalars['Boolean']['output'];
  /** Enable TOTP for the user */
  enable: Scalars['Boolean']['output'];
  followUser: Scalars['Boolean']['output'];
  login: AuthModel;
  logout: Scalars['Boolean']['output'];
  newPassword: Scalars['Boolean']['output'];
  rebuildTitleElasticsearchIndex: Scalars['Boolean']['output'];
  removeAvatar: Scalars['Boolean']['output'];
  removePermissionFromRole: Scalars['Boolean']['output'];
  removeSession: Scalars['Boolean']['output'];
  removeSocialLink: Scalars['Boolean']['output'];
  reorderSocialLinks: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  seedRolesAndPermissions: Scalars['Boolean']['output'];
  submitAnonymousFeedback: FeedbackSubmitResponse;
  submitFeedback: FeedbackSubmitResponse;
  syncAiringTitles: Scalars['Boolean']['output'];
  syncAllTitles: Scalars['Boolean']['output'];
  syncPopularTitles: Scalars['Boolean']['output'];
  syncTitleConfig: Scalars['Boolean']['output'];
  syncTopRatedTitles: Scalars['Boolean']['output'];
  syncTrendingTitles: Scalars['Boolean']['output'];
  syncUpcomingTitles: Scalars['Boolean']['output'];
  unassignRole: Scalars['Boolean']['output'];
  unfollowUser: Scalars['Boolean']['output'];
  updateFeedbackStatus: Feedback;
  updateSocialLink: Scalars['Boolean']['output'];
  /** Verify user account with provided token */
  verify: AuthModel;
};


export type MutationAssignPermissionToRoleArgs = {
  data: AssignPermissionToRoleInput;
};


export type MutationAssignRoleArgs = {
  data: AssignRoleInput;
};


export type MutationChangeAvatarArgs = {
  avatar: Scalars['Upload']['input'];
};


export type MutationChangeEmailArgs = {
  data: ChangeEmailInput;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationChangeProfileInfoArgs = {
  data: ChangeProfileInfoInput;
};


export type MutationChangeSettingsArgs = {
  data: ChangeNotificationSettingsInput;
};


export type MutationCreateAccountArgs = {
  data: CreateUserInput;
};


export type MutationCreateAccountWithRoleArgs = {
  data: CreateUserWithRoleInput;
};


export type MutationCreateCountryArgs = {
  data: CreateCountryInput;
};


export type MutationCreateGenreArgs = {
  data: CreateGenreInput;
};


export type MutationCreateGlobalNotificationArgs = {
  data: CreateGlobalNotificationInput;
};


export type MutationCreateLanguageArgs = {
  data: CreateLanguageInput;
};


export type MutationCreatePermissionArgs = {
  data: CreatePermissionInput;
};


export type MutationCreateRoleArgs = {
  data: CreateRoleInput;
};


export type MutationCreateSocialLinkArgs = {
  data: SocialLinkInput;
};


export type MutationDeactivateArgs = {
  data: DeactivateAccountInput;
};


export type MutationDeleteAccountArgs = {
  userId: Scalars['String']['input'];
};


export type MutationEnableArgs = {
  data: EnableTotpInput;
};


export type MutationFollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationNewPasswordArgs = {
  data: NewPasswordInput;
};


export type MutationRemovePermissionFromRoleArgs = {
  data: RemovePermissionFromRoleInput;
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSocialLinkArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderSocialLinksArgs = {
  list: Array<SocialLinkOrderInput>;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationSubmitAnonymousFeedbackArgs = {
  data: CreateFeedbackInput;
};


export type MutationSubmitFeedbackArgs = {
  data: CreateFeedbackInput;
};


export type MutationUnassignRoleArgs = {
  data: UnassignRoleInput;
};


export type MutationUnfollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationUpdateFeedbackStatusArgs = {
  data: UpdateFeedbackStatusInput;
};


export type MutationUpdateSocialLinkArgs = {
  data: SocialLinkInput;
  id: Scalars['String']['input'];
};


export type MutationVerifyArgs = {
  data: VerificationInput;
};

export type NewPasswordInput = {
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isGlobal: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type NotificationSettings = {
  __typename?: 'NotificationSettings';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isSiteNotificationsEnabled: Scalars['Boolean']['output'];
  isTelegramNotificationsEnabled: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export enum NotificationType {
  EnableTwoFactor = 'ENABLE_TWO_FACTOR',
  Info = 'INFO',
  NewFavoriteTitleLocation = 'NEW_FAVORITE_TITLE_LOCATION',
  NewFollower = 'NEW_FOLLOWER'
}

export type PaginatedTitleSearchResults = {
  __typename?: 'PaginatedTitleSearchResults';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  items: Array<Title>;
  total: Scalars['Float']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  resource: Scalars['String']['output'];
};

export type Point = {
  __typename?: 'Point';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  findAllCountries: Array<Country>;
  findAllCountriesWithRelations: Array<Country>;
  findAllFeedbacks: Array<Feedback>;
  findAllGenres: Genre;
  findAllGenresWithRelations: Array<Genre>;
  findAllLanguages: Array<Language>;
  findAllLanguagesWithRelations: Array<Language>;
  findAllUsers: Array<User>;
  /** Find notifications by user */
  findByUser: Array<Notification>;
  findCountryByEnglishName: Country;
  findCountryByISO: Country;
  findCountryById: Country;
  findCountryByName: Country;
  /** Get a current user session */
  findCurrent: Session;
  findFeedbackById: Feedback;
  findFollowersCountByUser: Scalars['Float']['output'];
  findGenreById: Genre;
  findLanguageByEnglishName: Language;
  findLanguageByISO: Language;
  findLanguageById: Language;
  findLanguageByNativeName: Language;
  findMyFeedbacks: Array<Feedback>;
  findRecommendedUsers: Array<User>;
  findSocialLinks: Array<SocialLink>;
  /** Find undread notifications count */
  findUnreadCount: Scalars['Float']['output'];
  findUserFollowers: Array<Follow>;
  findUserFollowings: Array<Follow>;
  /** Generate TOTP secret */
  generate: TotpModel;
  geocodeAddress?: Maybe<Array<GeocodingResult>>;
  getAllPermissions: Array<Permission>;
  getAllRoles: Array<Role>;
  getCountriesListFromTmdb: Array<TmdbCountry>;
  getFeedbackStats: FeedbackStats;
  getGenresListFromTmdb: Array<GenresByLanguage>;
  getLanguagesListFromTmdb: Array<TmdbLanguage>;
  getOwnFeedbacksStats: FeedbackStats;
  getRoleById?: Maybe<Role>;
  getRolePermissions: Array<Permission>;
  getUserRoles: Array<Role>;
  me: User;
  searchTitles: PaginatedTitleSearchResults;
  searchTitlesByCoordinates: PaginatedTitleSearchResults;
  searchTitlesByLocationText: PaginatedTitleSearchResults;
  title: Title;
  titleByImdbId: Title;
  titleByTmdbId: Title;
  titles: PaginatedTitleSearchResults;
};


export type QueryFindAllFeedbacksArgs = {
  filters?: InputMaybe<FilterFeedbackInput>;
};


export type QueryFindCountryByEnglishNameArgs = {
  englishName: Scalars['String']['input'];
};


export type QueryFindCountryByIsoArgs = {
  iso: Scalars['String']['input'];
};


export type QueryFindCountryByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindCountryByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryFindFeedbackByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindFollowersCountByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryFindGenreByIdArgs = {
  tmdbId: Scalars['String']['input'];
};


export type QueryFindLanguageByEnglishNameArgs = {
  englishName: Scalars['String']['input'];
};


export type QueryFindLanguageByIsoArgs = {
  iso: Scalars['String']['input'];
};


export type QueryFindLanguageByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindLanguageByNativeNameArgs = {
  nativeName: Scalars['String']['input'];
};


export type QueryGeocodeAddressArgs = {
  address: Scalars['String']['input'];
};


export type QueryGetFeedbackStatsArgs = {
  filters?: InputMaybe<FilterFeedbackInput>;
};


export type QueryGetOwnFeedbacksStatsArgs = {
  filters: FilterFeedbackInput;
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetRolePermissionsArgs = {
  roleId: Scalars['String']['input'];
};


export type QueryGetUserRolesArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchTitlesArgs = {
  input: TitleSearchInput;
};


export type QuerySearchTitlesByCoordinatesArgs = {
  input: TitleGeosearchInput;
};


export type QuerySearchTitlesByLocationTextArgs = {
  input: TitleSearchInput;
};


export type QueryTitleArgs = {
  id: Scalars['String']['input'];
};


export type QueryTitleByImdbIdArgs = {
  imdbId: Scalars['String']['input'];
};


export type QueryTitleByTmdbIdArgs = {
  tmdbId: Scalars['String']['input'];
};


export type QueryTitlesArgs = {
  filter?: InputMaybe<TitleFilterInput>;
};

export type RemovePermissionFromRoleInput = {
  permissionId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Permission>>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum RolesEnum {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER'
}

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata: SessionMetadataModel;
  userId: Scalars['String']['output'];
};

export type SessionMetadataModel = {
  __typename?: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SocialLink = {
  __typename?: 'SocialLink';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SocialLinkInput = {
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type SocialLinkOrderInput = {
  id: Scalars['String']['input'];
  position: Scalars['Float']['input'];
};

export type Title = {
  __typename?: 'Title';
  alternativeTitles?: Maybe<Array<TitleAlternativeTitle>>;
  backdropPath?: Maybe<Scalars['String']['output']>;
  category: TitleCategory;
  comments: Array<Comment>;
  countries: Array<TitleCountry>;
  createdAt: Scalars['DateTime']['output'];
  credits?: Maybe<TitleCredits>;
  details?: Maybe<TitleDetails>;
  externalIds?: Maybe<TitleExternalIds>;
  filmingLocations: Array<TitleFilmingLocation>;
  genres: Array<TitleGenre>;
  hasLocations: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<TitleImages>;
  imdbId?: Maybe<Scalars['String']['output']>;
  isAdult: Scalars['Boolean']['output'];
  keywords?: Maybe<Array<TitleKeyword>>;
  languages: Array<TitleLanguage>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  originalName?: Maybe<Scalars['String']['output']>;
  popularity: Scalars['Float']['output'];
  posterPath?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  status: TitleStatus;
  tmdbId: Scalars['String']['output'];
  translations: Array<TitleTranslation>;
  type: TitleType;
  updatedAt: Scalars['DateTime']['output'];
  voteAverage?: Maybe<Scalars['Float']['output']>;
  voteCount?: Maybe<Scalars['Float']['output']>;
};

export type TitleAlternativeTitle = {
  __typename?: 'TitleAlternativeTitle';
  iso_3166_1?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export enum TitleCategory {
  Airing = 'AIRING',
  Popular = 'POPULAR',
  Regular = 'REGULAR',
  TopRated = 'TOP_RATED',
  Trending = 'TRENDING',
  Upcoming = 'UPCOMING'
}

export type TitleCountry = {
  __typename?: 'TitleCountry';
  country: Country;
  countryId: Scalars['String']['output'];
  title: Title;
  titleId: Scalars['String']['output'];
  type: CountryRelation;
};

export type TitleCredit = {
  __typename?: 'TitleCredit';
  adult?: Maybe<Scalars['Boolean']['output']>;
  character?: Maybe<Scalars['String']['output']>;
  credit_id?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  known_for_department?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  original_name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type TitleCredits = {
  __typename?: 'TitleCredits';
  cast?: Maybe<Array<TitleCredit>>;
  crew?: Maybe<Array<TitleCredit>>;
};

export type TitleDetails = {
  __typename?: 'TitleDetails';
  budget?: Maybe<Scalars['Float']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  revenue?: Maybe<Scalars['Float']['output']>;
  runtime?: Maybe<Scalars['Float']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Float']['output']>;
};

export type TitleExternalIds = {
  __typename?: 'TitleExternalIds';
  facebook_id?: Maybe<Scalars['String']['output']>;
  freebase_id?: Maybe<Scalars['String']['output']>;
  freebase_mid?: Maybe<Scalars['String']['output']>;
  imdb_id?: Maybe<Scalars['String']['output']>;
  instagram_id?: Maybe<Scalars['String']['output']>;
  tvdb_id?: Maybe<Scalars['Float']['output']>;
  tvrage_id?: Maybe<Scalars['Float']['output']>;
  twitter_id?: Maybe<Scalars['String']['output']>;
  wikidata_id?: Maybe<Scalars['String']['output']>;
};

export type TitleFilmingLocation = {
  __typename?: 'TitleFilmingLocation';
  createdAt: Scalars['DateTime']['output'];
  filmingLocation: FilmingLocation;
  filmingLocationId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  title: Title;
  titleId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TitleFilterInput = {
  category?: InputMaybe<TitleCategory>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  withFilmingLocations?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TitleGenre = {
  __typename?: 'TitleGenre';
  genre: Genre;
  genreId: Scalars['String']['output'];
  title: Title;
  titleId: Scalars['String']['output'];
};

export type TitleGeosearchInput = {
  distance: Scalars['String']['input'];
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
  options?: InputMaybe<TitleSearchOptionsInput>;
};

export type TitleImage = {
  __typename?: 'TitleImage';
  aspect_ratio?: Maybe<Scalars['Float']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  iso_639_1?: Maybe<Scalars['String']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type TitleImages = {
  __typename?: 'TitleImages';
  backdrops: Array<TitleImage>;
  logos: Array<TitleImage>;
  posters: Array<TitleImage>;
};

export type TitleKeyword = {
  __typename?: 'TitleKeyword';
  id?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type TitleLanguage = {
  __typename?: 'TitleLanguage';
  language: Language;
  languageId: Scalars['String']['output'];
  title: Title;
  titleId: Scalars['String']['output'];
  type: TitleLanguageType;
};

export enum TitleLanguageType {
  Available = 'AVAILABLE',
  Original = 'ORIGINAL',
  Spoken = 'SPOKEN'
}

export type TitleSearchInput = {
  options?: InputMaybe<TitleSearchOptionsInput>;
  query: Scalars['String']['input'];
};

export type TitleSearchOptionsInput = {
  from?: InputMaybe<Scalars['Float']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
};

export enum TitleStatus {
  Airing = 'AIRING',
  Canceled = 'CANCELED',
  InProduction = 'IN_PRODUCTION',
  Planned = 'PLANNED',
  PostProduction = 'POST_PRODUCTION',
  Released = 'RELEASED',
  Rumored = 'RUMORED'
}

export type TitleTranslation = {
  __typename?: 'TitleTranslation';
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  languageId: Scalars['String']['output'];
  overview?: Maybe<Scalars['String']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  titleId: Scalars['String']['output'];
};

/** The type of titles to refresh */
export enum TitleType {
  Movie = 'MOVIE',
  Tv = 'TV'
}

export type TmdbCountry = {
  __typename?: 'TmdbCountry';
  english_name?: Maybe<Scalars['String']['output']>;
  iso_3166_1?: Maybe<Scalars['String']['output']>;
  native_name?: Maybe<Scalars['String']['output']>;
};

export type TmdbGenre = {
  __typename?: 'TmdbGenre';
  id?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type TmdbLanguage = {
  __typename?: 'TmdbLanguage';
  english_name?: Maybe<Scalars['String']['output']>;
  iso_639_1?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type TotpModel = {
  __typename?: 'TotpModel';
  qrCodeUrl: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type UnassignRoleInput = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UpdateFeedbackStatusInput = {
  id: Scalars['String']['input'];
  responseMessage?: InputMaybe<Scalars['String']['input']>;
  status: FeedbackStatus;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deactivatedAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  followers?: Maybe<Array<Follow>>;
  followings?: Maybe<Array<Follow>>;
  id: Scalars['String']['output'];
  isDeactivated: Scalars['Boolean']['output'];
  isTotpEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  notificationSettings?: Maybe<NotificationSettings>;
  notifications?: Maybe<Array<Notification>>;
  password?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Role>>;
  socialLinks?: Maybe<Array<SocialLink>>;
  telegramId?: Maybe<Scalars['String']['output']>;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type TitlesQueryVariables = Exact<{
  filter?: InputMaybe<TitleFilterInput>;
}>;


export type TitlesQuery = { __typename?: 'Query', titles: { __typename?: 'PaginatedTitleSearchResults', total: number, hasNextPage: boolean, hasPreviousPage: boolean, items: Array<{ __typename?: 'Title', id: string, tmdbId: string, imdbId?: string | null, originalName?: string | null, type: TitleType, category: TitleCategory, status: TitleStatus, isAdult: boolean, posterPath?: string | null, backdropPath?: string | null, popularity: number, hasLocations: boolean, voteAverage?: number | null, voteCount?: number | null, releaseDate?: string | null, createdAt: any, updatedAt: any, lastSyncedAt?: any | null, details?: { __typename?: 'TitleDetails', budget?: number | null, revenue?: number | null, runtime?: number | null, vote_average?: number | null, vote_count?: number | null, release_date?: string | null } | null, keywords?: Array<{ __typename?: 'TitleKeyword', id?: number | null, name?: string | null }> | null, credits?: { __typename?: 'TitleCredits', cast?: Array<{ __typename?: 'TitleCredit', id?: number | null, adult?: boolean | null, gender?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null }> | null, crew?: Array<{ __typename?: 'TitleCredit', id?: number | null, adult?: boolean | null, gender?: number | null, known_for_department?: string | null, name?: string | null, original_name?: string | null, popularity?: number | null, profile_path?: string | null, character?: string | null, credit_id?: string | null, order?: number | null }> | null } | null, alternativeTitles?: Array<{ __typename?: 'TitleAlternativeTitle', iso_3166_1?: string | null, title?: string | null, type?: string | null }> | null, externalIds?: { __typename?: 'TitleExternalIds', imdb_id?: string | null, freebase_mid?: string | null, freebase_id?: string | null, tvdb_id?: number | null, tvrage_id?: number | null, wikidata_id?: string | null, facebook_id?: string | null, instagram_id?: string | null, twitter_id?: string | null } | null, filmingLocations: Array<{ __typename?: 'TitleFilmingLocation', id: string, titleId: string, filmingLocationId: string, createdAt: any, updatedAt: any, filmingLocation: { __typename?: 'FilmingLocation', id: string, address: string, formattedAddress?: string | null, placeId?: string | null, city?: string | null, state?: string | null, description?: string | null, enhancedDescription?: string | null, createdAt: any, updatedAt: any, coordinates?: { __typename?: 'Point', x?: number | null, y?: number | null } | null } }>, genres: Array<{ __typename?: 'TitleGenre', titleId: string, genreId: string, genre: { __typename?: 'Genre', id: string, tmdbId: string, name: string, englishName?: string | null } }>, languages: Array<{ __typename?: 'TitleLanguage', titleId: string, languageId: string, type: TitleLanguageType, language: { __typename?: 'Language', id: string, iso: string, nativeName: string, englishName: string } }>, countries: Array<{ __typename?: 'TitleCountry', titleId: string, countryId: string, type: CountryRelation, country: { __typename?: 'Country', id: string, iso: string, englishName: string, name?: string | null } }>, translations: Array<{ __typename?: 'TitleTranslation', id: string, titleId: string, languageId: string, title: string, overview?: string | null, tagline?: string | null, homepage?: string | null }>, images?: { __typename?: 'TitleImages', backdrops: Array<{ __typename?: 'TitleImage', aspect_ratio?: number | null, height?: number | null, width?: number | null, iso_639_1?: string | null, file_path?: string | null, vote_average?: number | null, vote_count?: number | null }>, logos: Array<{ __typename?: 'TitleImage', aspect_ratio?: number | null, height?: number | null, width?: number | null, iso_639_1?: string | null, file_path?: string | null, vote_average?: number | null, vote_count?: number | null }>, posters: Array<{ __typename?: 'TitleImage', aspect_ratio?: number | null, height?: number | null, width?: number | null, iso_639_1?: string | null, file_path?: string | null, vote_average?: number | null, vote_count?: number | null }> } | null }> } };


export const TitlesDocument = gql`
    query Titles($filter: TitleFilterInput) {
  titles(filter: $filter) {
    items {
      id
      tmdbId
      imdbId
      originalName
      type
      category
      status
      isAdult
      posterPath
      backdropPath
      popularity
      hasLocations
      voteAverage
      voteCount
      releaseDate
      details {
        budget
        revenue
        runtime
        vote_average
        vote_count
        release_date
      }
      keywords {
        id
        name
      }
      credits {
        cast {
          id
          adult
          gender
          known_for_department
          name
          original_name
          popularity
          profile_path
          character
          credit_id
          order
        }
        crew {
          id
          adult
          gender
          known_for_department
          name
          original_name
          popularity
          profile_path
          character
          credit_id
          order
        }
      }
      alternativeTitles {
        iso_3166_1
        title
        type
      }
      externalIds {
        imdb_id
        freebase_mid
        freebase_id
        tvdb_id
        tvrage_id
        wikidata_id
        facebook_id
        instagram_id
        twitter_id
      }
      createdAt
      updatedAt
      lastSyncedAt
      filmingLocations {
        id
        titleId
        filmingLocationId
        createdAt
        updatedAt
        filmingLocation {
          id
          address
          coordinates {
            x
            y
          }
          formattedAddress
          placeId
          city
          state
          description
          enhancedDescription
          createdAt
          updatedAt
        }
      }
      genres {
        titleId
        genreId
        genre {
          id
          tmdbId
          name
          englishName
        }
      }
      languages {
        titleId
        languageId
        type
        language {
          id
          iso
          nativeName
          englishName
        }
      }
      countries {
        titleId
        countryId
        type
        country {
          id
          iso
          englishName
          name
        }
      }
      translations {
        id
        titleId
        languageId
        title
        overview
        tagline
        homepage
      }
      images {
        backdrops {
          aspect_ratio
          height
          width
          iso_639_1
          file_path
          vote_average
          vote_count
        }
        logos {
          aspect_ratio
          height
          width
          iso_639_1
          file_path
          vote_average
          vote_count
        }
        posters {
          aspect_ratio
          height
          width
          iso_639_1
          file_path
          vote_average
          vote_count
        }
      }
    }
    total
    hasNextPage
    hasPreviousPage
  }
}
    `;

/**
 * __useTitlesQuery__
 *
 * To run a query within a React component, call `useTitlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTitlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTitlesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTitlesQuery(baseOptions?: Apollo.QueryHookOptions<TitlesQuery, TitlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitlesQuery, TitlesQueryVariables>(TitlesDocument, options);
      }
export function useTitlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitlesQuery, TitlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitlesQuery, TitlesQueryVariables>(TitlesDocument, options);
        }
export function useTitlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TitlesQuery, TitlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TitlesQuery, TitlesQueryVariables>(TitlesDocument, options);
        }
export type TitlesQueryHookResult = ReturnType<typeof useTitlesQuery>;
export type TitlesLazyQueryHookResult = ReturnType<typeof useTitlesLazyQuery>;
export type TitlesSuspenseQueryHookResult = ReturnType<typeof useTitlesSuspenseQuery>;
export type TitlesQueryResult = Apollo.QueryResult<TitlesQuery, TitlesQueryVariables>;