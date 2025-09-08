# Unified Component Architecture Migration

## Overview
This document describes the migration from a type-based switch statement architecture to a unified component-based rendering system for the AstroLocal template. This migration improves code maintainability, reduces duplication, and creates a more extensible system for managing page sections.

## Migration Goals

### Primary Objectives
1. **Eliminate Switch Statements**: Replace verbose switch statements in page templates with dynamic component rendering
2. **Centralize Component Management**: Create a single registry for all components
3. **Standardize Content Structure**: Move from `type`/`data` pattern to `component`/`props` pattern
4. **Enable Context-Aware Processing**: Support template variables and Spintax processing
5. **Improve Maintainability**: Reduce code duplication and make adding new components easier

### Benefits Achieved
- Reduced homepage code from 135 lines to 50 lines
- Eliminated repetitive switch statement logic
- Created reusable rendering system for all pages
- Established foundation for future features (Spintax, location customization)
- Improved type safety with TypeScript interfaces

## Architecture Components

### 1. Component Registry (`/src/lib/component-registry.ts`)
Central registry mapping component names to Astro components:
```typescript
export const componentRegistry: Record<string, any> = {
  'HeroWithForm': HeroWithForm,
  'Hero': Hero,
  'TwoColumnSection': TwoColumnSection,
  'IconGrid': IconGrid,
  'ServicesGrid': ServicesGrid,
  // ... etc
};
```

### 2. Page Renderer (`/src/lib/page-renderer.ts`)
Unified rendering system with context-aware processing:

#### Context Classes
- **PageContext**: Base abstract class for template processing
- **TemplateContext**: For general pages (homepage, about, contact)
- **ServiceContext**: For service pages with service-specific variables
- **LocationContext**: For location pages with Spintax support

#### Core Function
```typescript
export function renderPageSections(
  sections: PageSection[],
  context: PageContext,
  specialHandlers?: SpecialHandlers
): any[]
```

### 3. Content Collection Schema Updates
Updated collections to use `component`/`props` structure:
```yaml
# Old structure
type: hero
data:
  heading: "Welcome"
  
# New structure  
component: Hero
props:
  title: "Welcome"
```

## Migration Progress

### ✅ Completed Migrations

#### Homepage (`/src/pages/index.astro`)
- Migrated from 135-line switch statement to 50-line unified renderer
- Updated all 7 YAML sections to new structure
- Verified with Playwright testing

#### About Page (`/src/pages/about.astro`)
- Migrated to unified renderer
- Updated all 5 YAML sections
- Created `WhyUs` component for about-specific content
- Added to component registry

#### Contact Page (`/src/pages/contact.astro`)
- Migrated to unified renderer
- Updated all 7 YAML sections
- Created `ContactInfo` component for contact details
- Added to component registry

### ⏳ Pending Migrations

#### Service Pages
- Individual service pages (`/src/pages/services/[slug].astro`)
- Service sections collection schema
- Migration of service-specific YAML files

#### Location Pages
- Location pages (`/src/pages/locations/[location].astro`)
- Location configuration system for editable content
- Integration with Spintax processing

## Implementation Guide

### Migrating a Page to Unified Architecture

#### Step 1: Update Content Collection Schema
```typescript
// In /src/content/config.ts
const collectionName = defineCollection({
  type: 'data',
  schema: z.object({
    component: z.string(),
    enabled: z.boolean().default(true),
    props: z.record(z.any()).optional(),
  }),
});
```

#### Step 2: Create Missing Components
If a section type doesn't have a corresponding component:
```astro
---
// Create new component in /src/components/
export interface Props {
  heading?: string;
  // ... other props
}

const { heading, ...props } = Astro.props;
---

<section>
  <!-- Component markup -->
</section>
```

#### Step 3: Register Components
```typescript
// In /src/lib/component-registry.ts
import NewComponent from '@/components/NewComponent.astro';

export const componentRegistry: Record<string, any> = {
  // ... existing components
  'NewComponent': NewComponent,
};
```

#### Step 4: Update YAML Files
Convert from type/data to component/props:
```yaml
# Old format
type: section-type
enabled: true
data:
  field: value

# New format
component: ComponentName
enabled: true
props:
  field: value
```

#### Step 5: Update Page Template
```astro
---
import { getCollection } from 'astro:content';
import { renderPageSections, TemplateContext } from '@/lib/page-renderer';
import { siteConfig } from '@/config/site';

const sections = await getCollection('collectionName');
const activeSections = sections
  .filter(section => section.data.enabled !== false)
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(section => section.data);

const context = new TemplateContext({
  phone: siteConfig.phone,
  formattedPhone: siteConfig.formattedPhone,
  businessName: siteConfig.businessName,
  email: siteConfig.email,
  mainLocation: siteConfig.mainLocation,
});

const renderedSections = renderPageSections(activeSections, context);
---

<Layout>
  <Header />
  <main>
    {renderedSections.map(({ Component, props }) => (
      <Component {...props} />
    ))}
  </main>
  <Footer />
</Layout>
```

## Template Variable Processing

The system supports automatic replacement of template variables:

### Available Variables
- `{{phone}}` - Raw phone number
- `{{formattedPhone}}` - Formatted phone number
- `{{businessName}}` - Business name from config
- `{{email}}` - Email address
- `{{mainLocation}}` - Main business location

### Location-Specific Variables
- `{{suburb}}` - Suburb name
- `{{postcode}}` - Postcode
- `{{state}}` - State
- `{{nearbySuburbs:N}}` - N nearby suburbs
- Spintax patterns: `{option1|option2|option3}`

## Next Steps

### High Priority
1. **Migrate Service Pages**: Apply unified architecture to service detail pages
2. **Migrate Location Pages**: Integrate with Spintax processing
3. **Create Location Config System**: Enable easy customization of location content

### Medium Priority
1. **Add More Components**: Gallery, Testimonials, BeforeAfter
2. **Enhance Context Processing**: Add more template variables
3. **Improve Type Safety**: Add stricter TypeScript types for props

### Low Priority
1. **Performance Optimization**: Lazy load components
2. **Documentation**: Create component usage guide
3. **Testing**: Add unit tests for renderer

## Testing Checklist

After migrating a page:
- [ ] All sections render correctly
- [ ] Template variables are processed
- [ ] Components receive correct props
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Forms work correctly
- [ ] Links are functional

## Common Issues & Solutions

### Issue: Component not found in registry
**Solution**: Ensure component is imported and added to `componentRegistry`

### Issue: Props not processing correctly
**Solution**: Check that context includes all needed variables

### Issue: Content not syncing
**Solution**: Restart dev server to clear Astro's content cache

### Issue: Schema validation errors
**Solution**: Ensure YAML files match new `component`/`props` structure

## Benefits Realized

1. **Code Reduction**: ~70% less code in page templates
2. **Maintainability**: Single place to add/modify components
3. **Extensibility**: Easy to add new section types
4. **Consistency**: All pages use same rendering system
5. **Future-Ready**: Foundation for Spintax and dynamic content

## Contact

This migration was implemented as part of Phase 12 of the AstroLocal template development. See `/instructions/active/TODO.md` for full project status.