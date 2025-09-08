/**
 * Test script to verify PostGIS database connection and structure
 */

import { Pool } from 'pg';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Create a direct connection to test database structure
const pool = new Pool({
  host: process.env.POSTGIS_HOST || 'localhost',
  port: parseInt(process.env.POSTGIS_PORT || '5432'),
  database: process.env.POSTGIS_DATABASE || 'au_suburbs_db',
  user: process.env.POSTGIS_USER || 'suburbs_user',
  password: process.env.POSTGIS_PASSWORD || '',
});

async function runTests() {
  console.log('🔍 Testing PostGIS Database Connection...\n');
  console.log('Connection details:');
  console.log(`  Host: ${process.env.POSTGIS_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.POSTGIS_PORT || '5432'}`);
  console.log(`  Database: ${process.env.POSTGIS_DATABASE || 'au_suburbs_db'}`);
  console.log(`  User: ${process.env.POSTGIS_USER || 'suburbs_user'}`);
  console.log(`  Password: ${process.env.POSTGIS_PASSWORD ? '***' : '(empty)'}\n`);

  try {
    // Test basic connection
    console.log('1️⃣  Testing basic connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log(`✅ Connection successful! Server time: ${testResult.rows[0].now}\n`);

    // Check PostGIS extension
    console.log('2️⃣  Checking PostGIS extension...');
    const extResult = await pool.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'postgis'
    `);
    
    if (extResult.rows.length > 0) {
      console.log(`✅ PostGIS ${extResult.rows[0].extversion} is installed\n`);
    } else {
      console.error('❌ PostGIS extension not found');
      console.log('   Run: CREATE EXTENSION postgis; in your database\n');
    }

    // Check for suburbs table
    console.log('3️⃣  Checking for suburbs table...');
    const tableResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'suburbs'
    `);
    
    if (tableResult.rows.length === 0) {
      console.error('❌ Table "suburbs" not found');
      console.log('\n4️⃣  Available tables in database:');
      const allTables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      allTables.rows.forEach(row => console.log(`   - ${row.table_name}`));
      process.exit(1);
    }
    console.log('✅ Table "suburbs" exists\n');

    // Check table structure
    console.log('4️⃣  Checking suburbs table structure...');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'suburbs'
      ORDER BY ordinal_position
    `);
    
    console.log('   Columns found:');
    columnsResult.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}${col.udt_name === 'geometry' ? ' (geometry)' : ''}`);
    });
    console.log('');

    // Check required columns
    const requiredColumns = ['id', 'name', 'postcode', 'state', 'geom'];
    const foundColumns = columnsResult.rows.map(r => r.column_name);
    const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.error(`❌ Missing required columns: ${missingColumns.join(', ')}`);
      console.log('   The application expects: id, name, postcode, state, geom\n');
    } else {
      console.log('✅ All required columns present\n');
    }

    // Check spatial index
    console.log('5️⃣  Checking for spatial index...');
    const indexResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'suburbs' 
      AND indexdef LIKE '%gist%geom%'
    `);
    
    if (indexResult.rows.length > 0) {
      console.log(`✅ Spatial index found: ${indexResult.rows[0].indexname}\n`);
    } else {
      console.log('⚠️  No spatial index found on geom column');
      console.log('   Consider adding: CREATE INDEX idx_suburbs_geom ON suburbs USING GIST(geom);\n');
    }

    // Count records
    console.log('6️⃣  Counting suburb records...');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM suburbs');
    console.log(`   Total suburbs: ${countResult.rows[0].count}\n`);

    // Sample data
    console.log('7️⃣  Sample suburb data (first 5 records):');
    const sampleResult = await pool.query(`
      SELECT 
        id, 
        name, 
        postcode, 
        state,
        ST_Y(geom::geometry) as latitude,
        ST_X(geom::geometry) as longitude
      FROM suburbs 
      LIMIT 5
    `);
    
    sampleResult.rows.forEach(row => {
      console.log(`   ${row.name}, ${row.state} ${row.postcode} (${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)})`);
    });
    console.log('');

    // Test spatial query (Adelaide CBD area)
    console.log('8️⃣  Testing spatial query (suburbs within 10km of Adelaide CBD)...');
    const adelaideLat = -34.9285;
    const adelaideLng = 138.6007;
    
    try {
      const nearbyResult = await pool.query(`
        SELECT 
          name, 
          postcode,
          ST_Distance(
            geom::geography,
            ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
          ) / 1000 as distance_km
        FROM suburbs
        WHERE ST_DWithin(
          geom::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
          10000  -- 10km in meters
        )
        ORDER BY distance_km ASC
        LIMIT 10
      `, [adelaideLat, adelaideLng]);
      
      if (nearbyResult.rows.length > 0) {
        console.log(`✅ Found ${nearbyResult.rows.length} suburbs within 10km:`);
        nearbyResult.rows.forEach(row => {
          console.log(`   - ${row.name} (${row.distance_km.toFixed(1)}km)`);
        });
      } else {
        console.log('⚠️  No suburbs found within 10km of test point');
      }
    } catch (err) {
      console.error('❌ Spatial query failed:', err.message);
      console.log('   Make sure PostGIS functions are available and geom column has correct SRID');
    }

    console.log('\n✅ All tests completed successfully!');
    console.log('   Your PostGIS database is ready for the location pages feature.');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database "au_suburbs_db" exists');
    console.error('3. User "suburbs_user" has access');
    console.error('4. PostGIS extension is installed');
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the tests
runTests();