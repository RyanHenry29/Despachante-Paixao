import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { loadGoogleAnalytics } from "@/services/analyticsService";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      loadGoogleAnalytics();
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadGoogleAnalytics();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-border shadow-2xl" role="alert">
      <div className="container-custom py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies essenciais e do Google Analytics para melhorar sua experiência.{" "}
              <a href="/privacidade" className="text-accent hover:underline whitespace-nowrap">
                Saiba mais
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={refuse}
              className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Recusar
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors shadow-sm"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
