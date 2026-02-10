import type { BuildEntry } from '../backend';

export function selectBestBuild(builds: BuildEntry[], deviceLabel: string): BuildEntry | null {
  if (builds.length === 0) {
    return null;
  }

  // Sort builds by creation date (newest first)
  const sortedBuilds = [...builds].sort((a, b) => Number(b.createdAt - a.createdAt));

  // First, try to find an exact match for the device label
  const exactMatch = sortedBuilds.find(build => build.targetDevice === deviceLabel);
  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, try to find a compatible build based on OS
  const deviceOS = deviceLabel.split(' ')[0]; // Extract OS from label like "Windows Desktop (Chrome)"
  const osMatch = sortedBuilds.find(build => build.targetDevice.includes(deviceOS));
  if (osMatch) {
    return osMatch;
  }

  // If still no match, return the latest build
  return sortedBuilds[0];
}
