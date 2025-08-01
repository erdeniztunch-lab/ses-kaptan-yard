import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, PhoneCall, MessageSquare, CheckCircle, Clock, X, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Carrier {
  id: string;
  name: string;
  phone: string;
  license: string;
  rating: number;
  status: "pending" | "calling" | "answered" | "unavailable" | "interested" | "failed";
  response?: {
    available: boolean;
    price?: number;
    notes?: string;
    estimatedPickup?: string;
  };
}

interface CallMonitorProps {
  shipmentId: string;
  carriers: Carrier[];
  onCarrierUpdate: (carrierId: string, updates: Partial<Carrier>) => void;
  onSendWhatsApp: (carrierId: string) => void;
}

const mockCarriers: Carrier[] = [
  {
    id: "1",
    name: "Anadolu Nakliyat",
    phone: "+90 532 123 4567",
    license: "SRC-34",
    rating: 4.8,
    status: "calling"
  },
  {
    id: "2", 
    name: "Güneş Lojistik",
    phone: "+90 542 987 6543",
    license: "K1-06",
    rating: 4.5,
    status: "pending"
  },
  {
    id: "3",
    name: "Marmara Taşımacılık",
    phone: "+90 555 111 2222",
    license: "SRC-34",
    rating: 4.9,
    status: "answered",
    response: {
      available: true,
      price: 1200,
      notes: "Yarın sabah 08:00'da yüklenebilir",
      estimatedPickup: "2024-01-16 08:00"
    }
  },
  {
    id: "4",
    name: "Boğaziçi Kargo",
    phone: "+90 533 444 5555",
    license: "K2-34",
    rating: 4.2,
    status: "unavailable"
  },
  {
    id: "5",
    name: "Doğu Express",
    phone: "+90 544 777 8888",
    license: "SRC-27",
    rating: 4.6,
    status: "interested",
    response: {
      available: true,
      price: 1150,
      notes: "Dönüş yükü var, fiyat müsait",
      estimatedPickup: "2024-01-16 10:00"
    }
  }
];

export const CallMonitor = ({ shipmentId, onCarrierUpdate, onSendWhatsApp }: CallMonitorProps) => {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [callProgress, setCallProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Simulate call progress
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCallProgress(prev => {
          if (prev >= 100) {
            setIsActive(false);
            return 100;
          }
          return prev + 2;
        });
      }, 500);

      // Simulate carrier responses
      const responseTimeout = setTimeout(() => {
        setCarriers(prev => prev.map(carrier => {
          if (carrier.status === "pending") {
            return { ...carrier, status: "calling" };
          }
          return carrier;
        }));
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(responseTimeout);
      };
    }
  }, [isActive]);

  const getStatusIcon = (status: Carrier["status"]) => {
    switch (status) {
      case "calling":
        return <Phone className="h-4 w-4 animate-pulse text-warning" />;
      case "answered":
        return <PhoneCall className="h-4 w-4 text-accent" />;
      case "interested":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "unavailable":
        return <X className="h-4 w-4 text-destructive" />;
      case "failed":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Carrier["status"]) => {
    const variants = {
      pending: "secondary",
      calling: "warning",
      answered: "success", 
      interested: "success",
      unavailable: "destructive",
      failed: "secondary"
    } as const;

    const labels = {
      pending: "Bekliyor",
      calling: "Arıyor",
      answered: "Cevapladı",
      interested: "İlgileniyor",
      unavailable: "Müsait Değil",
      failed: "Başarısız"
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status]}
      </Badge>
    );
  };

  const startCalls = () => {
    setIsActive(true);
    setCallProgress(0);
  };

  const interestedCarriers = carriers.filter(c => c.status === "interested");
  const respondedCarriers = carriers.filter(c => c.status === "answered" || c.status === "interested");

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Sesli Arama Durumu
            </span>
            {!isActive && (
              <Button onClick={startCalls} variant="hero" size="sm">
                Aramaları Başlat
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>İlerleme: {carriers.length} nakliyeci</span>
              <span>{respondedCarriers.length} cevap alındı</span>
            </div>
            <Progress value={callProgress} className="h-2" />
            {interestedCarriers.length > 0 && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <p className="text-sm font-medium text-accent-foreground">
                  ✅ {interestedCarriers.length} nakliyeci ilgileniyor!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Carriers List */}
      <div className="grid gap-4">
        {carriers.map((carrier) => (
          <Card key={carrier.id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(carrier.status)}
                  <div>
                    <h3 className="font-medium">{carrier.name}</h3>
                    <p className="text-sm text-muted-foreground">{carrier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{carrier.license}</Badge>
                  {getStatusBadge(carrier.status)}
                </div>
              </div>

              {carrier.response && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Fiyat: </span>
                      <span className="text-accent font-bold">{carrier.response.price} TL</span>
                    </div>
                    <div>
                      <span className="font-medium">Yükleme: </span>
                      <span>{carrier.response.estimatedPickup}</span>
                    </div>
                  </div>
                  {carrier.response.notes && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      "{carrier.response.notes}"
                    </p>
                  )}
                  {carrier.status === "interested" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="success" className="flex-1">
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Pazarlık
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {carrier.status === "failed" && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onSendWhatsApp(carrier.id)}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Gönder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};