import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { GoogleReview } from "@/types/googleReviews";

interface ReviewsContextData {
  rating: number;
  totalReviews: number;
  placeName: string;
  loading: boolean;
  error: string | null;
}

interface ReviewsContextValue extends ReviewsContextData {
  setReviewsData: (data: {
    rating: number;
    totalReviews: number;
    placeName: string;
    reviews: GoogleReview[];
  }) => void;
}

const ReviewsContext = createContext<ReviewsContextValue>({
  rating: 0,
  totalReviews: 0,
  placeName: "",
  loading: true,
  error: null,
  setReviewsData: () => {},
});

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ReviewsContextData>({
    rating: 0,
    totalReviews: 0,
    placeName: "",
    loading: false,
    error: null,
  });

  const setReviewsData = useCallback(
    (result: { rating: number; totalReviews: number; placeName: string }) => {
      setData({
        rating: result.rating,
        totalReviews: result.totalReviews,
        placeName: result.placeName,
        loading: false,
        error: null,
      });
    },
    []
  );

  return (
    <ReviewsContext.Provider value={{ ...data, setReviewsData }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
