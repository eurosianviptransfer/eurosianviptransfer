export interface SidebarItem {
  icon: string;
  label: string;
  route: string;
  children?: { label: string; route: string; badge?: string }[];
  badge?: string;
}

export interface SidebarGroup {
  name: string;
  menuItems: SidebarItem[];
}

export interface CardDataStatsProps {
  title: string;
  total: string;
  rate?: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children?: React.ReactNode;
  subtitle?: string;
}
