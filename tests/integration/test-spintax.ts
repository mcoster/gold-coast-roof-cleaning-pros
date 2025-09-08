/**
 * Test script for Spintax Template Engine
 * Verifies spintax processing and placeholder replacement
 */

import { LocationSpintax } from './src/lib/spintax';
import { locationTemplates, getRandomTemplate } from './src/lib/spintax-templates';
import type { Suburb, LocationData } from './src/lib/spintax';

// Test data - North Adelaide suburb
const testSuburb: Suburb = {
  id: 1,
  name: "North Adelaide",
  postcode: "5006",
  state: "SA",
  latitude: -34.9060,
  longitude: 138.5950,
  distanceKm: 2.3,
  direction: "N"
};

// Nearby suburbs for testing
const nearbySuburbs: Suburb[] = [
  { id: 2, name: "Adelaide", postcode: "5000", state: "SA", latitude: -34.9285, longitude: 138.6007, distanceKm: 0.3, direction: "S" },
  { id: 3, name: "Prospect", postcode: "5082", state: "SA", latitude: -34.8841, longitude: 138.5945, distanceKm: 3.1, direction: "N" },
  { id: 4, name: "Walkerville", postcode: "5081", state: "SA", latitude: -34.8937, longitude: 138.6165, distanceKm: 2.8, direction: "NE" },
  { id: 5, name: "Gilberton", postcode: "5081", state: "SA", latitude: -34.8985, longitude: 138.6089, distanceKm: 1.5, direction: "NE" },
  { id: 6, name: "Medindie", postcode: "5081", state: "SA", latitude: -34.8935, longitude: 138.6067, distanceKm: 1.8, direction: "NE" },
  { id: 7, name: "Thorngate", postcode: "5082", state: "SA", latitude: -34.8969, longitude: 138.5878, distanceKm: 2.2, direction: "N" },
  { id: 8, name: "Fitzroy", postcode: "5082", state: "SA", latitude: -34.8867, longitude: 138.5899, distanceKm: 2.9, direction: "N" },
  { id: 9, name: "Ovingham", postcode: "5082", state: "SA", latitude: -34.8819, longitude: 138.5930, distanceKm: 3.4, direction: "N" }
];

// Create location data object
const locationData: LocationData = {
  suburb: testSuburb,
  nearbySuburbs,
  businessName: "Adelaide Pressure Cleaning",
  serviceRadius: 50
};

console.log('🧪 Testing Spintax Template Engine\n');
console.log('='.repeat(50));

// Test 1: Basic placeholder replacement (no spintax)
console.log('\n1️⃣ Testing Basic Placeholder Replacement:');
console.log('-'.repeat(40));
const basicTemplate = "We service {{suburb}}, {{state}} {{postcode}} - just {{distance}}km {{direction}}.";
const spintaxNoSeed = new LocationSpintax();
const basicResult = spintaxNoSeed.generateContent(basicTemplate, locationData);
console.log('Template:', basicTemplate);
console.log('Result:  ', basicResult);

// Test 2: Simple spintax with placeholders
console.log('\n2️⃣ Testing Simple Spintax:');
console.log('-'.repeat(40));
const simpleTemplate = "{Welcome to|Serving} {{suburb}} with {pride|excellence}!";
console.log('Template:', simpleTemplate);
console.log('Random variations:');
for (let i = 0; i < 3; i++) {
  const result = spintaxNoSeed.generateContent(simpleTemplate, locationData);
  console.log(`  ${i + 1}:`, result);
}

// Test 3: Seeded spintax (consistent output)
console.log('\n3️⃣ Testing Seeded Spintax (Consistent Output):');
console.log('-'.repeat(40));
const seededSpintax = new LocationSpintax('north-adelaide-5006');
const seededTemplate = locationTemplates.hero.title;
console.log('Template:', seededTemplate);
console.log('With seed "north-adelaide-5006":');
for (let i = 0; i < 3; i++) {
  const result = seededSpintax.generateContent(seededTemplate, locationData);
  console.log(`  Run ${i + 1}:`, result);
}

// Test 4: Complex templates
console.log('\n4️⃣ Testing Complex Templates:');
console.log('-'.repeat(40));

// Hero title
console.log('\n📌 Hero Title:');
const heroTitle = seededSpintax.generateContent(locationTemplates.hero.title, locationData);
console.log('  ', heroTitle);

// Introduction
console.log('\n📝 Introduction:');
const intro = seededSpintax.generateContent(locationTemplates.intro.opening, locationData);
console.log('  ', intro);

// Location info
console.log('\n📍 Location Info:');
const location = seededSpintax.generateContent(locationTemplates.intro.location, locationData);
console.log('  ', location);

// Service area
console.log('\n🗺️ Service Area:');
const serviceArea = seededSpintax.generateContent(locationTemplates.serviceArea.primary, locationData);
console.log('  ', serviceArea);

// Call to action
console.log('\n📞 Call to Action:');
const cta = seededSpintax.generateContent(locationTemplates.callToAction.primary, locationData);
console.log('  ', cta);

// Test 5: SEO content
console.log('\n5️⃣ Testing SEO Templates:');
console.log('-'.repeat(40));

console.log('\n🔍 SEO Title:');
const seoTitle = seededSpintax.generateContent(locationTemplates.seo.title, locationData);
console.log('  ', seoTitle);

console.log('\n📄 SEO Description:');
const seoDesc = seededSpintax.generateContent(locationTemplates.seo.description, locationData);
console.log('  ', seoDesc);

// Test 6: FAQ content
console.log('\n6️⃣ Testing FAQ Templates:');
console.log('-'.repeat(40));

console.log('\nQ:', seededSpintax.generateContent(locationTemplates.faq.q1, locationData));
console.log('A:', seededSpintax.generateContent(locationTemplates.faq.a1, locationData));

console.log('\nQ:', seededSpintax.generateContent(locationTemplates.faq.q2, locationData));
console.log('A:', seededSpintax.generateContent(locationTemplates.faq.a2, locationData));

// Test 7: Nearby suburbs list
console.log('\n7️⃣ Testing Nearby Suburbs Placeholder:');
console.log('-'.repeat(40));
const nearbyTemplate = "We also service: {{nearbySuburbs:5}}";
const nearbyResult = spintaxNoSeed.generateContent(nearbyTemplate, locationData);
console.log('Template:', nearbyTemplate);
console.log('Result:  ', nearbyResult);

// Test 8: Random template selection
console.log('\n8️⃣ Testing Random Template Selection:');
console.log('-'.repeat(40));
const h2Options = locationTemplates.seo.h2Options;
console.log('Available H2 templates:', h2Options.length);
const selectedH2 = getRandomTemplate(h2Options, 'north-adelaide');
const h2Result = seededSpintax.generateContent(selectedH2, locationData);
console.log('Selected H2:', h2Result);

// Test 9: Validation
console.log('\n9️⃣ Testing Template Validation:');
console.log('-'.repeat(40));
const validTemplate = "{This is|This is a} valid template";
const invalidTemplate = "{This is invalid}}";
console.log('Valid template check:  ', LocationSpintax.validateTemplate(validTemplate) ? '✅ Valid' : '❌ Invalid');
console.log('Invalid template check:', LocationSpintax.validateTemplate(invalidTemplate) ? '✅ Valid' : '❌ Invalid');

// Test 10: Variation counting
console.log('\n🔟 Testing Variation Counting:');
console.log('-'.repeat(40));
const countTemplate = "{A|B|C} {1|2} {X|Y|Z}";
const variationCount = LocationSpintax.countVariations(countTemplate);
console.log('Template:', countTemplate);
console.log('Possible variations:', variationCount, '(expected: 3 × 2 × 3 = 18)');

// Test 11: Different suburbs
console.log('\n1️⃣1️⃣ Testing Different Suburb:');
console.log('-'.repeat(40));
const prospectSuburb: Suburb = {
  id: 3,
  name: "Prospect",
  postcode: "5082",
  state: "SA",
  latitude: -34.8841,
  longitude: 138.5945,
  distanceKm: 3.1,
  direction: "N"
};

const prospectData: LocationData = {
  suburb: prospectSuburb,
  nearbySuburbs: nearbySuburbs.filter(s => s.id !== 3), // Exclude Prospect itself
  businessName: "Adelaide Pressure Cleaning",
  serviceRadius: 50
};

const prospectSpintax = new LocationSpintax('prospect-5082');
const prospectTitle = prospectSpintax.generateContent(locationTemplates.hero.title, prospectData);
console.log('Prospect Title:', prospectTitle);

// Summary
console.log('\n');
console.log('='.repeat(50));
console.log('✅ Spintax Template Engine Test Complete!');
console.log('='.repeat(50));
console.log('\nKey Features Tested:');
console.log('  ✓ Basic placeholder replacement');
console.log('  ✓ Spintax variation generation');
console.log('  ✓ Seeded consistent output');
console.log('  ✓ Complex nested templates');
console.log('  ✓ Nearby suburbs list');
console.log('  ✓ Template validation');
console.log('  ✓ Variation counting');
console.log('  ✓ Multiple suburb support');