import { 
  LayoutDashboard, 
  BookOpen,
  LogOut,
  Home,
  Bell,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

export function ClientSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      key: "dashboard"
    },
    {
      title: "My Bookings",
      icon: BookOpen,
      path: "/bookings",
      key: "bookings"
    },
    {
      title: "View Villas",
      icon: Building2,
      path: "/villas",
      key: "villas"
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/notifications",
      key: "notifications"
    },
    {
      title: "My Account",
      icon: User,
      path: "/account",
      key: "account"
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className="bg-gradient-to-b from-[#e82574] to-[#bc1c5c] border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-6! border-b border-white/10">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4! border border-white/20">
                <div className="scale-125">
                  <span className="text-3xl">🏖️</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/90 text-xs uppercase tracking-wider font-semibold">Villa Perez Resort</p>
                <p className="text-white/60 text-xs mt-1">Client Portal</p>
              </div>
            </div>
          </div>
          <SidebarGroupContent className="p-4!">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    isActive={isActive(item.path)}
                    className={`
                      w-full rounded-xl p-3! transition-all duration-200 
                      ${isActive(item.path)
                        ? 'bg-white/20 text-white shadow-lg transform scale-105' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4! border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/")}
              className="w-full rounded-xl p-3! text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="w-full rounded-xl p-3! text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

