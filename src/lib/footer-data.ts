/**
 * Cached Footer Data Module
 * Pre-computes all footer data once per build to avoid redundant processing
 */

import { siteConfig } from '@/config/site';
import { getCachedFooterLocations } from './footer-locations';
import { getCachedMapEmbedConfig, generateEmbedUrl } from './google-places';

export interface CachedFooterData {
  currentYear: number;
  footerLocations: Awaited<ReturnType<typeof getCachedFooterLocations>>;
  mapConfig: Awaited<ReturnType<typeof getCachedMapEmbedConfig>>;
  mapEmbedUrl: string;
  isIframe: boolean;
  hasMap: boolean;
  quickLinks: Array<{ label: string; href: string }>;
  services: Array<{ title: string; slug: string }>;
}

let cachedData: CachedFooterData | null = null;

/**
 * Get all footer data in a single cached call
 * This ensures all async operations are done once per build
 */
export async function getCachedFooterData(): Promise<CachedFooterData> {
  if (cachedData !== null) {
    return cachedData;
  }

  console.log('[Footer] Computing footer data (once per build)...');
  
  // Compute all async data in parallel
  const [footerLocations, mapConfig] = await Promise.all([
    getCachedFooterLocations(),
    getCachedMapEmbedConfig()
  ]);

  // Process map configuration
  let mapEmbedUrl = '';
  let isIframe = false;
  
  if (mapConfig.type === 'iframe') {
    if (mapConfig.content.includes('<iframe')) {
      isIframe = true;
    } else {
      mapEmbedUrl = mapConfig.content;
    }
  } else {
    mapEmbedUrl = generateEmbedUrl(mapConfig);
  }
  
  const hasMap = isIframe || !!mapEmbedUrl;

  // Static data
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get Quote', href: '/contact#quote' },
  ];

  // We'll need to get services data - for now use static
  const services = [
    { title: 'Gutter Cleaning', slug: 'gutter-cleaning' },
    { title: 'Metal Roof Cleaning', slug: 'metal-roof-cleaning' },
    { title: 'Tile Roof Cleaning', slug: 'tile-roof-cleaning' },
    { title: 'Solar Panel Cleaning', slug: 'solar-panel-cleaning' },
  ];

  cachedData = {
    currentYear: new Date().getFullYear(),
    footerLocations,
    mapConfig,
    mapEmbedUrl,
    isIframe,
    hasMap,
    quickLinks,
    services
  };

  console.log('[Footer] Footer data cached successfully');
  
  return cachedData;
}