import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { QUERY_KEYS } from './queryKeys';
import type { BuildEntry } from '../backend';

export function useBuilds(deviceTarget: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<BuildEntry[]>({
    queryKey: QUERY_KEYS.builds(deviceTarget),
    queryFn: async () => {
      if (!actor || !identity) return [];
      
      try {
        const builds = await actor.listBuilds(deviceTarget);
        // Sort by createdAt descending (newest first)
        return builds.sort((a, b) => Number(b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Failed to fetch builds:', error);
        return [];
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
