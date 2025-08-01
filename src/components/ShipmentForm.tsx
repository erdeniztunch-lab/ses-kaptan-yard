import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Package, Calendar, DollarSign, Truck } from "lucide-react";

interface ShipmentFormProps {
  onSubmit: (shipment: ShipmentRequest) => void;
}

export interface ShipmentRequest {
  fromCity: string;
  toCity: string;
  loadType: string;
  pickupDate: string;
  pickupTime: string;
  maxPrice: string;
  truckType: string;
  requirements: string;
}

const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Adana", "Gaziantep", "Konya", 
  "Şanlıurfa", "Mersin", "Diyarbakır", "Kayseri", "Eskişehir", "Trabzon"
];

const loadTypes = [
  "Genel Kargo", "Tekstil", "Gıda", "Soğutmalı", "ADR (Tehlikeli Madde)", 
  "Palet", "Dorse", "Araç Taşıma", "İnşaat Malzemesi"
];

const truckTypes = [
  "Kamyonet", "Kamyon", "Tır", "Soğutmalı Araç", "ADR Sertifikalı", 
  "Lowbed", "Tenteli", "Kapalı Kasa"
];

export const ShipmentForm = ({ onSubmit }: ShipmentFormProps) => {
  const [formData, setFormData] = useState<ShipmentRequest>({
    fromCity: "",
    toCity: "",
    loadType: "",
    pickupDate: "",
    pickupTime: "",
    maxPrice: "",
    truckType: "",
    requirements: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof ShipmentRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Yeni Sevkiyat Talebi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCity" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Nereden
              </Label>
              <Select value={formData.fromCity} onValueChange={(value) => updateField("fromCity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Çıkış şehri seçin" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toCity" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                Nereye
              </Label>
              <Select value={formData.toCity} onValueChange={(value) => updateField("toCity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Varış şehri seçin" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Load and Truck Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loadType">Yük Türü</Label>
              <Select value={formData.loadType} onValueChange={(value) => updateField("loadType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Yük türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {loadTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="truckType" className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Araç Türü
              </Label>
              <Select value={formData.truckType} onValueChange={(value) => updateField("truckType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Araç türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {truckTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date, Time and Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Yükleme Tarihi
              </Label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => updateField("pickupDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupTime">Saat</Label>
              <Input
                id="pickupTime"
                type="time"
                value={formData.pickupTime}
                onChange={(e) => updateField("pickupTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Maks. Fiyat (TL)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="0"
                value={formData.maxPrice}
                onChange={(e) => updateField("maxPrice", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Özel Gereksinimler</Label>
            <Textarea
              id="requirements"
              placeholder="SRC belgesi, K1/K2 lisansı, özel yükleme talimatları vb."
              value={formData.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg">
            Nakliyecileri Ara
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};