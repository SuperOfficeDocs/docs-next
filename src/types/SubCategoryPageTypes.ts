export type SubCategoryContentItem = {
  title: string;
  summary: string;
  metadata: CompanyContentMetadata;
  landingContent: LandingContentCard[];
};

export type CompanyContentMetadata = {
  title: string;
  description: string;
  // "so.product": string;
  "ms.topic": string;
  // "so.collection": string;
  author: string;
  "so.author": string;
  "so.date": string;
};

export type LandingContentCard = {
  title: string;
  linkLists: linkItem[];
};

export type linkItem = {
  itemType: IconType;
  typeDesc: typeDesc;
  links: link[];
};

export type link = {
  text: string;
  url: string;
};

type IconType =
  | "architecture"
  | "explore"
  | "cloud_upload"
  | "file_download"
  | "power_settings_new"
  | "list"
  | "school"
  | "map"
  | "place"
  | "library_books"
  | "dvr"
  | "video_library"
  | "new_releases";

type typeDesc =
  | "architecture"
  | "concept"
  | "deploy"
  | "download"
  | "get-started"
  | "how-to-guide"
  | "learn"
  | "overview"
  | "quickstart"
  | "reference"
  | "tutorial"
  | "video"
  | "whats-new";
