import { Platform } from 'react-native';

const LEGACY_ANDROID_API_LEVEL = 26;

export function detectLowEndDeviceMode() {
  if (Platform.OS !== 'android') {
    return false;
  }

  if (typeof Platform.Version !== 'number') {
    return false;
  }

  return Platform.Version <= LEGACY_ANDROID_API_LEVEL;
}
