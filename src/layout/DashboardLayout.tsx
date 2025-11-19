import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { ClientSidebar } from "../components/ClientSidebar";
import { TooltipProvider } from "../components/ui/tooltip";

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background overflow-hidden">
          <ClientSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <div className="flex items-center gap-2 border-b px-4! py-2!">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex-1 overflow-auto">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

