import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "Hoş Geldiniz!",
    content: "Sesli Lojistik Asistanı ile nakliyeci aramayı otomatikleştirin. Sadece 3 adımda sevkiyatınızı organize edin.",
    image: "📱"
  },
  {
    title: "1. Sevkiyat Bilgilerini Girin",
    content: "Güzergah, yük türü, tarih ve maksimum bütçenizi belirtin. Sistem size uygun nakliyecileri bulacak.",
    image: "📋"
  },
  {
    title: "2. Otomatik Arama",
    content: "AI asistanımız kayıtlı nakliyecileri otomatik olarak arar. Siz hiçbir şey yapmanız gerekmiyor!",
    image: "📞"
  },
  {
    title: "3. Teklifleri Karşılaştırın",
    content: "Gelen teklifleri karşılaştırın ve en uygun olanını seçin. Rezervasyon anında tamamlanır.",
    image: "✅"
  }
];

export const OnboardingTutorial = ({ isOpen, onClose }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{step.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="text-6xl">{step.image}</div>
          <p className="text-muted-foreground leading-relaxed">{step.content}</p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Geri
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {tutorialSteps.length}
          </span>
          
          <Button
            onClick={nextStep}
            className="flex items-center gap-2"
          >
            {currentStep === tutorialSteps.length - 1 ? "Başla" : "İleri"}
            {currentStep !== tutorialSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};