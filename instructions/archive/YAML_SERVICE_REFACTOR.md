# YAML-Based Service Content Architecture - Implementation Guide

## Executive Summary

This guide provides detailed instructions for refactoring the current markdown shortcode system (`[why-choose]`, `[faq]`, `[two-column]`) to a cleaner YAML-based architecture. The new system will eliminate plugin conflicts, improve maintainability, and provide consistent styling across all pages.

## Problem Analysis

### Current Issues

1. **Plugin Conflicts**: The `remark-special-sections.js` and `remark-h2-sections.js` plugins interfere with each other, causing:
   - Double-wrapping of content
   - Inconsistent heading sizes
   - Styling discrepancies between pages

2. **Parsing Complexity**: 
   - Smart quotes vs regular quotes in markdown causing regex failures
   - Closing tags embedded within list items not being detected
   - Complex AST manipulation logic that's hard to maintain

3. **Visual Inconsistencies**:
   - Why Choose sections look different on About page (YAML) vs Service pages (shortcode)
   - Checkmark alignment issues
   - Heading size variations

## New Architecture

### File Structure

```
src/content/services/
├── tile-roof-cleaning/
│   ├── index.md          # Main service content (pure markdown)
│   ├── why-choose.yaml   # Why Choose section data
│   └── faq.yaml          # FAQ section data
├── metal-roof-cleaning/
│   ├── index.md
│   ├── why-choose.yaml
│   └── faq.yaml
├── solar-panel-cleaning/
│   ├── index.md
│   ├── why-choose.yaml
│   └── faq.yaml
└── gutter-cleaning/
    ├── index.md
    ├── why-choose.yaml
    └── faq.yaml
```

## Implementation Steps

### Step 1: Update Content Collection Schema

**File**: `src/content/config.ts`

Add new schemas for service-specific YAML files:

```typescript
// Add to existing imports
import { defineCollection, z, reference } from 'astro:content';

// Add new schemas for service YAML files
const serviceFAQSchema = z.object({
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
});

const serviceWhyChooseSchema = z.object({
  heading: z.string().optional(),
  reasons: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

// Update services collection to handle subfolders
const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ... existing schema fields remain the same
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    image: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

// Add new collections for service-specific data
const serviceFAQCollection = defineCollection({
  type: 'data',
  schema: serviceFAQSchema,
});

const serviceWhyChooseCollection = defineCollection({
  type: 'data',
  schema: serviceWhyChooseSchema,
});

// Export all collections
export const collections = {
  services: servicesCollection,
  serviceFAQ: serviceFAQCollection,
  serviceWhyChoose: serviceWhyChooseCollection,
  // ... other existing collections
};
```

### Step 2: Update Component Registry

**File**: `src/lib/component-registry.ts`

Ensure ServiceFAQ is registered (WhyUs already exists):

```typescript
import ServiceFAQ from '@/components/ServiceFAQ.astro';
// ... other imports

export const componentRegistry = {
  // ... existing components
  WhyUs,
  ServiceFAQ,  // Add this if not already present
  // ... other components
};
```

### Step 3: Enhance WhyUs Component

**File**: `src/components/WhyUs.astro`

Update to support loading from service-specific YAML:

```typescript
---
import { getEntry } from 'astro:content';

export interface Props {
  heading?: string;
  reasons?: Array<{
    title: string;
    description: string;
  }>;
  serviceSlug?: string;  // New prop for service-specific data
  className?: string;
}

const {
  heading: inlineHeading,
  reasons: inlineReasons,
  serviceSlug,
  className = '',
} = Astro.props;

// Load service-specific data if serviceSlug is provided
let heading = inlineHeading || 'Why Choose Us';
let reasons = inlineReasons || [];

if (serviceSlug && !inlineReasons) {
  try {
    const whyChooseData = await getEntry('serviceWhyChoose', `${serviceSlug}/why-choose`);
    if (whyChooseData) {
      heading = whyChooseData.data.heading || heading;
      reasons = whyChooseData.data.reasons || [];
    }
  } catch (error) {
    console.warn(`No why-choose.yaml found for service: ${serviceSlug}`);
  }
}
---

<!-- Rest of the component remains the same -->
<section class={`py-16 bg-white ${className}`}>
  <!-- existing HTML structure -->
</section>
```

### Step 4: Enhance ServiceFAQ Component

**File**: `src/components/ServiceFAQ.astro`

Update to support loading from service-specific YAML:

```typescript
---
import { getEntry } from 'astro:content';

export interface Props {
  heading?: string;
  subtitle?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  serviceSlug?: string;  // New prop for service-specific data
  className?: string;
}

const { 
  heading: inlineHeading = 'Frequently Asked Questions', 
  subtitle,
  faqs: inlineFaqs,
  serviceSlug,
  className = '' 
} = Astro.props;

// Load service-specific data if serviceSlug is provided
let faqs = inlineFaqs || [];

if (serviceSlug && !inlineFaqs) {
  try {
    const faqData = await getEntry('serviceFAQ', `${serviceSlug}/faq`);
    if (faqData) {
      faqs = faqData.data.faqs || [];
    }
  } catch (error) {
    console.warn(`No faq.yaml found for service: ${serviceSlug}`);
  }
}

const heading = inlineHeading;
---

<!-- Rest of the component remains the same -->
<section class={`service-faq py-16 bg-white ${className}`}>
  <!-- existing HTML structure -->
</section>
```

### Step 5: Update services-default.yaml

**File**: `src/content/serviceSections/services-default.yaml`

Add FAQ and Why Choose sections:

```yaml
sections:
  # Hero with form
  - component: HeroWithForm
    enabled: true
    props:
      title: "{{serviceTitle}}"
      subtitle: "{{serviceDescription}}"
      backgroundImage: "{{serviceImage}}"
      formTitle: "Get a FREE Quote"
      formDescription: ""

  # Service content (markdown from service file)
  - component: ServiceContent
    enabled: true
    props:
      title: null
      injectContent: true

  # Why Choose section - loads from service-specific YAML
  - component: WhyUs
    enabled: true
    props:
      serviceSlug: "{{serviceSlug}}"
      # No inline data - will load from why-choose.yaml

  # FAQ section - loads from service-specific YAML
  - component: ServiceFAQ
    enabled: true
    props:
      serviceSlug: "{{serviceSlug}}"
      # No inline data - will load from faq.yaml

  # Service areas
  - component: ServiceAreas
    enabled: true
    props:
      heading: "{{serviceTitle}} Service Areas"
      subtitle: "Professional roof cleaning services throughout Adelaide and surrounding suburbs"
      limit: 12
      showCta: false

  # Call to action
  - component: CTABanner
    enabled: true
    props:
      heading: "Ready to Get Started with {{serviceTitle}}?"
      description: "Get your free, no-obligation quote today. We're here to help restore and protect your roof!"
      buttonText: "Get Your Free Quote"
      buttonHref: "#quote-form"
      secondaryButtonText: "Call {{phone}}"
      secondaryButtonHref: "tel:{{formattedPhone}}"
      variant: "gradient"

  # Related services
  - component: RelatedServices
    enabled: true
    props:
      heading: null
      subtitle: null
      currentService: "{{serviceSlug}}"
      limit: 3
      showAll: null
```

### Step 6: Create Service Subfolders and YAML Files

For each service, create the folder structure and extract content.

#### Example: tile-roof-cleaning

**Directory structure**:
```
src/content/services/tile-roof-cleaning/
├── index.md
├── why-choose.yaml
└── faq.yaml
```

**File**: `src/content/services/tile-roof-cleaning/index.md`
```markdown
---
title: "Tile Roof Cleaning"
description: "Professional tile roof cleaning in Adelaide using soft washing techniques to safely remove moss, lichen, and years of built-up grime without damaging your tiles."
excerpt: "Expert tile roof cleaning with soft washing to protect and restore your roof"
image: "/images/red tiled roof getting washed by a professional cleaning contractor.jpg"
icon: "🏠"
order: 1
featured: true
seo:
  title: "Tile Roof Cleaning Adelaide | Professional Soft Washing Services"
  description: "Expert tile roof cleaning in Adelaide. Safe soft washing removes moss, lichen & dirt without damage. Free quotes. Fully insured. Call (08) 7282 0180"
---

## Professional Tile Roof Cleaning in Adelaide

Your tile roof is a significant investment that protects your home and adds to its curb appeal. Over time, Adelaide's weather conditions cause moss, lichen, algae, and dirt to accumulate on tile roofs, not only making them look unsightly but potentially causing damage that can lead to costly repairs.

[two-column image="/images/services/tile-roof-problems.jpg" position="right"]
### Why Tile Roofs Need Professional Cleaning

Tile roofs are particularly susceptible to organic growth due to their porous nature and the gaps between tiles where moisture can collect. Common issues we address include:

- **Moss and Lichen Growth**: These organisms can lift tiles and cause water ingress
- **Black Streaks and Stains**: Caused by algae and environmental pollutants
- **Dirt and Debris Buildup**: Accumulates in valleys and between tiles
- **Blocked Gutters**: From debris washing off neglected roofs

Our professional cleaning service addresses all these issues safely and effectively.
[/two-column]

<!-- Continue with rest of content, removing [why-choose] and [faq] sections -->
```

**File**: `src/content/services/tile-roof-cleaning/why-choose.yaml`
```yaml
heading: "Why Choose Adelaide Roof Cleaning Pros?"
reasons:
  - title: "Tile Roof Specialists"
    description: "Years of experience with all tile types"
  - title: "Safe Methods"
    description: "Soft washing protects your tiles"
  - title: "Fully Insured"
    description: "Complete liability coverage"
  - title: "Guaranteed Results"
    description: "100% satisfaction guarantee"
  - title: "Competitive Pricing"
    description: "Free quotes with no hidden costs"
```

**File**: `src/content/services/tile-roof-cleaning/faq.yaml`
```yaml
faqs:
  - question: "How often should tile roofs be cleaned?"
    answer: "We recommend professional cleaning every 2-3 years, depending on your location and surrounding environment."
  
  - question: "Will pressure washing damage my tiles?"
    answer: "That's why we use soft washing - high pressure can crack tiles and force water under them. Our low-pressure methods are completely safe."
  
  - question: "Do you treat moss and lichen?"
    answer: "Yes! We don't just remove visible growth - we treat the roots and spores to prevent rapid regrowth."
  
  - question: "How long does tile roof cleaning take?"
    answer: "Most residential tile roofs can be cleaned in 4-6 hours, depending on size and condition."
```

### Step 7: Clean Up ServiceContent Component

**File**: `src/components/ServiceContent.astro`

Remove all special section handling CSS:

```astro
---
export interface Props {
  title?: string;
  className?: string;
}

const { title, className = '' } = Astro.props;
---

<section class={`service-content py-16 bg-white ${className}`}>
  <div class="container mx-auto px-4">
    {title && (
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
    )}
    <div class="max-w-4xl mx-auto">
      <article class="prose prose-lg prose-gray max-w-none">
        <slot />
      </article>
    </div>
  </div>
</section>

<style>
  .prose {
    color: #374151;
  }
  
  .prose :global(h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #111827;
  }
  
  /* Remove all the h2-section, why-choose-section, and faq-related CSS */
  /* Keep only basic typography styles */
  
  /* Two-column layout styles remain if still using [two-column] shortcode */
  .prose :global(.two-column) {
    /* ... existing two-column styles ... */
  }
</style>
```

### Step 8: Remove Remark Plugins

**File**: `astro.config.mjs`

Remove plugin imports and references:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// Remove these imports:
// import { remarkSpecialSections } from './src/lib/remark-special-sections.js';
// import { remarkH2Sections } from './src/lib/remark-h2-sections.js';
import { remarkTwoColumnV2 } from './src/lib/remark-two-column-v2.js';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      // Remove these:
      // remarkSpecialSections,
      // remarkH2Sections,
      remarkTwoColumnV2,  // Keep if still using two-column shortcode
    ],
  },
  // ... rest of config
});
```

Then delete the plugin files:
- `src/lib/remark-special-sections.js`
- `src/lib/remark-h2-sections.js`

### Step 9: Migration Checklist

For each service file:

1. **Create subfolder**: `src/content/services/[service-name]/`
2. **Move markdown**: Rename `.md` to `index.md` in subfolder
3. **Extract FAQ content**:
   - Find `[faq]...[/faq]` section
   - Convert Q/A pairs to YAML format
   - Save as `faq.yaml`
4. **Extract Why Choose content**:
   - Find `[why-choose]...[/why-choose]` section
   - Convert list items to YAML format
   - Save as `why-choose.yaml`
5. **Clean markdown**:
   - Remove `[faq]` and `[why-choose]` sections
   - Keep `[two-column]` shortcodes if desired
   - Ensure frontmatter is intact
6. **Test the service page**:
   - Verify all sections load
   - Check responsive behavior
   - Compare with previous version

### Step 10: Testing Procedures

1. **Component Testing**:
   ```bash
   # Start dev server
   npm run dev
   
   # Test each service page
   # Check: /services/tile-roof-cleaning
   # Check: /services/metal-roof-cleaning
   # Check: /services/solar-panel-cleaning
   # Check: /services/gutter-cleaning
   ```

2. **Visual Comparison**:
   - Compare Why Choose sections between About and Service pages
   - Verify FAQ accordion functionality
   - Check heading sizes are consistent
   - Test mobile responsiveness

3. **Build Testing**:
   ```bash
   npm run build
   npm run preview
   ```

4. **Error Checking**:
   - Check browser console for errors
   - Verify no 404s for YAML files
   - Ensure fallbacks work when YAML missing

## Benefits of New Architecture

1. **Clean Separation**: Content (markdown) vs structured data (YAML)
2. **Consistency**: Same components used across all pages
3. **Maintainability**: No complex markdown parsing or AST manipulation
4. **Flexibility**: Easy to add/modify sections per service
5. **Type Safety**: Proper schemas for all data
6. **Performance**: Less processing at build time
7. **Debugging**: Easier to identify and fix issues

## Rollback Plan

If issues arise:

1. Keep backup of original service markdown files
2. Restore remark plugins to `astro.config.mjs`
3. Revert `services-default.yaml` changes
4. Move service files back to root of services folder

## Future Enhancements

1. **Service Templates**: Create different templates for different service types
2. **Dynamic Section Order**: Allow services to specify section order
3. **A/B Testing**: Support multiple versions of FAQ/Why Choose content
4. **Localization**: Support for multi-language YAML files
5. **CMS Integration**: Easy to adapt for headless CMS usage

## Notes for Implementation

- Start with one service (tile-roof-cleaning) as pilot
- Test thoroughly before migrating all services
- Keep the two-column shortcode system if it's working well
- Document any deviations from this plan
- Consider creating a migration script for bulk conversion

## Questions to Answer Before Starting

1. Should we keep the two-column shortcode system?
2. Do we need backwards compatibility for existing content?
3. Should FAQ/Why Choose sections have default content if YAML missing?
4. Do we want to support inline data override of YAML data?
5. Should section order be configurable per service?

## Success Criteria

- [ ] All service pages render correctly
- [ ] Why Choose sections look identical across all pages
- [ ] FAQ accordions work properly
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Performance is same or better
- [ ] Content editors find new system easier to use