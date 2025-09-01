export type CategoryContentItem = {
  title: string;
  summary: string;
  brand: string;
  metadata: CompanyContentMetadata;
  highlightedContent: highlightedContent;
  conceptualContent?: conceptualContent;
  tools?: toolCard;
  additionalContent?: {
    sections: conceptualContent[];
  };
};

export type CompanyContentMetadata = {
  title: string;
  description: string;
  "so.product": string;
  "so.topic": string;
  "so.collection": string;
  author: string;
  "so.author": string;
  "so.date": string;
};

export type highlightedContent = {
  items: CardLinks[];
};

export type conceptualContent = {
  title?: string;
  summary?: string;
  items: contentCard[];
};

export type contentCard = {
  title: string;
  summary: string;
  links?: CardLinks[];
  url?: string;
};

export type CardLinks = {
  text?: string;
  itemType?: IconType;
  typeDesc?: typeDesc;
  url: string;
  title?: string;
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


export type toolCard = {
  title?: string;
  summary?: string;
  items: toolItems[];
};

export type toolItems = {
  title: string;
  imageSrc: string;
  url: string;
};
