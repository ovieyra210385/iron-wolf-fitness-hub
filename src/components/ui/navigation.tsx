import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  User
} from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  active?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: Home, href: "/", active: true },
  { label: "Socios", icon: Users, href: "/members" },
  { label: "Reservas", icon: Calendar, href: "/bookings" },
  { label: "Pagos", icon: CreditCard, href: "/payments" },
  { label: "Reportes", icon: BarChart3, href: "/reports" },
  { label: "Configuración", icon: Settings, href: "/settings" },
];

export function Navigation() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-iron rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IW</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-card-foreground">Iron Wolf</h1>
              <p className="text-xs text-muted-foreground">Fitness Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-gradient-iron text-white shadow-md"
                )}
                onClick={() => setActiveItem(item.href)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Top bar */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Buscar...
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 bg-background">
          {/* Content will be rendered here */}
        </main>
      </div>
    </div>
  );
}