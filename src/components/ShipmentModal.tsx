import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Calendar, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const shipmentSchema = z.object({
  fromCity: z.string().min(1, "Çıkış şehri gerekli"),
  toCity: z.string().min(1, "Varış şehri gerekli"),
  loadType: z.string().min(1, "Yük türü gerekli"),
  pickupDate: z.string().min(1, "Yükleme tarihi gerekli"),
  pickupTime: z.string().min(1, "Yükleme saati gerekli"),
  maxPrice: z.string().min(1, "Maksimum fiyat gerekli"),
  requirements: z.string().optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShipmentFormData) => void;
}

const STEPS = [
  { id: 1, title: "Güzergah & Araç", icon: MapPin },
  { id: 2, title: "Yük Bilgileri", icon: Package },
  { id: 3, title: "Zaman & Bütçe", icon: Calendar },
  { id: 4, title: "Onay", icon: CheckCircle },
];

const POPULAR_ROUTES = [
  { from: "İstanbul", to: "Gaziantep" },
  { from: "İstanbul", to: "Ankara" },
  { from: "İzmir", to: "İstanbul" },
  { from: "Bursa", to: "Gaziantep" },
];

const LOAD_TYPES = [
  "Genel Kargo",
  "Palet",
  "Soğuk Zincir",
  "Tekstil",
  "Otomotiv",
  "İnşaat",
  "Kimyasal",
  "Tehlikeli Madde",
];

export const ShipmentModal = ({ isOpen, onClose, onSubmit }: ShipmentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      fromCity: "",
      toCity: "",
      loadType: "",
      pickupDate: "",
      pickupTime: "",
      maxPrice: "",
      requirements: "",
    },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: ShipmentFormData) => {
    onSubmit(data);
    onClose();
    setCurrentStep(1);
    form.reset();
  };

  const applyQuickRoute = (route: { from: string; to: string }) => {
    form.setValue("fromCity", route.from);
    form.setValue("toCity", route.to);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Popüler Güzergahlar</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {POPULAR_ROUTES.map((route, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickRoute(route)}
                    className="justify-start text-sm"
                  >
                    {route.from} → {route.to}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromCity">Nereden</Label>
                <Input
                  id="fromCity"
                  placeholder="İstanbul"
                  {...form.register("fromCity")}
                />
              </div>
              <div>
                <Label htmlFor="toCity">Nereye</Label>
                <Input
                  id="toCity"
                  placeholder="Gaziantep"
                  {...form.register("toCity")}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Yük Türü</Label>
              <Select onValueChange={(value) => form.setValue("loadType", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Yük türünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {LOAD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="requirements">Özel Gereksinimler</Label>
              <Textarea
                id="requirements"
                placeholder="SRC belgeli araç, soğuk zincir, vb."
                className="mt-2"
                {...form.register("requirements")}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Yükleme Tarihi</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  {...form.register("pickupDate")}
                />
              </div>
              <div>
                <Label htmlFor="pickupTime">Yükleme Saati</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  {...form.register("pickupTime")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxPrice">Maksimum Bütçe (TL)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="5000"
                {...form.register("maxPrice")}
              />
            </div>
          </div>
        );

      case 4:
        const watchedValues = form.watch();
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sevkiyat Özeti</h3>
            
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Güzergah:</span>
                <span>{watchedValues.fromCity} → {watchedValues.toCity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Yük Türü:</span>
                <span>{watchedValues.loadType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Yükleme:</span>
                <span>{watchedValues.pickupDate} {watchedValues.pickupTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Maksimum Bütçe:</span>
                <span className="font-semibold text-primary">{watchedValues.maxPrice} TL</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Yeni Sevkiyat Oluştur</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={cn(
                  "text-sm font-medium",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-4" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {renderStepContent()}

          <div className="flex justify-between pt-6 border-t border-border mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Geri
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext}>
                İleri
              </Button>
            ) : (
              <Button type="submit" className="bg-primary">
                Aramayı Başlat
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};