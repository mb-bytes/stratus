import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./Home/Sidebar/SideProvider";
import { SidebarDemo } from "./Home/Sidebar/Sidebar";

function DashboardLayout() {
  return (
    <SidebarProvider>
      <SidebarDemo>
        <Outlet />
      </SidebarDemo>
    </SidebarProvider>
  );
}

export default DashboardLayout;
