/**
 * Static Suburbs Data Module
 * Reads suburb data from pre-generated JSON file for production builds
 */

import type { Suburb, SuburbWithPopulation } from './locations';
import { siteConfig } from '../config/site';

// Try to import suburbs data, fallback if not available
let suburbsData: any = null;
try {
  suburbsData = await import('../data/suburbs.json');
} catch (error) {
  console.warn('⚠️  suburbs.json not found, using fallback data');
}

// Cache the loaded data
let cachedSuburbs: Suburb[] | null = null;

/**
 * Generate fallback suburbs when JSON file is not available
 */
function generateFallbackSuburbs(): Suburb[] {
  const centerLat = siteConfig.address?.coordinates?.lat || -34.8517;
  const centerLng = siteConfig.address?.coordinates?.lng || 138.5829;
  const state = siteConfig.address?.state || 'SA';
  
  // Major suburbs for Adelaide (or can be customized per site)
  const fallbackData = state === 'SA' ? [
    { name: 'Adelaide', postcode: '5000', lat: -34.9285, lng: 138.6007 },
    { name: 'North Adelaide', postcode: '5006', lat: -34.9065, lng: 138.5930 },
    { name: 'Prospect', postcode: '5082', lat: -34.8833, lng: 138.5945 },
    { name: 'Glenelg', postcode: '5045', lat: -34.9799, lng: 138.5156 },
    { name: 'Henley Beach', postcode: '5022', lat: -34.9166, lng: 138.4931 },
    { name: 'Port Adelaide', postcode: '5015', lat: -34.8477, lng: 138.5016 },
    { name: 'Modbury', postcode: '5092', lat: -34.8333, lng: 138.6833 },
    { name: 'Marion', postcode: '5043', lat: -34.9833, lng: 138.5500 },
  ] : [
    // Gold Coast fallback suburbs
    { name: 'Surfers Paradise', postcode: '4217', lat: -28.0023, lng: 153.4291 },
    { name: 'Broadbeach', postcode: '4218', lat: -28.0328, lng: 153.4296 },
    { name: 'Burleigh Heads', postcode: '4220', lat: -28.0878, lng: 153.4449 },
    { name: 'Southport', postcode: '4215', lat: -27.9674, lng: 153.4143 },
    { name: 'Robina', postcode: '4226', lat: -28.0790, lng: 153.3901 },
  ];
  
  return fallbackData.map((suburb, index) => {
    const distance = calculateDistance(centerLat, centerLng, suburb.lat, suburb.lng);
    const direction = calculateDirection(centerLat, centerLng, suburb.lat, suburb.lng);
    
    return {
      id: index + 1,
      name: suburb.name,
      postcode: suburb.postcode,
      state,
      latitude: suburb.lat,
      longitude: suburb.lng,
      distanceKm: Math.round(distance * 10) / 10,
      direction,
    };
  });
}

/**
 * Load suburbs from static JSON file
 */
function loadSuburbs(): Suburb[] {
  if (cachedSuburbs) {
    return cachedSuburbs;
  }

  if (!suburbsData) {
    // Use fallback data if JSON file is not available
    console.warn('Using fallback suburb data');
    cachedSuburbs = generateFallbackSuburbs();
    return cachedSuburbs;
  }

  cachedSuburbs = suburbsData.suburbs.map(s => ({
    id: s.id,
    name: s.name,
    postcode: s.postcode || undefined,
    state: s.state,
    latitude: s.latitude,
    longitude: s.longitude,
    distanceKm: s.distanceKm,
    direction: s.direction,
  }));

  return cachedSuburbs;
}

/**
 * Calculate direction between two points
 */
function calculateDirection(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  const dLng = toLng - fromLng;
  const dLat = toLat - fromLat;
  
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  const normalized = (angle + 360) % 360;
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(normalized / 45) % 8;
  
  return directions[index];
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Get all suburbs within a specified radius from a center point
 */
export async function getSuburbsWithinRadius(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Promise<Suburb[]> {
  const suburbs = loadSuburbs();
  
  // Filter suburbs within radius and recalculate distance/direction from the given center
  return suburbs
    .map(suburb => {
      const distance = calculateDistance(centerLat, centerLng, suburb.latitude, suburb.longitude);
      const direction = calculateDirection(centerLat, centerLng, suburb.latitude, suburb.longitude);
      
      return {
        ...suburb,
        distanceKm: Math.round(distance * 10) / 10,
        direction,
      };
    })
    .filter(suburb => suburb.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Get details for a specific suburb
 */
export async function getSuburbDetails(suburbId: number): Promise<Suburb | null> {
  const suburbs = loadSuburbs();
  return suburbs.find(s => s.id === suburbId) || null;
}

/**
 * Get nearby suburbs to a given location
 */
export async function getNearbySuburbs(
  lat: number,
  lng: number,
  limit: number = 10,
  excludeId?: number
): Promise<Suburb[]> {
  const suburbs = loadSuburbs();
  
  // Calculate distances and sort
  const withDistances = suburbs
    .filter(s => s.id !== excludeId)
    .map(suburb => {
      const distance = calculateDistance(lat, lng, suburb.latitude, suburb.longitude);
      const direction = calculateDirection(lat, lng, suburb.latitude, suburb.longitude);
      
      return {
        ...suburb,
        distanceKm: Math.round(distance * 10) / 10,
        direction,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
  
  return withDistances.slice(0, limit);
}

/**
 * Test function - always returns true for static data
 */
export async function testConnection(): Promise<boolean> {
  const suburbs = loadSuburbs();
  console.log(`Static suburbs data loaded: ${suburbs.length} suburbs`);
  return true;
}

/**
 * Get suburbs with population data within a specified radius
 */
export async function getSuburbsWithPopulation(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Promise<SuburbWithPopulation[]> {
  const suburbs = await getSuburbsWithinRadius(centerLat, centerLng, radiusKm);
  
  // Map to include population fields (even if null)
  return suburbs.map(suburb => ({
    ...suburb,
    population: (suburbsData.suburbs.find(s => s.id === suburb.id) as any)?.population || undefined,
    populationDensity: undefined,
    households: undefined,
    medianAge: undefined,
  }));
}

/**
 * Close function - no-op for static data
 */
export async function closePool(): Promise<void> {
  // No-op for static data
}

/**
 * Get suburbs by name
 */
export async function getSuburbsByName(names: string[]): Promise<SuburbWithPopulation[]> {
  const suburbs = loadSuburbs();
  
  const lowerNames = names.map(n => n.toLowerCase());
  
  const found = suburbs.filter(suburb => 
    lowerNames.includes(suburb.name.toLowerCase())
  );
  
  // Map to include population fields
  return found.map(suburb => ({
    ...suburb,
    population: (suburbsData.suburbs.find(s => s.id === suburb.id) as any)?.population || undefined,
    populationDensity: undefined,
    households: undefined,
    medianAge: undefined,
  }));
}

/**
 * Geocode placeholder - returns Adelaide CBD coordinates
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  console.warn('Geocoding not available with static data. Using default Adelaide CBD coordinates.');
  return { lat: -34.9285, lng: 138.6007 };
}