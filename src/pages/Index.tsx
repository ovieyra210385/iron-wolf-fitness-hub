import { useState } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Members } from "@/components/members/members";
import { Bookings } from "@/components/bookings/bookings";
import { Payments } from "@/components/payments/payments";
import { AccessControl } from "@/components/access/access-control";
import { CRM } from "@/components/crm/crm";
import { Dumbbell, BookOpen } from "lucide-react"; // <-- Importamos el icono
import { Training } from "@/components/training/Training";
import { Reports } from "@/components/reports/reports";
import { Coaches } from "@/components/coaches/Coaches";
import { Memberships } from "@/components/memberships/Memberships";
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
  Settings as SettingsIcon,
  UserCheck,
  Crown
} from "lucide-react";
import { Settings } from "@/components/settings/settings";
import Classes from "./Classes"; // <-- 1. Importamos el componente de Clases

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, component: Dashboard },
  { id: "members", label: "Socios", icon: Users, component: Members },
  { id: "coaches", label: "Coaches", icon: UserCheck, component: Coaches },
  { id: "memberships", label: "Membresías", icon: Crown, component: Memberships },
  { id: "bookings", label: "Reservas", icon: Calendar, component: Bookings },
  { id: "payments", label: "Pagos", icon: CreditCard, component: Payments },
  { id: "access", label: "Control de Acceso", icon: Shield, component: AccessControl },
  { id: "crm", label: "CRM", icon: MessageSquare, component: CRM },
  { id: "training", label: "Entrenamiento", icon: Dumbbell, component: Training },
  { id: "classes", label: "Clases", icon: BookOpen, component: Classes }, // <-- 2. Añadimos la nueva opción al menú
  { id: "reports", label: "Reportes", icon: BarChart3, component: Reports },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const currentComponent = navigationItems.find(item => item.id === activeSection)?.component || 
    (activeSection === "settings" ? Settings : Dashboard);
  const CurrentComponent = currentComponent;

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-4 flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              {/* Tu imagen de logo */}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6 p-3 bg-gradient-iron rounded-lg text-white">
            {/* ... (sin cambios) */}
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
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
          <div className="mt-auto pt-4 border-t border-border">
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
            {/* ... (sin cambios) ... */}
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