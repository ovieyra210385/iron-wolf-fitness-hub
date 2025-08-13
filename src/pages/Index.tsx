import { useState } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Members } from "@/components/members/members";
import { Bookings } from "@/components/bookings/bookings";
import { Payments } from "@/components/payments/payments";
import { AccessControl } from "@/components/access/access-control";
import { CRM } from "@/components/crm/crm";
import { Dumbbell } from "lucide-react";
import { Training } from "@/components/training/Training";
import { Reports } from "@/components/reports/reports";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Shield,
  MessageSquare,
  BarChart3, 
  Bell,
  Search,
  User,
  Settings as SettingsIcon
} from "lucide-react";
import { Settings } from "@/components/settings/settings";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, component: Dashboard },
  { id: "members", label: "Socios", icon: Users, component: Members },
  { id: "bookings", label: "Reservas", icon: Calendar, component: Bookings },
  { id: "payments", label: "Pagos", icon: CreditCard, component: Payments },
  { id: "access", label: "Control de Acceso", icon: Shield, component: AccessControl },
  { id: "crm", label: "CRM", icon: MessageSquare, component: CRM },
  { id: "reports", label: "Reportes", icon: BarChart3, component: Reports },
  { id: "settings", label: "Configuración", icon: SettingsIcon, component: Settings },
  { id: "dashboard", label: "Dashboard", icon: Home, component: Dashboard },
  { id: "members", label: "Socios", icon: Users, component: Members },
  { id: "bookings", label: "Reservas", icon: Calendar, component: Bookings },
  { id: "payments", label: "Pagos", icon: CreditCard, component: Payments },
  { id: "training", label: "Entrenamiento", icon: Dumbbell, component: Training },
  { id: "reports", label: "Reportes", icon: BarChart3, component: Reports },
  { id: "settings", label: "Configuración", icon: SettingsIcon, component: Settings },

];

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const currentComponent = navigationItems.find(item => item.id === activeSection)?.component || Dashboard;
  const CurrentComponent = currentComponent;

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-4">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-iron rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">IW</span>
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg text-card-foreground">Iron Wolf</h1>
                <p className="text-xs text-muted-foreground">Fitness Management</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6 p-3 bg-gradient-iron rounded-lg text-white">
            <div className="text-xs font-medium opacity-90">Estado del Día</div>
            <div className="text-lg font-bold">342 Socios</div>
            <div className="text-xs opacity-75">89% Capacidad</div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "iron" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="mt-8 pt-4 border-t border-border">
            <Button 
              variant={activeSection === "settings" ? "iron" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("settings")}
            >
              <SettingsIcon className="mr-3 h-4 w-4" />
              Configuración
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground text-right">
                  <div className="font-medium">Admin</div>
                  <div className="text-xs">Último acceso: Hoy, 14:32</div>
                </div>
                <div className="h-8 w-8 bg-gradient-iron rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AD</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          <main className="flex-1 p-6 bg-background overflow-auto">
            <CurrentComponent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;