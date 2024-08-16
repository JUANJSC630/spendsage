import {
  LayoutDashboard,
  ScrollText,
  BadgeDollarSign,
  Settings,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: LayoutDashboard,
    label: "Home",
    href: "/",
  },
  {
    icon: BadgeDollarSign,
    label: "Finances",
    href: "/finances",
  },
  {
    icon: ScrollText,
    label: "Reports",
    href: "/reports",
  },
];

export const dataSettingsSidebar = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];
