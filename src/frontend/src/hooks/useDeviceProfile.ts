import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { QUERY_KEYS } from './queryKeys';
import type { DeviceProfile } from '../backend';

export function useDeviceProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DeviceProfile | null>({
    queryKey: QUERY_KEYS.deviceProfile(),
    queryFn: async () => {
      if (!actor || !identity) return null;
      
      try {
        const principal = identity.getPrincipal();
        const profile = await actor.getDeviceProfile(principal);
        return profile;
      } catch (error) {
        // Device profile not found yet
        return null;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });
}
