import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Clock, CheckCircle2, Shield, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface CarrierResponse {
  id: string;
  name: string;
  phone: string;
  status: "calling" | "pending" | "accepted" | "unavailable" | "no-answer";
  price?: number;
  availableTime?: string;
  responseTime?: number;
  hasLicense: boolean;
  rating?: number;
  completedJobs?: number;
}

interface CarrierResponseCardProps {
  carrier: CarrierResponse;
  onBook: (carrierId: string) => void;
  onCallAgain: (carrierId: string) => void;
  onSendWhatsApp: (carrierId: string) => void;
}

export const CarrierResponseCard = ({ 
  carrier, 
  onBook, 
  onCallAgain, 
  onSendWhatsApp 
}: CarrierResponseCardProps) => {
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const handleBook = async () => {
    setIsBooking(true);
    try {
      await onBook(carrier.id);
      toast({
        title: "Rezervasyon Tamamlandı",
        description: `${carrier.name} ile sevkiyat rezerve edildi.`,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getStatusBadge = () => {
    switch (carrier.status) {
      case "calling":
        return <Badge variant="calling">Aranıyor</Badge>;
      case "pending":
        return <Badge variant="pending">Bekliyor</Badge>;
      case "accepted":
        return <Badge variant="accepted">Teklif Verdi</Badge>;
      case "unavailable":
        return <Badge variant="unavailable">Müsait Değil</Badge>;
      case "no-answer":
        return <Badge variant="outline">Cevapsız</Badge>;
      default:
        return null;
    }
  };

  const canBook = carrier.status === "accepted" && carrier.price;
  const canRetry = carrier.status === "no-answer" || carrier.status === "unavailable";

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      carrier.status === "accepted" && "ring-2 ring-accent ring-opacity-50",
      carrier.status === "calling" && "animate-pulse"
    )}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h3 className="font-semibold text-base">{carrier.name}</h3>
              <p className="text-sm text-muted-foreground">{carrier.phone}</p>
            </div>
            {carrier.hasLicense && (
              <div title="SRC Sertifikalı">
                <Shield className="h-4 w-4 text-accent" />
              </div>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Response Details */}
        {carrier.status === "accepted" && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{carrier.price?.toLocaleString()} ₺</p>
              <p className="text-xs text-muted-foreground">Teklif Edilen Fiyat</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{carrier.availableTime}</p>
              <p className="text-xs text-muted-foreground">Müsait Zaman</p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {carrier.responseTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{Math.floor(carrier.responseTime / 60)}dk {carrier.responseTime % 60}sn</span>
            </div>
          )}
          {carrier.rating && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{carrier.rating}/5 ({carrier.completedJobs} iş)</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canBook && (
            <Button 
              onClick={handleBook}
              disabled={isBooking}
              className="flex-1 h-12 text-base font-semibold"
              variant="default"
            >
              {isBooking ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                  Rezerve Ediliyor...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Rezerve Et
                </>
              )}
            </Button>
          )}
          
          {canRetry && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCallAgain(carrier.id)}
                className="flex-1"
              >
                <Phone className="mr-2 h-4 w-4" />
                Tekrar Ara
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSendWhatsApp(carrier.id)}
                className="flex-1"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};