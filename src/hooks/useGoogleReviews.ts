import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { googleReviewsService } from "@/services/googleReviewsService";
import { useReviews } from "@/contexts/ReviewsContext";
import type { GoogleReview } from "@/types/googleReviews";

const POLL_INTERVAL_MS = 60 * 60 * 1000;

export interface UseGoogleReviewsResult {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
  placeName: string;
  loading: boolean;
  error: string | null;
  observerRef: (node: HTMLElement | null) => void;
  refetch: () => void;
}

export function useGoogleReviews(): UseGoogleReviewsResult {
  const { setReviewsData } = useReviews();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [placeName, setPlaceName] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchedRef = useRef(false);
  const fetchingRef = useRef(false);

  const load = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await googleReviewsService.fetchReviews();
      setReviews(result.reviews);
      setRating(result.rating);
      setTotalReviews(result.totalReviews);
      setPlaceName(result.placeName);
      setReviewsData({
        rating: result.rating,
        totalReviews: result.totalReviews,
        placeName: result.placeName,
        reviews: result.reviews,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar avaliações");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [setReviewsData]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !fetchedRef.current) {
        setShouldFetch(true);
      }
    },
    []
  );

  const setObserverNode = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (node) {
        const observer = new IntersectionObserver(handleIntersection, {
          rootMargin: "200px",
          threshold: 0,
        });
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [handleIntersection]
  );

  useEffect(() => {
    if (!shouldFetch || fetchedRef.current) return;
    fetchedRef.current = true;
    load();
  }, [shouldFetch, load]);

  useEffect(() => {
    if (!fetchedRef.current) return;
    const interval = setInterval(() => {
      load();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const result = useMemo(
    () => ({
      reviews,
      rating,
      totalReviews,
      placeName,
      loading,
      error,
      observerRef: setObserverNode,
      refetch: load,
    }),
    [reviews, rating, totalReviews, placeName, loading, error, setObserverNode, load]
  );

  return result;
}
