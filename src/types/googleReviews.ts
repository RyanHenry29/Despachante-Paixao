export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string;
  authorUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
  time: number;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
  placeName: string;
}

export interface GoogleBusinessInfo {
  name: string;
  rating: number;
  totalRatings: number;
  reviews: GoogleReview[];
}

export interface GooglePlaceSearchResponse {
  places?: Array<{
    id: string;
    displayName?: {
      text: string;
      languageCode: string;
    };
  }>;
}

export interface GooglePlaceDetailsResponse {
  id?: string;
  displayName?: {
    text: string;
    languageCode: string;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: Array<{
    name?: string;
    relativePublishTimeDescription?: string;
    text?: {
      text: string;
      languageCode: string;
    };
    originalText?: {
      text: string;
      languageCode: string;
    };
    rating?: number;
    authorAttribution?: {
      displayName: string;
      photoUri: string;
      uri: string;
    };
    publishTime?: string;
  }>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
