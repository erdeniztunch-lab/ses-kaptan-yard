import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Truck,
  BarChart3,
  HelpCircle,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Ana Panel",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sevkiyatlarım",
    href: "/shipments",
    icon: Package,
  },
  {
    title: "Nakliyeci Rehberi",
    href: "/carriers",
    icon: Users,
  },
  {
    title: "Raporlar",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">LojistikAI</h2>
                <p className="text-xs text-muted-foreground">Sesli Asistan</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-muted",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Bildirimler
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Yardım
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};