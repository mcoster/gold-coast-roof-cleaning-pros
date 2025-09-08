# Population Data Documentation

## Overview

This document describes the population data features added to the Australian Suburbs PostGIS database. Population data is sourced from the Australian Bureau of Statistics (ABS) 2021 Census and linked to suburbs via Statistical Area Level 2 (SA2) boundaries.

## Data Sources

### Primary Sources
1. **ABS Census 2021**: Population counts at SA2 level
2. **SA2 Boundaries**: Geographic boundaries from ABS ASGS Edition 3
3. **Regional Population Estimates**: Latest ABS regional population updates

### Data Currency
- Census Date: August 10, 2021
- SA2 Boundaries: 2021 Edition (Jul 2021 - Jun 2026)
- Updates: Quarterly regional population estimates (when available)

## Database Schema

### New Tables

#### `suburb_population`
Stores population data for each suburb:
- `suburb_id`: Link to suburbs table
- `population_total`: Total population count
- `population_male/female`: Gender breakdown
- `population_density`: People per square kilometer
- `median_age`: Median age of residents
- `households`: Number of households
- `median_household_income`: Weekly household income
- `data_source`: Source of data (e.g., 'census_2021')
- `reference_date`: Date of data collection
- `sa2_code`: Linked SA2 code
- `confidence_level`: Match confidence (high/moderate/low)

#### `suburb_sa2_mapping`
Maps suburbs to SA2 regions:
- `suburb_id`: Link to suburbs table
- `sa2_code`: SA2 identifier
- `sa2_name`: SA2 name
- `match_type`: How the match was made (exact/name_match/proximity)
- `match_confidence`: Confidence score (0.0-1.0)

#### `sa2_boundaries` (optional)
Stores SA2 geographic boundaries for spatial matching:
- `sa2_code`: SA2 identifier
- `sa2_name`: SA2 name
- `state`: State code
- `area_sqkm`: Area in square kilometers
- `boundary`: PostGIS MULTIPOLYGON geometry

## SQL Functions

### Core Population Functions

#### `get_suburb_population(suburb_name, state)`
Returns population data for a specific suburb.

#### `suburbs_by_population_range(min, max, state)`
Find suburbs within a population range.

#### `most_populated_suburbs(limit, state)`
Get the most populated suburbs.

#### `suburbs_with_similar_population(suburb, state, variance%)`
Find suburbs with similar population.

#### `population_density_ranking(limit, min_population)`
Rank suburbs by population density.

#### `population_statistics_by_state(state)`
Get aggregated population statistics.

#### `find_populated_suburbs_nearby(suburb, state, radius, min_pop)`
Find nearby suburbs with population filters.

## Data Quality

### Confidence Levels
- **High**: Exact SA2 match or strong name match (90%+ similarity)
- **Moderate**: Fuzzy name match (70-90% similarity)
- **Low**: Proximity-based matching

### Coverage Statistics
Expected coverage after implementation:
- ~60-70% of suburbs with direct SA2 matches
- ~80-90% total coverage including proximity matching
- Higher coverage in urban areas
- Lower coverage in remote/rural areas

### Known Limitations
1. SA2s don't always align with suburb boundaries
2. Some suburbs span multiple SA2s
3. Privacy suppression for small populations (<100 people)
4. Census data becomes dated between collections (every 5 years)


## References

- [ABS Census DataPacks](https://www.abs.gov.au/census/find-census-data/datapacks)
- [ASGS Statistical Areas](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3)
- [ABS Data API Guide](https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide)
- [Regional Population Statistics](https://www.abs.gov.au/statistics/people/population/regional-population)