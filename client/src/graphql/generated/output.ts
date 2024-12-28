import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type FilmingLocation = {
  __typename?: 'FilmingLocation';
  address: Scalars['String']['output'];
  coordinates?: Maybe<Point>;
  description?: Maybe<Scalars['String']['output']>;
  formattedAddress?: Maybe<Scalars['String']['output']>;
};

export type FullSyncResult = {
  __typename?: 'FullSyncResult';
  popularMoviesCount: Scalars['Int']['output'];
  popularTvShowsCount: Scalars['Int']['output'];
  topRatedMoviesCount: Scalars['Int']['output'];
  topRatedTvShowsCount: Scalars['Int']['output'];
  trendingMoviesCount: Scalars['Int']['output'];
  trendingTvShowsCount: Scalars['Int']['output'];
  upcomingMoviesCount: Scalars['Int']['output'];
};

export type Genre = {
  __typename?: 'Genre';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LocationsSyncResult = {
  __typename?: 'LocationsSyncResult';
  errors: Array<Scalars['String']['output']>;
  failedCount: Scalars['Int']['output'];
  processedCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  syncedImdbIds: Array<Scalars['String']['output']>;
};

export type Movie = {
  __typename?: 'Movie';
  adult: Scalars['Boolean']['output'];
  backdropPath?: Maybe<Scalars['String']['output']>;
  budget: Scalars['Int']['output'];
  category: TitleCategory;
  filmingLocations: Array<FilmingLocation>;
  genres: Array<Genre>;
  homepage?: Maybe<Scalars['String']['output']>;
  imdbId: Scalars['String']['output'];
  originCountry: Array<Scalars['String']['output']>;
  originalLanguage: Scalars['String']['output'];
  originalTitle: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  posterPath?: Maybe<Scalars['String']['output']>;
  productionCompanies: Array<ProductionCompany>;
  productionCountries: Array<ProductionCountry>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  revenue: Scalars['Int']['output'];
  runtime: Scalars['Int']['output'];
  spokenLanguages: Array<SpokenLanguage>;
  status: MovieStatus;
  tagLine?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  tmdbId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  voteAverage: Scalars['Float']['output'];
  voteCount: Scalars['Int']['output'];
};

/** The status of the movie */
export enum MovieStatus {
  Canceled = 'CANCELED',
  InProduction = 'IN_PRODUCTION',
  Planned = 'PLANNED',
  PostProduction = 'POST_PRODUCTION',
  Released = 'RELEASED',
  Rumored = 'RUMORED'
}

export type Mutation = {
  __typename?: 'Mutation';
  syncAllContent: FullSyncResult;
  syncLocations: LocationsSyncResult;
  syncPopularTitles: SyncResult;
  syncTopRatedTitles: SyncResult;
  syncTrendingTitles: SyncResult;
  syncUpcomingTitles: SyncResult;
};


export type MutationSyncLocationsArgs = {
  imdbIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationSyncPopularTitlesArgs = {
  type?: InputMaybe<TitleType>;
};


export type MutationSyncTopRatedTitlesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<TitleType>;
};


export type MutationSyncTrendingTitlesArgs = {
  type?: InputMaybe<TitleType>;
};


export type MutationSyncUpcomingTitlesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Network = {
  __typename?: 'Network';
  id?: Maybe<Scalars['Int']['output']>;
  logo_path?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  origin_country?: Maybe<Scalars['String']['output']>;
};

export type Point = {
  __typename?: 'Point';
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type ProductionCompany = {
  __typename?: 'ProductionCompany';
  id?: Maybe<Scalars['Int']['output']>;
  logo_path?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  origin_country?: Maybe<Scalars['String']['output']>;
};

export type ProductionCountry = {
  __typename?: 'ProductionCountry';
  iso_3166_1?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  movie?: Maybe<Movie>;
  movieLocations: Array<FilmingLocation>;
  /** Get a list of movies with optional category filter and limit */
  movies: Array<Movie>;
  popularMovies: Array<Movie>;
  popularTvShows: Array<TvShow>;
  searchMovies: Array<Movie>;
  searchTvShows: Array<TvShow>;
  searchedMovies: Array<Movie>;
  topRatedMovies: Array<Movie>;
  topRatedTvShows: Array<TvShow>;
  trendingMovies: Array<Movie>;
  trendingTvShows: Array<TvShow>;
  tvShow?: Maybe<TvShow>;
  tvShowLocations: Array<FilmingLocation>;
  tvShows: Array<TvShow>;
  upcomingMovies: Array<Movie>;
};


export type QueryMovieArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type QueryMovieLocationsArgs = {
  imdbId: Scalars['String']['input'];
};


export type QueryMoviesArgs = {
  category?: InputMaybe<TitleCategory>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularTvShowsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchTvShowsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchedMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopRatedTvShowsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrendingMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrendingTvShowsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTvShowArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type QueryTvShowLocationsArgs = {
  imdbId: Scalars['String']['input'];
};


export type QueryTvShowsArgs = {
  category?: InputMaybe<TitleCategory>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUpcomingMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type SimplePerson = {
  __typename?: 'SimplePerson';
  credit_id?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile_path?: Maybe<Scalars['String']['output']>;
};

export type SpokenLanguage = {
  __typename?: 'SpokenLanguage';
  iso_639_1?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type SyncResult = {
  __typename?: 'SyncResult';
  moviesCount: Scalars['Int']['output'];
  tvShowsCount: Scalars['Int']['output'];
};

/** The category of the title */
export enum TitleCategory {
  Popular = 'POPULAR',
  Search = 'SEARCH',
  TopRated = 'TOP_RATED',
  Trending = 'TRENDING',
  Upcoming = 'UPCOMING'
}

/** The type of titles to refresh */
export enum TitleType {
  All = 'ALL',
  Movies = 'MOVIES',
  TvShows = 'TV_SHOWS'
}

export type TvShow = {
  __typename?: 'TvShow';
  backdropPath?: Maybe<Scalars['String']['output']>;
  category: TitleCategory;
  createdBy: Array<SimplePerson>;
  episodeRunTime: Array<Scalars['Int']['output']>;
  filmingLocations: Array<FilmingLocation>;
  firstAirDate?: Maybe<Scalars['String']['output']>;
  genres: Array<Genre>;
  homepage?: Maybe<Scalars['String']['output']>;
  imdbId: Scalars['String']['output'];
  inProduction: Scalars['Boolean']['output'];
  languages: Array<Scalars['String']['output']>;
  lastAirDate?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  networks: Array<Network>;
  numberOfEpisodes: Scalars['Int']['output'];
  numberOfSeasons: Scalars['Int']['output'];
  originCountry: Array<Scalars['String']['output']>;
  originalLanguage: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  posterPath?: Maybe<Scalars['String']['output']>;
  productionCompanies: Array<ProductionCompany>;
  productionCountries: Array<ProductionCountry>;
  spokenLanguages: Array<SpokenLanguage>;
  status: Scalars['String']['output'];
  tagLine?: Maybe<Scalars['String']['output']>;
  tmdbId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  voteAverage: Scalars['Float']['output'];
  voteCount: Scalars['Int']['output'];
};
