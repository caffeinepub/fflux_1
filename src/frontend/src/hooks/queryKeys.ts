export const QUERY_KEYS = {
  deviceProfile: () => ['deviceProfile'] as const,
  builds: (deviceTarget?: string | null) => 
    deviceTarget ? ['builds', deviceTarget] as const : ['builds'] as const,
  build: (buildId: string) => ['build', buildId] as const,
};
