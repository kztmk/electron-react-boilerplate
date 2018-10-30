// @flow
export type FeedMetaType = {
  title: string,
  description: string,
  link: [
    {
      url: string,
      rel: string
    }
  ],
  lastUpdated: ?Date
};

export type FeedItemType = {
  id: string,
  title: string,
  imageUrl: string,
  links: [
    {
      url: string,
      rel: string
    }
  ],
  description: string,
  summary: string,
  link: string,
  date: ?Date,
  image: Object,
  categories: [{ name: string }],
  content: string,
  published: ?Date
};

type FeedType = {
  feedMeta: FeedMetaType,
  items: Array<FeedItemType>
};

export default FeedType;
