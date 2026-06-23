import type {
  GoogleReview,
  GooglePlaceSearchResponse,
  GooglePlaceDetailsResponse,
  GoogleReviewsResponse,
  CacheEntry,
} from "@/types/googleReviews";

const API_BASE = "https://places.googleapis.com/v1";
const CACHE_KEY = "despachante_google_reviews_cache";
const CACHE_TTL = 30 * 60 * 1000;
const PLACE_ID = "ChIJjf_y6uGJzpQRzJYssyNyLZg";
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const LOG_PREFIX = "[GoogleReviewsService]";

enum LogEvent {
  SEARCH_PLACE_START = "SEARCH_PLACE_START",
  SEARCH_PLACE_SUCCESS = "SEARCH_PLACE_SUCCESS",
  PLACE_DETAILS_SUCCESS = "PLACE_DETAILS_SUCCESS",
  CACHE_HIT = "CACHE_HIT",
  CACHE_MISS = "CACHE_MISS",
  API_ERROR = "API_ERROR",
}

function structuredLog(event: LogEvent, data?: Record<string, unknown>): void {
}

function getApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new Error("VITE_GOOGLE_PLACES_API_KEY nao definida. Configure no .env");
  }
  return key;
}

function sanitizeString(value: string | null | undefined, maxLength = 5000): string {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, "").slice(0, maxLength);
}

function sanitizeNumber(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || isNaN(value)) return fallback;
  return value;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries: number): Promise<Response> {
  let lastError: Error | null = null;
  let delay = INITIAL_RETRY_DELAY;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, REQUEST_TIMEOUT);
      if (response.ok) return response;

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const body = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${body}`);
      }

      if (attempt < retries) {
        structuredLog(LogEvent.API_ERROR, { status: response.status, attempt: attempt + 1, retries });
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      } else {
        const body = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${body}`);
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        structuredLog(LogEvent.API_ERROR, { message: lastError.message, attempt: attempt + 1 });
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
  }

  throw lastError ?? new Error("Falha na requisicao apos retries");
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
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    if (diffWeeks < 5) return `há ${diffWeeks} semana${diffWeeks > 1 ? "s" : ""}`;
    if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? "es" : ""}`;
    return `há ${diffYears} ano${diffYears > 1 ? "s" : ""}`;
  } catch {
    return "Recente";
  }
}

async function searchPlaceId(apiKey: string): Promise<string> {
  structuredLog(LogEvent.SEARCH_PLACE_START);

  const url = `${API_BASE}/places:searchText`;
  const response = await fetchWithRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({
        textQuery: "Despachante Paixão Guarulhos",
        languageCode: "pt-BR",
      }),
    },
    MAX_RETRIES
  );

  const data: GooglePlaceSearchResponse = await response.json();

  if (!data.places || data.places.length === 0) {
    throw new Error("Nenhum Place ID encontrado para a busca");
  }

  const placeId = data.places[0].id;
  if (!placeId || typeof placeId !== "string") {
    throw new Error("Place ID invalido retornado pela API");
  }

  structuredLog(LogEvent.SEARCH_PLACE_SUCCESS, { placeId });
  return placeId;
}

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<GooglePlaceDetailsResponse> {
  const url = `${API_BASE}/places/${encodeURIComponent(placeId)}`;
  const response = await fetchWithRetry(
    url,
    {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews.name,reviews.relativePublishTimeDescription,reviews.text,reviews.originalText,reviews.rating,reviews.authorAttribution,reviews.publishTime",
      },
    },
    MAX_RETRIES
  );

  const data: GooglePlaceDetailsResponse = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Resposta invalida da API Places");
  }

  structuredLog(LogEvent.PLACE_DETAILS_SUCCESS, { placeId });
  return data;
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
    const elapsed = Date.now() - entry.timestamp;

    if (elapsed < entry.ttl) {
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
  }
}

export const googleReviewsService = {
  async fetchReviews(): Promise<GoogleReviewsResponse> {
    const cached = getFromCache();
    if (cached) {
      structuredLog(LogEvent.CACHE_HIT);
      return cached;
    }

    structuredLog(LogEvent.CACHE_MISS);

    const apiKey = getApiKey();
    const details = await fetchPlaceDetails(PLACE_ID, apiKey);
    const parsed = parsePlaceDetails(details);

    setCache(parsed);
    return parsed;
  },
};
