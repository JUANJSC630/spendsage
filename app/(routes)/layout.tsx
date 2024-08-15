import { NavbarDashboard } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="block md:hidden">
          <NavbarDashboard />
        </div>
        <div className="w-full md:h-full">{children}</div>
      </div>
    </div>
  );
}
