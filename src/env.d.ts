/// <reference types="astro/client" />

/**
 * Environment variable types for the project
 * Add any custom environment variables here for TypeScript support
 */
interface ImportMetaEnv {
  readonly PUBLIC_BUSINESS_NAME: string;
  readonly PUBLIC_BUSINESS_TAGLINE: string;
  readonly PUBLIC_PHONE: string;
  readonly PUBLIC_EMAIL: string;
  readonly PUBLIC_STREET_ADDRESS: string;
  readonly PUBLIC_CITY: string;
  readonly PUBLIC_STATE: string;
  readonly PUBLIC_POSTCODE: string;
  readonly PUBLIC_COUNTRY: string;
  readonly PUBLIC_SERVICE_AREAS: string;
  readonly PUBLIC_HOURS_MONDAY: string;
  readonly PUBLIC_HOURS_TUESDAY: string;
  readonly PUBLIC_HOURS_WEDNESDAY: string;
  readonly PUBLIC_HOURS_THURSDAY: string;
  readonly PUBLIC_HOURS_FRIDAY: string;
  readonly PUBLIC_HOURS_SATURDAY: string;
  readonly PUBLIC_HOURS_SUNDAY: string;
  readonly PUBLIC_FACEBOOK_URL: string;
  readonly PUBLIC_INSTAGRAM_URL: string;
  readonly PUBLIC_LINKEDIN_URL: string;
  readonly PUBLIC_YOUTUBE_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_GOOGLE_MAPS_URL: string;
  readonly PUBLIC_GOOGLE_REVIEWS_URL: string;
  readonly PUBLIC_COLOR_PRIMARY: string;
  readonly PUBLIC_COLOR_SECONDARY: string;
  readonly PUBLIC_COLOR_ACCENT: string;
  readonly PUBLIC_COLOR_CTA: string;
  
  // Location Page Generation
  readonly SERVICE_RADIUS_KM?: string;
  readonly SERVICE_CENTER_LAT?: string;
  readonly SERVICE_CENTER_LNG?: string;
  
  // PostGIS Database Connection
  readonly POSTGIS_CONNECTION_STRING?: string;
  readonly POSTGIS_HOST?: string;
  readonly POSTGIS_PORT?: string;
  readonly POSTGIS_DATABASE?: string;
  readonly POSTGIS_USER?: string;
  readonly POSTGIS_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}