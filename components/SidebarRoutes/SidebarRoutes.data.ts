import {
  LayoutDashboard,
  ScrollText,
  BadgeDollarSign,
  Settings,
  ListCheck,
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
    icon: ListCheck,
    label: "Payment Schedule",
    href: "/payment-schedule",
  },
];

export const dataSettingsSidebar = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];
