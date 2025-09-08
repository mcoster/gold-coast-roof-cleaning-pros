import { siteConfig } from '../config/site';

/**
 * Helper function to get config values with fallback
 * This allows components to use default values when config is not set
 */
export async function getConfigValue<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = (siteConfig as any)[key];
    return value !== undefined ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

export { siteConfig };