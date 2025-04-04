export type TocItem = {
  name: string;
  href?: string;
  uid?: string;
  topicHref?: string;
  items?: TocItem[]; // Recursive structure for nested items
};

export type TocData = {
  items: TocItem[];
};