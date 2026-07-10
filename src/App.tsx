import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CookieConsent from "@/components/CookieConsent";
import { ReviewsProvider } from "@/contexts/ReviewsContext";

// Páginas raramente visitadas: carregadas sob demanda (code-splitting) para
// não pesar o carregamento inicial da home, que é o caso mais comum.
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReviewsProvider>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </BrowserRouter>
    </ReviewsProvider>
  </QueryClientProvider>
);

export default App;
