import { Navigation } from "@/components/ui/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";

const Index = () => {
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

          {/* Navigation placeholder - will be enhanced */}
          <div className="space-y-2">
            {[
              { label: "Dashboard", active: true },
              { label: "Socios", active: false },
              { label: "Reservas", active: false },
              { label: "Pagos", active: false },
              { label: "Reportes", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  item.active 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-card-foreground">Dashboard Principal</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Último acceso: Hoy, 14:32
              </div>
              <div className="h-8 w-8 bg-gradient-iron rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-6 bg-background overflow-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
