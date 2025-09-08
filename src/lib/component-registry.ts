/**
 * Component Registry
 * Maps component names to actual Astro components for dynamic rendering
 */

// Import all components that can be used in dynamic pages
import HeroWithForm from '@mcoster/astro-local-package/components/HeroWithForm.astro';
import Hero from '@mcoster/astro-local-package/components/Hero.astro';
import ServicesGrid from '@mcoster/astro-local-package/components/ServicesGrid.astro';
import TwoColumnSection from '@mcoster/astro-local-package/components/TwoColumnSection.astro';
import IconGrid from '@mcoster/astro-local-package/components/IconGrid.astro';
import CTABanner from '@mcoster/astro-local-package/components/CTABanner.astro';
import ServiceAreas from '@mcoster/astro-local-package/components/ServiceAreas.astro';
import ServiceAreasWithLocations from '@mcoster/astro-local-package/components/ServiceAreasWithLocations.astro';
import ContactForm from '@mcoster/astro-local-package/components/ContactForm.astro';
import ContactInfo from '@mcoster/astro-local-package/components/ContactInfo.astro';
import QuoteForm from '@mcoster/astro-local-package/components/QuoteForm.astro';
import BusinessHours from '@mcoster/astro-local-package/components/BusinessHours.astro';
import ServiceContent from '@mcoster/astro-local-package/components/ServiceContent.astro';
import RelatedServices from '@mcoster/astro-local-package/components/RelatedServices.astro';
import ServiceFeatures from '@mcoster/astro-local-package/components/ServiceFeatures.astro';
import ServiceFAQ from '@mcoster/astro-local-package/components/ServiceFAQ.astro';
import Breadcrumb from '@mcoster/astro-local-package/components/Breadcrumb.astro';
import MarkdownContent from '@mcoster/astro-local-package/components/MarkdownContent.astro';
import WhyUs from '@mcoster/astro-local-package/components/WhyUs.astro';
import Spacer from '@mcoster/astro-local-package/components/Spacer.astro';

/**
 * Registry of all available components
 * Add new components here to make them available for dynamic rendering
 */
export const componentRegistry: Record<string, any> = {
  // Hero Components
  'HeroWithForm': HeroWithForm,
  'Hero': Hero,
  
  // Content Components
  'TwoColumnSection': TwoColumnSection,
  'IconGrid': IconGrid,
  'ServicesGrid': ServicesGrid,
  'MarkdownContent': MarkdownContent,
  
  // Service-specific Components
  'ServiceContent': ServiceContent,
  'ServiceFeatures': ServiceFeatures,
  'ServiceFAQ': ServiceFAQ,
  'RelatedServices': RelatedServices,
  'ServiceAreas': ServiceAreas,
  'ServiceAreasWithLocations': ServiceAreasWithLocations,
  
  // Form Components
  'ContactForm': ContactForm,
  'ContactInfo': ContactInfo,
  'QuoteForm': QuoteForm,
  
  // Utility Components
  'CTABanner': CTABanner,
  'BusinessHours': BusinessHours,
  'Breadcrumb': Breadcrumb,
  'WhyUs': WhyUs,
  'Spacer': Spacer,
};

/**
 * Get a component from the registry
 * @param componentName - Name of the component to retrieve
 * @returns The component or null if not found
 */
export function getComponent(componentName: string) {
  const component = componentRegistry[componentName];
  
  if (!component) {
    console.warn(`Component "${componentName}" not found in registry. Available components:`, Object.keys(componentRegistry));
    return null;
  }
  
  return component;
}

/**
 * Check if a component exists in the registry
 * @param componentName - Name of the component to check
 * @returns True if the component exists
 */
export function hasComponent(componentName: string): boolean {
  return componentName in componentRegistry;
}

/**
 * Get all available component names
 * @returns Array of component names
 */
export function getAvailableComponents(): string[] {
  return Object.keys(componentRegistry);
}