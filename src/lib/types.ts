export type ContentStatus = "published" | "draft" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: ContentStatus;
  views: number;
  updatedAt: string;
}

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}
