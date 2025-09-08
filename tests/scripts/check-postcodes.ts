/**
 * Script to check the suburb_postcodes table structure and data
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGIS_HOST || 'localhost',
  port: parseInt(process.env.POSTGIS_PORT || '5432'),
  database: process.env.POSTGIS_DATABASE || 'au_suburbs_db',
  user: process.env.POSTGIS_USER || 'suburbs_user',
  password: process.env.POSTGIS_PASSWORD || '',
});

async function checkPostcodesTable() {
  console.log('🔍 Checking suburb_postcodes table...\n');

  try {
    // Check if table exists
    console.log('1️⃣  Checking if suburb_postcodes table exists...');
    const tableExists = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'suburb_postcodes'
    `);
    
    if (tableExists.rows.length === 0) {
      console.log('❌ Table "suburb_postcodes" not found\n');
      
      // List all tables
      console.log('Available tables:');
      const allTables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      allTables.rows.forEach(row => console.log(`  - ${row.table_name}`));
      return;
    }
    console.log('✅ Table exists\n');

    // Check table structure
    console.log('2️⃣  Table structure:');
    const columns = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'suburb_postcodes'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' (NOT NULL)' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
    });
    console.log('');

    // Check for any indexes
    console.log('3️⃣  Indexes:');
    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'suburb_postcodes'
    `);
    
    if (indexes.rows.length > 0) {
      indexes.rows.forEach(idx => {
        console.log(`  - ${idx.indexname}`);
      });
    } else {
      console.log('  No indexes found');
    }
    console.log('');

    // Check for foreign keys or relationships
    console.log('4️⃣  Checking for foreign key relationships...');
    const fkeys = await pool.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name = 'suburb_postcodes'
    `);
    
    if (fkeys.rows.length > 0) {
      console.log('Foreign keys:');
      fkeys.rows.forEach(fk => {
        console.log(`  - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('  No foreign keys found');
    }
    console.log('');

    // Count records
    console.log('5️⃣  Record count:');
    const count = await pool.query('SELECT COUNT(*) FROM suburb_postcodes');
    console.log(`  Total records: ${count.rows[0].count}\n`);

    // Sample data
    console.log('6️⃣  Sample data (first 10 records):');
    const sample = await pool.query('SELECT * FROM suburb_postcodes LIMIT 10');
    
    if (sample.rows.length > 0) {
      // Show column names
      const cols = Object.keys(sample.rows[0]);
      console.log(`  Columns: ${cols.join(', ')}\n`);
      
      // Show data
      sample.rows.forEach((row, i) => {
        console.log(`  ${i + 1}. ${JSON.stringify(row)}`);
      });
    }
    console.log('');

    // Check if there's a relationship with suburbs table
    console.log('7️⃣  Checking relationship with suburbs table...');
    
    // Get column names from both tables
    const suburbCols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'suburbs'
    `);
    const postcodeCols = columns.rows.map(r => r.column_name);
    
    console.log('Potential linking columns:');
    
    // Check for suburb_id or similar
    if (postcodeCols.includes('suburb_id')) {
      console.log('  - Found suburb_id column');
      
      // Test join
      const testJoin = await pool.query(`
        SELECT 
          s.name as suburb_name,
          s.state,
          sp.*
        FROM suburb_postcodes sp
        JOIN suburbs s ON s.id = sp.suburb_id
        LIMIT 5
      `);
      
      if (testJoin.rows.length > 0) {
        console.log('\n  ✅ Successfully joined with suburbs table:');
        testJoin.rows.forEach(row => {
          console.log(`    ${row.suburb_name}, ${row.state} - Postcode: ${row.postcode || 'N/A'}`);
        });
      }
    }
    
    // Check for name-based relationship
    if (postcodeCols.includes('suburb_name') || postcodeCols.includes('name')) {
      const nameCol = postcodeCols.includes('suburb_name') ? 'suburb_name' : 'name';
      console.log(`  - Found ${nameCol} column (could join on name)`);
    }
    
    console.log('\n✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPostcodesTable();