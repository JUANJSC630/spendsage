import { NavbarDashboard } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <div className="hidden h-full xl:block w-60 xl:fixed">
        <Sidebar />
      </div>
      <div className="w-full h-full xl:ml-60">
        <NavbarDashboard />
        <div className="h-max">{children}</div>
      </div>
    </div>
  );
}
