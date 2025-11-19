
export interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
}

export interface ChannelSnippet {
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  country?: string;
}

export interface ChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface ChannelContentDetails {
  relatedPlaylists: {
    likes: string;
    uploads: string;
  };
}

export interface Channel {
  kind: string;
  etag: string;
  id: string;
  snippet: ChannelSnippet;
  contentDetails?: ChannelContentDetails;
  statistics: ChannelStatistics;
}

export interface ChannelInfo {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Channel[];
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  playlistId?: string;
  position?: number;
  resourceId: {
    kind: string;
    videoId: string;
  };
}

export interface Video {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
}

export interface VideosResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Video[];
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  dislikeCount?: string;
  favoriteCount: string;
  commentCount: string;
}

export interface VideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  statistics: VideoStatistics;
}

export interface VideoStatsResponse {
  kind: string;
  etag: string;
  items: VideoItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export type PageType = 'home' | 'channel' | 'videos';


export interface AISummary {
  summary: string;
  topics: string[];
  audience: string;
}