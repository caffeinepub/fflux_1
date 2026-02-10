import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { detectDevice } from '../utils/device';
import { QUERY_KEYS } from './queryKeys';
import type { DeviceProfile } from '../backend';

export function useRegisterDeviceProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !identity) {
        throw new Error('Not authenticated');
      }

      const deviceInfo = detectDevice();
      const principal = identity.getPrincipal();

      const profile: DeviceProfile = {
        id: deviceInfo.deviceId,
        creator: principal,
        platform: deviceInfo.platform,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        deviceLabel: deviceInfo.deviceLabel,
        isLoggedIn: true,
      };

      await actor.registerDeviceProfile(profile);
      return profile;
    },
    onSuccess: () => {
      // Invalidate device profile and builds queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deviceProfile() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.builds() });
    },
  });
}
