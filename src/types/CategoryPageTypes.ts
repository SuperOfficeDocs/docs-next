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
  itemType?: string;
  typeDesc?: string;
  url: string;
  title?: string;
};

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
