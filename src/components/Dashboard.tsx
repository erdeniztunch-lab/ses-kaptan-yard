import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShipmentRequest } from "./ShipmentForm";
import { CallMonitor } from "./CallMonitor";
import { Badge } from "@/components/ui/badge";
import { OnboardingTutorial } from "./OnboardingTutorial";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MetricCard } from "./MetricCard";
import { ShipmentModal } from "./ShipmentModal";
import { 
  BarChart3, 
  Phone, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Plus,
  Truck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalShipments: number;
  successRate: number;
  avgResponseTime: number;
  totalCarriers: number;
  todayCalls: number;
  completedBookings: number;
}

const mockStats: DashboardStats = {
  totalShipments: 127,
  successRate: 78,
  avgResponseTime: 12,
  totalCarriers: 45,
  todayCalls: 23,
  completedBookings: 18
};

export const Dashboard = () => {
  const [currentShipment, setCurrentShipment] = useState<ShipmentRequest | null>(null);
  const [view, setView] = useState<"form" | "monitor">("form");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const { toast } = useToast();

  // Show onboarding for first-time users (check localStorage)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const handleShipmentSubmit = (shipment: ShipmentRequest) => {
    setCurrentShipment(shipment);
    setView("monitor");
    setShowShipmentModal(false);
    toast({
      title: "Sevkiyat Oluşturuldu",
      description: `${shipment.fromCity} → ${shipment.toCity} güzergahı için nakliyeciler aranıyor.`,
    });
  };

  const handleNewShipment = () => {
    setCurrentShipment(null);
    setView("form");
    setShowShipmentModal(true);
  };

  const handleCarrierUpdate = (carrierId: string, updates: any) => {
    console.log("Updating carrier:", carrierId, updates);
  };

  const handleSendWhatsApp = (carrierId: string) => {
    console.log("Sending WhatsApp to:", carrierId);
    toast({
      title: "WhatsApp Gönderildi",
      description: "Nakliyeciye WhatsApp mesajı gönderildi.",
    });
  };

  const metricsData = [
    {
      title: "Toplam Sevkiyat",
      value: mockStats.totalShipments,
      icon: BarChart3,
      variant: "primary" as const,
      trend: {
        direction: "up" as const,
        value: "+12%",
        label: "Son aya göre"
      }
    },
    {
      title: "Başarı Oranı",
      value: `%${mockStats.successRate}`,
      icon: TrendingUp,
      variant: "success" as const,
      trend: {
        direction: "up" as const,
        value: "+5%",
        label: "Son haftaya göre"
      }
    },
    {
      title: "Ort. Cevap Süresi",
      value: `${mockStats.avgResponseTime}dk`,
      icon: Clock,
      variant: "warning" as const
    },
    {
      title: "Aktif Nakliyeci",
      value: mockStats.totalCarriers,
      icon: Users,
      variant: "default" as const
    },
    {
      title: "Bugün Arama",
      value: mockStats.todayCalls,
      icon: Phone,
      variant: "primary" as const
    },
    {
      title: "Tamamlanan",
      value: mockStats.completedBookings,
      icon: CheckCircle2,
      variant: "success" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Current Shipment Status */}
          {currentShipment && (
            <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-lg">
                    <Truck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="accepted">Aktif Sevkiyat</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">
                      {currentShipment.fromCity} → {currentShipment.toCity}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentShipment.loadType} • {currentShipment.pickupDate} {currentShipment.pickupTime} • 
                      <span className="font-medium text-primary"> Maks. {currentShipment.maxPrice} TL</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleNewShipment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Sevkiyat
                </Button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!currentShipment && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="p-6 bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Truck className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sevkiyat Yönetimi</h3>
                <p className="text-muted-foreground mb-6">
                  Yeni bir sevkiyat oluşturun ve nakliyecilerinizi otomatik olarak arayalım.
                </p>
                <Button 
                  onClick={() => setShowShipmentModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Sevkiyat Oluştur
                </Button>
              </div>
            </div>
          )}

          {/* Call Monitor */}
          {view === "monitor" && currentShipment && (
            <CallMonitor
              shipmentId="1"
              carriers={[]}
              onCarrierUpdate={handleCarrierUpdate}
              onSendWhatsApp={handleSendWhatsApp}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ShipmentModal
        isOpen={showShipmentModal}
        onClose={() => setShowShipmentModal(false)}
        onSubmit={handleShipmentSubmit}
      />

      <OnboardingTutorial 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </div>
  );
};