
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  UserCog,
  BookOpen,
  Briefcase,
  Calendar,
  LogOut,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar as SidebarContainer, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: BarChart3, path: "/" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Trainers", icon: UserCog, path: "/trainers" },
    { name: "Batches", icon: BookOpen, path: "/batches" },
    { name: "Payments", icon: CreditCard, path: "/payments" },
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Interviews", icon: Calendar, path: "/interviews" }
  ];

  return (
    <SidebarContainer>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {expanded && (
            <span className="font-display font-bold text-lg text-white">
              Initium Learning
            </span>
          )}
        </div>
        <SidebarTrigger>
          <Button 
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground bg-transparent"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm rounded-md transition-all",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80"
              )}
            >
              <item.icon size={18} className="mr-3" />
              {expanded && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div 
          className={cn(
            "flex items-center px-3 py-2.5 text-sm rounded-md cursor-pointer",
            "text-sidebar-foreground/70 hover:text-sidebar-foreground"
          )}
        >
          <LogOut size={18} className="mr-3" />
          {expanded && <span>Logout</span>}
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
