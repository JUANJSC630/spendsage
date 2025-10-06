import { LucideIcon } from "lucide-react";

export type SidebarItemProps = {
  item: {
    label: string;
    icon: LucideIcon;
    href: string;
  };
  key: string;
  setOpen: boolean;
  onItemClick?: () => void;
};
