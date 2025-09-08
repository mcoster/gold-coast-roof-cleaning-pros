# Template Variable System

## Overview

The template variable system allows content to use placeholder variables (like `{{businessName}}`) that are automatically replaced with actual business data from `config/business.yaml` at build time. This makes the template reusable for different businesses without manually updating content.

## How It Works

1. **Configuration Source**: Business data is defined in `config/business.yaml`
2. **Config Loader**: `src/lib/config-loader.ts` reads the YAML file and prepares template variables
3. **Build-Time Processing**: Variables are replaced during the Astro build process:
   - **Markdown Content**: Processed by `remark-shortcodes` plugin
   - **Frontmatter**: Processed by content collection schemas in `src/content/config.ts`
   - **Site Config**: Available via `src/config/site.ts` for use in components

## Available Template Variables

All variables are derived from `config/business.yaml`. Here are the most commonly used ones:

### Business Information
- `{{businessName}}` - Business name (e.g., "Adelaide Roof Cleaning Pros")
- `{{tagline}}` - Business tagline
- `{{phone}}` - Formatted phone number (e.g., "(08) 7282 0180")
- `{{email}}` - Business email address
- `{{formattedPhone}}` - Digits-only phone for tel: links (e.g., "0872820180")
- `{{ownerName}}` - Business owner's name (if provided)

### Address
- `{{street}}` - Street address
- `{{city}}` - City name
- `{{state}}` - State/province code
- `{{postcode}}` - Postal/ZIP code
- `{{country}}` - Country name
- `{{fullAddress}}` - Complete formatted address
- `{{mainLocation}}` - City, State Postcode format

### Service Information
- `{{mainServiceCategory}}` - Main service type (e.g., "Roof Cleaning")
- `{{serviceRadius}}` - Service area radius in km

### Legal Jurisdiction (Fixed)
**Note:** Legal jurisdiction is always Queensland/Brisbane as Web and Glow Pty Ltd is registered in Queensland.
- `{{governingState}}` - Always returns "Queensland" (company registration state)
- `{{governingCity}}` - Always returns "Brisbane" (company registration city)

### Business Hours
- `{{hoursMonday}}` through `{{hoursSunday}}` - Daily business hours

### Social Media
- `{{facebookUrl}}` - Facebook page URL
- `{{instagramUrl}}` - Instagram profile URL
- `{{linkedinUrl}}` - LinkedIn page URL
- `{{youtubeUrl}}` - YouTube channel URL

### Website
- `{{siteUrl}}` - Main website URL
- `{{googleMapsUrl}}` - Google Maps business listing
- `{{googleReviewsUrl}}` - Google Reviews URL

## Using Template Variables

### In Markdown Content

Simply use the variable syntax in your markdown files:

```markdown
Welcome to {{businessName}}! We provide {{mainServiceCategory}} services 
across {{city}} and surrounding areas within {{serviceRadius}}km.

Contact us at {{phone}} or email {{email}}.
```

### In Frontmatter

Template variables in frontmatter are automatically processed:

```yaml
---
title: "About {{businessName}}"
description: "Learn about {{businessName}}, your trusted {{mainServiceCategory}} provider in {{city}}"
---
```

### In Astro Components

Access processed values through `siteConfig`:

```astro
---
import { siteConfig } from '@/config/site';
---

<h1>{siteConfig.businessName}</h1>
<p>Call us: <a href={`tel:${siteConfig.formattedPhone}`}>{siteConfig.phone}</a></p>
```

## Adding New Variables

To add a new template variable:

1. Add the data to `config/business.yaml`
2. Update `src/lib/config-loader.ts` to include the new variable in `getTemplateVariables()`
3. (Optional) Add TypeScript types if needed
4. The variable will be available immediately in all markdown content

## Location-Specific Variables

Location pages have additional variables available:

- `{{suburb}}` - Current suburb name
- `{{distance}}` - Distance from service center
- `{{direction}}` - Compass direction from center
- `{{nearbySuburbs:N}}` - List of N nearby suburbs
- `{{randomNearby}}` - Random nearby suburb for variety

## Debugging

If a template variable isn't being replaced:

1. Check that it exists in `config/business.yaml`
2. Verify it's exported by `getTemplateVariables()` in `src/lib/config-loader.ts`
3. Check console for any warning messages during build
4. Ensure the variable name matches exactly (case-sensitive)

## Best Practices

1. **Use semantic variable names**: Choose names that describe the content, not just the field
2. **Provide defaults**: Always have fallback values for optional fields
3. **Document custom variables**: If adding business-specific variables, document them
4. **Test thoroughly**: Always build and preview to ensure variables are replaced correctly
5. **Keep it DRY**: Use variables instead of hardcoding business information

## File Reference

- **Configuration**: `config/business.yaml`
- **Config Loader**: `src/lib/config-loader.ts`
- **Remark Plugin**: `src/lib/remark-shortcodes.ts`
- **Content Config**: `src/content/config.ts`
- **Site Config**: `src/config/site.ts`
- **Template Processor**: `src/lib/template-processor.ts` (for advanced processing)