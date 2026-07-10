// Google Analytics 4 — carregado sob demanda, só depois que o visitante
// aceita os cookies no banner de consentimento (LGPD). Nunca carrega
// automaticamente na primeira visita.

const GA_MEASUREMENT_ID = "G-DMFFWHBB23";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let gaLoaded = false;

export function loadGoogleAnalytics(): void {
  if (gaLoaded || typeof window === "undefined") return;
  gaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!gaLoaded || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
