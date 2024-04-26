export interface SavedLinks {
  children: {
    kind: string;
    data: SavedLinkData;
  }[];
  after: string;
  before: string;
}

export interface SavedLinkData {
  id: string;
  link: string;
  link_title: string;
  title: string;
  url: string;
  thumbnail: string;
  permalink: string;
  is_gallery?: boolean;
  preview?: {
    images: { resolutions: { url: string }[]; source: { url: string } }[];
  };
  media_metadata?: MediaMetadata;
  subreddit_name_prefixed: string;
}

interface MediaMetadata {
  [key: string]: {
    p: { u: string; x: number; y: number }[];
  };
}
