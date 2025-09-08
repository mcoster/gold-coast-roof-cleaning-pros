# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-09-08

### SEO Improvements
- **Title Tag Optimization**: All page titles now under Google's recommended 580px limit
  - Removed automatic business name appending from Layout.astro
  - Homepage: ~520px "Roof Cleaning Adelaide | Professional Soft Washing Services"
  - About: ~459px "About Us | Expert Roof Cleaners Adelaide Since 2015"
  - Contact: ~408px "Contact Us | Free Roof Cleaning Quote Adelaide"
  - Services: ~408px "Roof Cleaning Services Adelaide | Tile & Metal"
  - Location pages: ~425px average "Roof Cleaning [Suburb] SA | Expert Service"
- **Meta Descriptions**: Added optimized meta descriptions to all pages
- **Footer Fix**: Resolved duplicate Adelaide location links in footer via NPM package update

### Technical Changes
- Changed NPM package source to pull directly from GitHub (`github:mcoster/astro-local-package#main`)
- Updated to @mcoster/astro-local-package v1.0.5
- Improved footer location filtering to prevent duplicate main location

## [Previous] - 2025-09-07

### Added
- Main location redirect functionality - automatically redirects the main location (defined in `PUBLIC_MAIN_LOCATION`) to the homepage
- 301 redirect configuration in `public/_redirects` for Netlify deployment
- Hybrid approach for handling main location: build-time URL replacement + fallback redirects

### Changed
- Optimized spacing throughout service pages:
  - Reduced Section component padding from `py-16` to `py-12`
  - Adjusted H2 section padding in ServiceContent for better visual balance
  - Optimized two-column layout spacing
  - Updated Hero component padding for better proportions
  - Made Spacer component use more reasonable values
- Increased green checkmark icons size in WhyUs component from 24x24px to 32x32px for better visibility
- Consolidated service-related files:
  - Removed redundant `serviceFAQ` and `serviceWhyChoose` collections
  - FAQ and Why Choose YAML files now live directly in service folders
  - Components now read directly from service folders using filesystem access

### Fixed
- Fixed spintax processing on location pages - patterns like `{Professional|Expert|Trusted}` now render correctly
- Fixed template processing inheritance issue where LocationContext wasn't properly processing spintax patterns

### Removed
- Removed redundant `serviceFAQ` and `serviceWhyChoose` directories
- Adelaide location page is no longer generated (redirects to homepage instead)

## Technical Details

### Main Location Redirect Implementation
- Modified `generateLocationUrl()` in `/src/lib/location-builder.ts` to check for main location match
- Updated `buildLocationPages()` to skip generating pages for the main location
- Created `/public/_redirects` file with Netlify redirect rules
- All components using `generateLocationUrl()` automatically get the redirect behavior

### Service Content Organization
- Service pages now use a single folder structure: `/src/content/services/[service-name]/`
  - `index.md` - Main service content
  - `faq.yaml` - FAQ section data
  - `why-choose.yaml` - Why Choose section data
- Components `ServiceFAQ.astro` and `WhyUs.astro` use direct filesystem access with `fs.readFileSync()`