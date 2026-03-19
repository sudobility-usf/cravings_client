/**
 * Branded type alias for Firebase ID tokens used to authenticate API requests.
 *
 * All protected endpoints require a valid Firebase ID token passed in the
 * `Authorization: Bearer <token>` header. Obtain this token from
 * `firebase.auth().currentUser.getIdToken()`.
 */
export type FirebaseIdToken = string;

/**
 * Default stale time for TanStack Query hooks (5 minutes).
 *
 * Cached data is considered fresh for this duration. Queries will not
 * refetch in the background while data is still fresh.
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Default garbage collection time for TanStack Query hooks (30 minutes).
 *
 * Inactive cached data is kept in memory for this duration before being
 * garbage collected. This allows instant restoration when a component
 * remounts within the window.
 */
export const DEFAULT_GC_TIME = 30 * 60 * 1000;

/**
 * Type-safe cache key factory for TanStack Query.
 *
 * Provides structured, deterministic query keys used internally by all hooks
 * and available for consumers who need manual cache invalidation or prefetching.
 *
 * @example
 * ```typescript
 * import { QUERY_KEYS } from '@sudobility/cravings_client';
 *
 * // Manual invalidation
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.histories(userId) });
 *
 * // Prefetching
 * queryClient.prefetchQuery({ queryKey: QUERY_KEYS.historiesTotal() });
 * ```
 */
/**
 * A restaurant result returned from the search endpoint.
 */
export interface Restaurant {
  /** Display name of the restaurant */
  name: string;
  /** Street address of the restaurant */
  address: string;
  /** Distance from the search location */
  distance: string;
}

export const QUERY_KEYS = {
  /** Cache key for a user's history list. */
  histories: (userId: string) => ['starter', 'histories', userId] as const,
  /** Cache key for the global histories total (public endpoint). */
  historiesTotal: () => ['starter', 'histories', 'total'] as const,
  /** Cache key for a user profile. */
  user: (userId: string) => ['starter', 'user', userId] as const,
  /** Cache key for a restaurant search result (keyed by location + dish). */
  restaurantSearch: (location: string, dish: string) =>
    ['cravings', 'restaurant-search', location, dish] as const,
} as const;
