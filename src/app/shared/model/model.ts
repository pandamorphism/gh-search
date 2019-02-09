export type SearchResult = {
  incomplete_results: boolean
  items: UserInfo[];
  total_count: number;
  pagination: UrlToRel[];
};

export type UserInfo = {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
};

export type Rel = 'prev' | 'next' | 'last' | 'first';

export type UrlToRel = {
  url: string;
  rel: Rel;
};
