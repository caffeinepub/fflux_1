import { useInternetIdentity } from './useInternetIdentity';
import { useMemo } from 'react';

export function useCurrentCreator() {
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const principalString = useMemo(() => {
    if (!identity) return null;
    return identity.getPrincipal().toString();
  }, [identity]);

  const principalShort = useMemo(() => {
    if (!principalString) return null;
    return `${principalString.slice(0, 5)}...${principalString.slice(-3)}`;
  }, [principalString]);

  return {
    identity,
    isAuthenticated,
    principalString,
    principalShort,
    isLoading: isInitializing,
  };
}
