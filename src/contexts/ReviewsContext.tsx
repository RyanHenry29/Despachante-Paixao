import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { googleReviewsService } from "@/services/googleReviewsService";

interface ReviewsContextData {
  rating: number;
  totalReviews: number;
  placeName: string;
  loading: boolean;
  error: string | null;
}

const ReviewsContext = createContext<ReviewsContextData>({
  rating: 0,
  totalReviews: 0,
  placeName: "",
  loading: true,
  error: null,
});

const POLL_INTERVAL = 60 * 60 * 1000;

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ReviewsContextData>({
    rating: 0,
    totalReviews: 0,
    placeName: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await googleReviewsService.fetchReviews();
        if (!mounted) return;
        setData({
          rating: result.rating,
          totalReviews: result.totalReviews,
          placeName: result.placeName,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!mounted) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Erro ao carregar avaliações",
        }));
      }
    }

    load();

    const interval = setInterval(load, POLL_INTERVAL);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <ReviewsContext.Provider value={data}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
