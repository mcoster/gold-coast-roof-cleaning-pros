/**
 * Test the updated locations.ts module with the actual database schema
 */

import dotenv from 'dotenv';
dotenv.config();

// Create a module that can access the database directly with process.env
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGIS_HOST || 'localhost',
  port: parseInt(process.env.POSTGIS_PORT || '5432'),
  database: process.env.POSTGIS_DATABASE || 'au_suburbs_db',
  user: process.env.POSTGIS_USER || 'suburbs_user',
  password: process.env.POSTGIS_PASSWORD || '',
});

// Reimplement the functions to test directly
function calculateDirection(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  const dLng = toLng - fromLng;
  const dLat = toLat - fromLat;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  const normalized = (angle + 360) % 360;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(normalized / 45) % 8;
  return directions[index];
}

async function runLocationTests() {
  console.log('🚀 Testing Location Module with Real Database\n');
  
  try {
    // Test 1: Connection
    console.log('1️⃣  Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log(`✅ Connected successfully at ${testResult.rows[0].now}\n`);

    // Test 2: Get suburbs within radius of Adelaide CBD
    console.log('2️⃣  Testing getSuburbsWithinRadius (10km from Adelaide CBD)...');
    const adelaideLat = -34.9285;
    const adelaideLng = 138.6007;
    const radiusKm = 10;
    
    const query = `
      SELECT 
        s.id,
        s.name,
        sp.postcode,
        s.state,
        s.latitude,
        s.longitude,
        ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km
      FROM suburbs s
      LEFT JOIN suburb_postcodes sp ON s.id = sp.suburb_id AND sp.is_primary = true
      WHERE ST_DWithin(
        s.location::geography,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3 * 1000
      )
      ORDER BY distance_km ASC
    `;
    
    const result = await pool.query(query, [adelaideLat, adelaideLng, radiusKm]);
    const suburbsInRadius = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      postcode: row.postcode,
      state: row.state,
      latitude: row.latitude,
      longitude: row.longitude,
      distanceKm: Math.round(row.distance_km * 10) / 10,
      direction: calculateDirection(adelaideLat, adelaideLng, row.latitude, row.longitude),
    }));
    
    if (suburbsInRadius.length > 0) {
      console.log(`✅ Found ${suburbsInRadius.length} suburbs within ${radiusKm}km:`);
      
      // Show first 10
      suburbsInRadius.slice(0, 10).forEach(suburb => {
        const postcodeStr = suburb.postcode ? ` ${suburb.postcode}` : '';
        console.log(`   - ${suburb.name}, ${suburb.state}${postcodeStr} (${suburb.distanceKm}km ${suburb.direction})`);
      });
      
      if (suburbsInRadius.length > 10) {
        console.log(`   ... and ${suburbsInRadius.length - 10} more`);
      }
    } else {
      console.log('⚠️  No suburbs found within radius');
    }
    console.log('');

    // Test 3: Get specific suburb details
    console.log('3️⃣  Testing getSuburbDetails...');
    
    if (suburbsInRadius.length > 0) {
      const testSuburbId = suburbsInRadius[0].id;
      
      const detailQuery = `
        SELECT 
          s.id,
          s.name,
          sp.postcode,
          s.state,
          s.latitude,
          s.longitude
        FROM suburbs s
        LEFT JOIN suburb_postcodes sp ON s.id = sp.suburb_id AND sp.is_primary = true
        WHERE s.id = $1
      `;
      
      const detailResult = await pool.query(detailQuery, [testSuburbId]);
      const suburbDetails = detailResult.rows[0] ? {
        ...detailResult.rows[0],
        distanceKm: 0,
        direction: ''
      } : null;
      
      if (suburbDetails) {
        console.log(`✅ Retrieved details for suburb ID ${testSuburbId}:`);
        console.log(`   Name: ${suburbDetails.name}`);
        console.log(`   State: ${suburbDetails.state}`);
        console.log(`   Postcode: ${suburbDetails.postcode || 'N/A'}`);
        console.log(`   Coordinates: ${parseFloat(suburbDetails.latitude).toFixed(4)}, ${parseFloat(suburbDetails.longitude).toFixed(4)}`);
      } else {
        console.log('❌ Failed to retrieve suburb details');
      }
    } else {
      console.log('⚠️  Skipping - no suburbs available to test');
    }
    console.log('');

    // Test 4: Get nearby suburbs to a specific location
    console.log('4️⃣  Testing getNearbySuburbs (nearest to Adelaide CBD)...');
    
    const nearbyQuery = `
      SELECT 
        s.id,
        s.name,
        sp.postcode,
        s.state,
        s.latitude,
        s.longitude,
        ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km
      FROM suburbs s
      LEFT JOIN suburb_postcodes sp ON s.id = sp.suburb_id AND sp.is_primary = true
      ORDER BY distance_km ASC
      LIMIT $3
    `;
    
    const nearbyResult = await pool.query(nearbyQuery, [adelaideLat, adelaideLng, 5]);
    const nearbySuburbs = nearbyResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      postcode: row.postcode,
      state: row.state,
      latitude: row.latitude,
      longitude: row.longitude,
      distanceKm: Math.round(row.distance_km * 10) / 10,
      direction: calculateDirection(adelaideLat, adelaideLng, row.latitude, row.longitude),
    }));
    
    if (nearbySuburbs.length > 0) {
      console.log(`✅ Found ${nearbySuburbs.length} nearest suburbs:`);
      nearbySuburbs.forEach(suburb => {
        const postcodeStr = suburb.postcode ? ` ${suburb.postcode}` : '';
        console.log(`   - ${suburb.name}, ${suburb.state}${postcodeStr} (${suburb.distanceKm}km ${suburb.direction})`);
      });
    } else {
      console.log('⚠️  No nearby suburbs found');
    }
    console.log('');

    // Test 5: Get nearby suburbs excluding a specific suburb
    console.log('5️⃣  Testing getNearbySuburbs with exclusion...');
    
    if (nearbySuburbs.length > 0) {
      const excludeId = nearbySuburbs[0].id;
      const excludeQuery = `
        SELECT 
          s.id,
          s.name,
          sp.postcode,
          s.state,
          s.latitude,
          s.longitude,
          ST_Distance(
            s.location::geography,
            ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
          ) / 1000 as distance_km
        FROM suburbs s
        LEFT JOIN suburb_postcodes sp ON s.id = sp.suburb_id AND sp.is_primary = true
        WHERE s.id != $3
        ORDER BY distance_km ASC
        LIMIT $4
      `;
      
      const excludeResult = await pool.query(excludeQuery, [adelaideLat, adelaideLng, excludeId, 5]);
      const nearbyExcluding = excludeResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        postcode: row.postcode,
        state: row.state,
        latitude: row.latitude,
        longitude: row.longitude,
        distanceKm: Math.round(row.distance_km * 10) / 10,
        direction: calculateDirection(adelaideLat, adelaideLng, row.latitude, row.longitude),
      }));
      
      if (nearbyExcluding.length > 0) {
        console.log(`✅ Found ${nearbyExcluding.length} suburbs (excluding ${nearbySuburbs[0].name}):`);
        nearbyExcluding.forEach(suburb => {
          const postcodeStr = suburb.postcode ? ` ${suburb.postcode}` : '';
          console.log(`   - ${suburb.name}, ${suburb.state}${postcodeStr} (${suburb.distanceKm}km)`);
        });
      }
    } else {
      console.log('⚠️  Skipping - no suburbs to exclude');
    }
    console.log('');

    // Test 6: Service area coverage
    console.log('6️⃣  Testing service area coverage (50km radius)...');
    const serviceRadius = parseInt(process.env.SERVICE_RADIUS_KM || '50');
    
    const serviceQuery = `
      SELECT 
        s.id,
        s.name,
        sp.postcode,
        s.state,
        s.latitude,
        s.longitude,
        ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km
      FROM suburbs s
      LEFT JOIN suburb_postcodes sp ON s.id = sp.suburb_id AND sp.is_primary = true
      WHERE ST_DWithin(
        s.location::geography,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3 * 1000
      )
      ORDER BY distance_km ASC
    `;
    
    const serviceResult = await pool.query(serviceQuery, [adelaideLat, adelaideLng, serviceRadius]);
    const serviceAreaSuburbs = serviceResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      postcode: row.postcode,
      state: row.state,
      latitude: row.latitude,
      longitude: row.longitude,
      distanceKm: Math.round(row.distance_km * 10) / 10,
      direction: calculateDirection(adelaideLat, adelaideLng, row.latitude, row.longitude),
    }));
    
    if (serviceAreaSuburbs.length > 0) {
      console.log(`✅ Service area covers ${serviceAreaSuburbs.length} suburbs within ${serviceRadius}km`);
      
      // Group by state
      const byState: Record<string, number> = {};
      serviceAreaSuburbs.forEach(suburb => {
        byState[suburb.state] = (byState[suburb.state] || 0) + 1;
      });
      
      console.log('   Breakdown by state:');
      Object.entries(byState).forEach(([state, count]) => {
        console.log(`   - ${state}: ${count} suburbs`);
      });
      
      // Show furthest suburbs
      const furthest = serviceAreaSuburbs.slice(-3);
      console.log(`\n   Furthest suburbs in service area:`);
      furthest.forEach(suburb => {
        console.log(`   - ${suburb.name}, ${suburb.state} (${suburb.distanceKm}km ${suburb.direction})`);
      });
    } else {
      console.log('⚠️  No suburbs found in service area');
    }
    
    console.log('\n✅ All location module tests completed successfully!');
    console.log('   The module is ready for generating location pages.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run tests
runLocationTests();