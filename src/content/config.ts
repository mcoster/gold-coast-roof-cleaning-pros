import { defineCollection, z } from 'astro:content';
import { getTemplateVariables } from '@/lib/config-loader';

// Get template variables for processing
const templateVars = getTemplateVariables();

/**
 * Process template variables in a string
 */
function processTemplate(str: string): string {
  if (!str) return str;
  
  let processed = str;
  Object.entries(templateVars).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
  });
  
  return processed;
}

/**
 * Homepage Collection Schema
 * 
 * This defines the structure for the homepage YAML file.
 * The file should be homepage.yaml in src/content/homepage/
 * Sections are rendered in the order they appear in the array
 */
const homepageCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sections: z.array(z.object({
      component: z.string(), // Component name from registry
      enabled: z.boolean().default(true),
      props: z.record(z.any()).optional(), // Component props
    })),
  }),
});

/**
 * Services Collection Schema
 * 
 * This defines the structure for service markdown files.
 * Each service should be a .md file in src/content/services/
 * 
 * The filename becomes the URL slug (e.g., residential-cleaning.md -> /services/residential-cleaning)
 */
const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string().transform(processTemplate), // Full description for SEO and service page
    excerpt: z.string().transform(processTemplate), // Short description for service cards (50-160 chars recommended)
    
    // Optional fields
    image: z.string().optional(), // Hero image for the service page
    icon: z.string().optional(), // Emoji or icon class for service cards
    order: z.number().default(99), // Display order (lower numbers appear first)
    featured: z.boolean().default(false), // Whether to show on homepage
    
    // SEO fields (optional)
    seo: z.object({
      title: z.string().optional().transform(str => str ? processTemplate(str) : str), // Override page title
      description: z.string().optional().transform(str => str ? processTemplate(str) : str), // Override meta description
    }).optional(),
  }),
});

/**
 * About Page Collection Schema
 * 
 * This defines the structure for the about page YAML file.
 * The file should be about.yaml in src/content/about/
 * Sections are rendered in the order they appear in the array
 */
const aboutCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sections: z.array(z.object({
      component: z.string(), // Component name from registry
      enabled: z.boolean().default(true),
      props: z.record(z.any()).optional(), // Component props
    })),
  }),
});

/**
 * Contact Page Collection Schema
 * 
 * This defines the structure for the contact page YAML file.
 * The file should be contact.yaml in src/content/contact/
 * Sections are rendered in the order they appear in the array
 */
const contactCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sections: z.array(z.object({
      component: z.string(), // Component name from registry
      enabled: z.boolean().default(true),
      props: z.record(z.any()).optional(), // Component props
    })),
  }),
});

// Note: Service FAQ and Why Choose YAML files are now loaded directly from
// the services collection at src/content/services/[service-slug]/faq.yaml
// and src/content/services/[service-slug]/why-choose.yaml

/**
 * Service Sections Collection Schema
 * 
 * This defines the structure for service page section YAML files.
 * The default file should be services-default.yaml in src/content/serviceSections/
 * Service-specific overrides can be services-[slug].yaml
 * Sections are rendered in the order they appear in the array
 */
const serviceSectionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sections: z.array(z.object({
      component: z.string(), // Component name from registry
      enabled: z.boolean().default(true),
      props: z.record(z.any()).optional(), // Component props
    })),
  }),
});

/**
 * Location Sections Collection Schema
 * 
 * This defines the structure for location page section YAML file.
 * The file should be locations.yaml in src/content/locationSections/
 * Sections support Spintax patterns and location-specific template variables
 * Sections are rendered in the order they appear in the array
 */
const locationSectionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sections: z.array(z.object({
      component: z.string(), // Component name from registry
      enabled: z.boolean().default(true),
      props: z.record(z.any()).optional(), // Component props
    })),
  }),
});

/**
 * Legal Pages Collection Schema
 * 
 * This defines the structure for legal page markdown files.
 * Each legal document should be a .md file in src/content/legal/
 * 
 * Content can use placeholders like {{businessName}}, {{state}}, {{city}}
 * which will be replaced with values from siteConfig during rendering
 */
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string().transform(processTemplate), // SEO meta description
    
    // Optional fields
    lastUpdated: z.date().optional(), // Manual last updated date (auto-generated if not provided)
    noindex: z.boolean().default(true), // Whether to exclude from search engines
    
    // Sections for organizing content (optional)
    sections: z.array(z.object({
      title: z.string(),
      order: z.number(),
    })).optional(),
    
    // Custom replacements for this specific document (optional)
    replacements: z.record(z.string()).optional(), // e.g., { "governingState": "California" }
  }),
});

// Export collections for Astro to use
export const collections = {
  services: servicesCollection,
  serviceSections: serviceSectionsCollection,
  locationSections: locationSectionsCollection,
  homepage: homepageCollection,
  about: aboutCollection,
  contact: contactCollection,
  legal: legalCollection,
};