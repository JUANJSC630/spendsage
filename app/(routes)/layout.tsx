import { NavbarDashboard } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="block md:hidden">
          <NavbarDashboard />
        </div>
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
