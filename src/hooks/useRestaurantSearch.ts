import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { NetworkClient, Optional } from '@sudobility/cravings_types';
import type { Restaurant } from '../types';
import { StarterClient } from '../network/StarterClient';
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME, QUERY_KEYS } from '../types';

const EMPTY_RESTAURANTS: Restaurant[] = [];

/**
 * Configuration for the {@link useRestaurantSearch} hook.
 */
export interface UseRestaurantSearchConfig {
  /** A {@link NetworkClient} implementation for HTTP requests. */
  networkClient: NetworkClient;
  /** The base URL of the Cravings API. */
  baseUrl: string;
  /** The location to search near (e.g., "San Francisco"). */
  location: string;
  /** The dish to search for (e.g., "tacos"). */
  dish: string;
  /** Whether the query should execute. Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Return type for the {@link useRestaurantSearch} hook.
 */
export interface UseRestaurantSearchReturn {
  /** The list of matching restaurants, or an empty array if not yet loaded. */
  restaurants: Restaurant[];
  /** Whether the query is currently loading. */
  isLoading: boolean;
  /** An error message if the query failed, or `null` if no error. */
  error: Optional<string>;
  /** Function to manually trigger a refetch. */
  refetch: () => void;
}

/**
 * TanStack Query hook that searches for restaurants by location and dish.
 *
 * Uses a public endpoint — no authentication required.
 * Results are cached by `(location, dish)` key pair.
 *
 * The query is disabled when `location` or `dish` is empty, or when
 * `config.enabled` is `false`.
 *
 * @param config - Hook configuration (see {@link UseRestaurantSearchConfig})
 * @returns An object containing restaurants, loading state, error, and refetch
 *
 * @example
 * ```typescript
 * import { useRestaurantSearch } from '@sudobility/cravings_client';
 *
 * function SearchResults() {
 *   const { restaurants, isLoading, error } = useRestaurantSearch({
 *     networkClient,
 *     baseUrl: 'https://api.example.com',
 *     location: 'San Francisco',
 *     dish: 'tacos',
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *   return <List items={restaurants} />;
 * }
 * ```
 */
export const useRestaurantSearch = ({
  networkClient,
  baseUrl,
  location,
  dish,
  enabled = true,
}: UseRestaurantSearchConfig): UseRestaurantSearchReturn => {
  const isEnabled = enabled && !!location && !!dish;

  const client = useMemo(
    () => new StarterClient({ baseUrl, networkClient }),
    [baseUrl, networkClient]
  );

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.restaurantSearch(location, dish),
    queryFn: async () => {
      const response = await client.searchRestaurants(location, dish);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch restaurants');
      }
      return response.data;
    },
    enabled: isEnabled,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });

  const error = queryError instanceof Error ? queryError.message : null;

  return useMemo(
    () => ({
      restaurants: data ?? EMPTY_RESTAURANTS,
      isLoading,
      error,
      refetch,
    }),
    [data, isLoading, error, refetch]
  );
};
