import type {
  GoogleReview,
  GooglePlaceDetailsResponse,
  GoogleReviewsResponse,
  CacheEntry,
} from "@/types/googleReviews";

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reviews`
  : null;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

const CACHE_KEY = "despachante_google_reviews_cache";
const CACHE_TTL = 30 * 60 * 1000;

let inflightPromise: Promise<GoogleReviewsResponse> | null = null;

function sanitizeString(value: string | null | undefined, maxLength = 5000): string {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, "").slice(0, maxLength);
}

function sanitizeNumber(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || isNaN(value)) return fallback;
  return value;
}

function parseRelativeTime(publishTime?: string): string {
  if (!publishTime) return "Recente";
  try {
    const published = new Date(publishTime).getTime();
    const now = Date.now();
    const diffMs = now - published;
    if (diffMs < 0) return "Recente";
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "há menos de 1 minuto";
    if (diffMinutes < 60) return `há ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 30) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    if (diffWeeks < 5) return `há ${diffWeeks} semana${diffWeeks > 1 ? "s" : ""}`;
    if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? "es" : ""}`;
    return `há ${diffYears} ano${diffYears > 1 ? "s" : ""}`;
  } catch {
    return "Recente";
  }
}

function parsePlaceDetails(data: GooglePlaceDetailsResponse): GoogleReviewsResponse {
  const reviews: GoogleReview[] = (data.reviews ?? [])
    .filter((r) => r && typeof r === "object" && typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5)
    .map((r) => ({
      authorName: sanitizeString(r.authorAttribution?.displayName, 100) || "Usuário do Google",
      authorPhotoUrl: sanitizeString(r.authorAttribution?.photoUri, 500),
      authorUrl: sanitizeString(r.authorAttribution?.uri, 1000),
      rating: r.rating,
      text: sanitizeString(r.text?.text || r.originalText?.text, 5000),
      relativeTime: parseRelativeTime(r.publishTime) || sanitizeString(r.relativePublishTimeDescription, 100) || "Recente",
      time: r.publishTime ? new Date(r.publishTime).getTime() : 0,
    }));

  return {
    reviews,
    rating: sanitizeNumber(data.rating, 0),
    totalReviews: sanitizeNumber(data.userRatingCount, 0),
    placeName: sanitizeString(data.displayName?.text, 200) || "Despachante Paixão",
  };
}

function getFromCache(): GoogleReviewsResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry<GoogleReviewsResponse> = JSON.parse(raw);
    if (Date.now() - entry.timestamp < entry.ttl) {
      return entry.data;
    }

    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCache(data: GoogleReviewsResponse): void {
  try {
    const entry: CacheEntry<GoogleReviewsResponse> = {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Cache write failures are non-critical
  }
}

export const googleReviewsService = {
  async fetchReviews(): Promise<GoogleReviewsResponse> {
    const cached = getFromCache();
    if (cached) return cached;

    if (inflightPromise) return inflightPromise;

    if (!EDGE_FUNCTION_URL) {
      return { reviews: [], rating: 0, totalReviews: 0, placeName: "Despachante Paixão" };
    }

    inflightPromise = (async () => {
      try {
        const res = await fetch(EDGE_FUNCTION_URL, {
          headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: GooglePlaceDetailsResponse = await res.json();
        const parsed = parsePlaceDetails(data);
        setCache(parsed);
        return parsed;
      } catch {
        return { reviews: [], rating: 0, totalReviews: 0, placeName: "Despachante Paixão" };
      } finally {
        inflightPromise = null;
      }
    })();

    return inflightPromise;
  },
};

