import {
  LayoutDashboard,
  ScrollText,
  BadgeDollarSign,
  Settings,
  ListCheck,
  Wallet,
  Tags,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: LayoutDashboard,
    label: "Inicio",
    href: "/",
  },
  {
    icon: BadgeDollarSign,
    label: "Finanzas",
    href: "/finances",
  },
    {
    icon: ListCheck,
    label: "Lista de Pagos",
    href: "/list-payment-schedule",
  },
  {
    icon: Wallet,
    label: "Presupuestos",
    href: "/budgets",
  },
  {
    icon: Tags,
    label: "Categorías",
    href: "/categories",
  },
];

export const dataSettingsSidebar = [
  {
    icon: Settings,
    label: "Configuración",
    href: "/settings",
  },
];
