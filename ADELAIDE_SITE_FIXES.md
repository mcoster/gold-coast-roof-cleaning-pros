# Adelaide Roof Cleaning Site - Common Issues and Fixes Guide

## Overview
This document outlines common issues found in the Gold Coast Roof Cleaning site that likely exist in the Adelaide site, along with their root causes and fixes.

## 1. Local Library Files Duplicating NPM Package Functionality

### Issue
The project has 22+ files in `src/lib/` that duplicate functionality from the npm package `@mcoster/astro-local-package`.

### Symptoms
- Outdated or inconsistent behavior
- Hardcoded location-specific data (e.g., Adelaide suburbs in footer-locations.ts)
- Maintenance burden of duplicate code

### Root Cause
The project was initially developed with local files before the npm package was fully developed, and migration wasn't completed.

### Files to Check and Remove
Look for these files in `src/lib/`:
- component-registry.ts
- config-loader.ts
- footer-data.ts
- footer-locations.ts (⚠️ Contains hardcoded Adelaide suburbs!)
- google-places.ts
- image-alt-generator.ts
- image-analysis.ts
- image-placeholders.ts
- image-registry.ts
- location-builder.ts
- locations.ts
- page-renderer.ts
- remark-section-wrapper.ts
- remark-shortcodes.ts
- remark-two-column.ts
- shortcode-registry.ts
- simple-image-matcher.ts
- spintax-templates.ts
- spintax.ts
- static-suburbs.ts
- stock-photos.ts
- template-processor.ts

### Fix
1. Delete all duplicate files from `src/lib/`
2. Update all imports to use npm package:
   - Change `@/lib/[module]` to `@mcoster/astro-local-package/utils/[module]`
3. Update `astro.config.mjs` imports as well

### Files Needing Import Updates
- src/pages/index.astro
- src/pages/about.astro
- src/pages/contact.astro
- src/pages/services/[slug].astro
- src/pages/locations/[location].astro
- src/pages/locations/index.astro
- src/content/config.ts
- astro.config.mjs

## 2. Package.json Using Specific Commit Instead of Latest

### Issue
The package.json references a specific commit hash instead of the main branch.

### Symptom
```json
"@mcoster/astro-local-package": "github:mcoster/astro-local-package#[commit-hash]"
```

### Root Cause
Package was locked to a specific version for stability but prevents automatic updates.

### Fix
Update package.json to use main branch:
```json
"@mcoster/astro-local-package": "github:mcoster/astro-local-package#main"
```

Then run:
```bash
npm update @mcoster/astro-local-package
```

## 3. Hardcoded Contact Information in 404 Page

### Issue
The 404.astro page has hardcoded phone numbers and email addresses instead of using template variables.

### Symptom
Wrong contact information displayed on 404 page (e.g., Gold Coast info on Adelaide site or vice versa).

### Root Cause
Template was copied between projects without updating to use configuration variables.

### Fix
1. Add siteConfig import to 404.astro:
```astro
---
import { siteConfig } from '@/config/site';
---
```

2. Replace hardcoded values:
```astro
<!-- Before -->
<a href="tel:0872280262">(08) 7228 0262</a>
<a href="mailto:info@adelaidepressure.com.au">info@adelaidepressure.com.au</a>

<!-- After -->
<a href={`tel:${siteConfig.formattedPhone}`}>{siteConfig.phone}</a>
<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
```

## 4. Legacy URL References in Documentation

### Issue
Documentation files contain references to non-existent URLs like `/services/residential-services`.

### Location
Check `instructions/active/CUSTOMIZATION.md` and other documentation files.

### Fix
Replace with actual service slugs from your content:
- tile-roof-cleaning
- metal-roof-cleaning
- solar-panel-cleaning
- gutter-cleaning

## 5. Unused Directories

### Issue
Empty or unused directories that should be removed:
- `src/components/` (if empty)
- `src/components-backup/`
- `src/lib/` (after removing duplicate files)

### Fix
```bash
rm -rf src/components/ src/components-backup/ src/lib/
```

## 6. Footer Locations with Wrong Suburbs

### Critical Issue
The `src/lib/footer-locations.ts` file contains hardcoded major suburbs array that's location-specific.

### Symptom
Footer shows wrong suburbs for the location (e.g., Gold Coast suburbs on Adelaide site).

### Example of Problem Code
```typescript
const majorSuburbs = [
  'North Adelaide', 'Glenelg', 'Norwood', 'Port Adelaide',
  'Unley', 'Prospect', 'Burnside', 'Mitcham'
];
```

### Fix
Delete the local file and use the npm package version which handles this dynamically.

## 7. Check Other Utility Pages

### Pages to Verify
Check these pages for hardcoded information:
- privacy.astro
- terms.astro
- thank-you.astro

### What to Look For
- Hardcoded business names
- Hardcoded addresses
- Hardcoded phone/email
- References to wrong city/state

### Fix
Ensure all pages use `siteConfig` variables:
```astro
import { siteConfig } from '@/config/site';
```

## Complete Fix Process

### Step 1: Update package.json
```bash
# Edit package.json to use #main instead of specific commit
npm update @mcoster/astro-local-package
```

### Step 2: Remove Duplicate Files
```bash
# Remove all duplicate lib files
rm -f src/lib/*.ts

# Remove unused directories
rm -rf src/components/ src/components-backup/
```

### Step 3: Update Imports
Find and replace in all files:
- `from '@/lib/` → `from '@mcoster/astro-local-package/utils/`

### Step 4: Fix Hardcoded Values
Search for hardcoded values in all .astro files:
```bash
# Search for Adelaide-specific content
grep -r "adelaide\|adelaidepressure" src/pages/

# Search for hardcoded phones (Adelaide area code)
grep -r "08\s*7\|0872" src/pages/

# Search for Gold Coast content (if fixing Adelaide site)
grep -r "gold coast\|goldcoast" src/pages/
grep -r "07\s*5\|0752" src/pages/
```

### Step 5: Test Build
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
npm run dev
```

### Step 6: Verify All Page Types
Test these URLs locally:
- / (homepage)
- /services
- /services/[any-service]
- /locations
- /locations/[any-location]
- /about
- /contact
- /404 (non-existent page)
- /privacy
- /terms
- /thank-you

### Step 7: Commit Changes
```bash
git add -A
git commit -m "Migrate to latest npm package and fix location-specific issues

- Updated package.json to use main branch
- Removed duplicate lib files
- Fixed hardcoded contact information
- Updated all imports to use npm package"

git push origin main
```

## Testing Checklist

After making changes, verify:
- [ ] No Adelaide references on Gold Coast site
- [ ] No Gold Coast references on Adelaide site
- [ ] Correct phone number on all pages
- [ ] Correct email on all pages
- [ ] Correct business name throughout
- [ ] Footer shows correct local suburbs
- [ ] 404 page shows correct contact info
- [ ] Build completes without errors
- [ ] All service pages load correctly
- [ ] All location pages load correctly

## Common Commands

```bash
# Check current package version
npm list @mcoster/astro-local-package

# Update to latest
npm update @mcoster/astro-local-package

# Build with extra memory
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build

# Search for hardcoded values
grep -r "hardcoded-phone" src/
grep -r "hardcoded-email" src/

# Find all imports from local lib
grep -r "from '@/lib/" src/
```

## Notes

- The npm package doesn't include page templates, only components and utilities
- Pages like 404, privacy, terms are expected to be local
- Always use template variables (siteConfig) instead of hardcoding
- The migration script `migrate-to-package.sh` might exist but may be outdated