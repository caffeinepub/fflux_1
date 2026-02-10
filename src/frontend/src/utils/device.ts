interface DeviceInfo {
  deviceId: string;
  platform: string;
  os: string;
  browser: string;
  deviceLabel: string;
}

function getDeviceId(): string {
  const storageKey = 'fflux_device_id';
  
  // Try to get existing device ID
  let deviceId = localStorage.getItem(storageKey);
  
  if (!deviceId) {
    // Generate a new device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, deviceId);
  }
  
  return deviceId;
}

function detectOS(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  
  if (userAgent.includes('win')) return 'Windows';
  if (userAgent.includes('mac')) return 'macOS';
  if (userAgent.includes('linux')) return 'Linux';
  if (userAgent.includes('android')) return 'Android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';
  
  return 'Unknown';
}

function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('edg')) return 'Edge';
  if (userAgent.includes('chrome')) return 'Chrome';
  if (userAgent.includes('firefox')) return 'Firefox';
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'Safari';
  if (userAgent.includes('opera') || userAgent.includes('opr')) return 'Opera';
  
  return 'Unknown';
}

function detectPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
    return 'Mobile';
  }
  if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
    return 'Tablet';
  }
  
  return 'Desktop';
}

export function detectDevice(): DeviceInfo {
  const os = detectOS();
  const browser = detectBrowser();
  const platform = detectPlatform();
  const deviceId = getDeviceId();
  
  // Create a human-friendly device label
  const deviceLabel = `${os} ${platform} (${browser})`;
  
  return {
    deviceId,
    platform,
    os,
    browser,
    deviceLabel,
  };
}
