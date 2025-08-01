import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShipmentForm, ShipmentRequest } from "./ShipmentForm";
import { CallMonitor } from "./CallMonitor";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Phone, Clock, CheckCircle2, TrendingUp, Users } from "lucide-react";

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

  const handleShipmentSubmit = (shipment: ShipmentRequest) => {
    setCurrentShipment(shipment);
    setView("monitor");
  };

  const handleNewShipment = () => {
    setCurrentShipment(null);
    setView("form");
  };

  const handleCarrierUpdate = (carrierId: string, updates: any) => {
    console.log("Updating carrier:", carrierId, updates);
  };

  const handleSendWhatsApp = (carrierId: string) => {
    console.log("Sending WhatsApp to:", carrierId);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sesli Lojistik Asistanı</h1>
            <p className="text-primary-foreground/80">Nakliyecilerinizi otomatik arayın, hızla kapasite bulun</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">Hoş geldiniz</p>
            <p className="font-semibold">Ahmet Bey</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockStats.totalShipments}</p>
                <p className="text-xs text-muted-foreground">Toplam Sevkiyat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <div>
                <p className="text-2xl font-bold">%{mockStats.successRate}</p>
                <p className="text-xs text-muted-foreground">Başarı Oranı</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <div>
                <p className="text-2xl font-bold">{mockStats.avgResponseTime}dk</p>
                <p className="text-xs text-muted-foreground">Ort. Cevap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{mockStats.totalCarriers}</p>
                <p className="text-xs text-muted-foreground">Nakliyeci</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockStats.todayCalls}</p>
                <p className="text-xs text-muted-foreground">Bugün Arama</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <div>
                <p className="text-2xl font-bold">{mockStats.completedBookings}</p>
                <p className="text-xs text-muted-foreground">Tamamlanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Shipment Info */}
      {currentShipment && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="success">Aktif</Badge>
                <div>
                  <h3 className="font-semibold">
                    {currentShipment.fromCity} → {currentShipment.toCity}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentShipment.loadType} • {currentShipment.pickupDate} {currentShipment.pickupTime} • Maks. {currentShipment.maxPrice} TL
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewShipment}>
                Yeni Sevkiyat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {view === "form" ? (
            <ShipmentForm onSubmit={handleShipmentSubmit} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sevkiyat Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Güzergah</p>
                  <p className="text-sm text-muted-foreground">{currentShipment?.fromCity} → {currentShipment?.toCity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Yük Türü</p>
                  <p className="text-sm text-muted-foreground">{currentShipment?.loadType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Yükleme</p>
                  <p className="text-sm text-muted-foreground">{currentShipment?.pickupDate} {currentShipment?.pickupTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Maksimum Bütçe</p>
                  <p className="text-sm text-accent font-bold">{currentShipment?.maxPrice} TL</p>
                </div>
                {currentShipment?.requirements && (
                  <div>
                    <p className="text-sm font-medium">Gereksinimler</p>
                    <p className="text-sm text-muted-foreground">{currentShipment.requirements}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full" onClick={handleNewShipment}>
                  Yeni Sevkiyat Oluştur
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {view === "monitor" && currentShipment ? (
            <CallMonitor
              shipmentId="1"
              carriers={[]}
              onCarrierUpdate={handleCarrierUpdate}
              onSendWhatsApp={handleSendWhatsApp}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Phone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sesli Arama Hazır</h3>
                <p className="text-muted-foreground">
                  Sevkiyat bilgilerini girin ve nakliyecilerinizi otomatik olarak arayalım.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};