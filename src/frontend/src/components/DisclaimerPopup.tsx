import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "disclaimer_accepted";

export function DisclaimerPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-ocid="disclaimer.modal"
    >
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Important Disclaimer</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Disclaimer: This app is an informational platform connecting
            patients with independent nurses. It is{" "}
            <strong>NOT a substitute for professional medical advice</strong> or
            emergency services. In case of emergency, call{" "}
            <span className="inline-flex items-center gap-1 font-bold text-destructive text-base">
              <Phone size={14} /> 108
            </span>{" "}
            or visit the nearest Government Hospital. The app owners are not
            responsible for treatments provided.
          </p>

          <div className="bg-muted rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              అత్యవసర పరిస్థితుల్లో దయచేసి{" "}
              <span className="font-bold text-destructive">108</span> కి కాల్ చేయండి
              లేదా సమీప ప్రభుత్వ ఆసుపత్రిని సంప్రదించండి.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleAccept}
            className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="disclaimer.confirm_button"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
