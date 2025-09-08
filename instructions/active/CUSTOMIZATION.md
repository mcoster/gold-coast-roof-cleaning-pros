# AstroLocal Template - Customization Guide

This guide explains how to customize the AstroLocal template for your specific business needs. No coding knowledge is required for most customizations - just edit text files and configuration.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Business Information (.env)](#business-information-env)
3. [Page Content (YAML)](#page-content-yaml)
   - [Homepage](#homepage-sections)
   - [About Page](#about-page-sections)
   - [Contact Page](#contact-page-sections)
4. [Service Pages (Markdown)](#service-pages-markdown)
5. [Legal Pages (Privacy & Terms)](#legal-pages-privacy--terms)
6. [Colors and Branding](#colors-and-branding)
7. [Images and Media](#images-and-media)
8. [Forms and Contact](#forms-and-contact)
9. [Advanced Customization](#advanced-customization)

---

## Quick Start

The template uses three main types of files for customization:
- **`config/business.yaml`** - Your business details (name, phone, address, colors, etc.)
- **`.env`** - Sensitive data only (API keys, database passwords)
- **YAML files** - Page content sections (`/src/content/homepage/`, `/src/content/about/`, `/src/content/contact/`)
- **Markdown files** - Service pages (`/src/content/services/`)

### Essential First Steps
1. Edit `config/business.yaml` with your business information
2. Copy `.env.example` to `.env` and add any API keys (optional)
3. Replace placeholder images in `/public/images/`
4. Edit page sections in `/src/content/` folders
5. Update service pages in `/src/content/services/`

---

## Business Configuration (config/business.yaml)

All non-sensitive business information is stored in `config/business.yaml`. This file is version-controlled and contains your business details, colors, hours, and more:

```yaml
# Business Information
business:
  name: "Adelaide Roof Cleaning Pros"
  logo: "/images/logo.png"  # Optional
  tagline: "Professional Roof Cleaning Services Since 2015"
  phone: "(08) 7282 0180"
  email: "info@adelaideroofcleaning.com.au"
  owner_name: "John Smith"  # Optional
  broad_region: "Greater Adelaide"  # Optional
  form_location: "Adelaide"  # Optional

# Business Address
address:
  street: "13/543 Churchill Rd"
  city: "Kilburn"
  state: "SA"
  postcode: "5084"
  country: "Australia"

# Service Configuration
service:
  main_category: "Roof Cleaning"
  main_location: "Adelaide"
  radius_km: 50  # Service area radius
  # Optional: Override center location (defaults to business address)
  # center_lat: -34.9285
  # center_lng: 138.6007

# Brand Colors (hex codes without #)
colors:
  primary: "3B82F6"      # Main brand color
  secondary: "10B981"    # Accent color
  accent: "EF4444"       # Highlight color
  cta: "FF6B35"          # Call-to-action button color

# Business Hours
hours:
  monday: "8:00 AM - 6:00 PM"
  tuesday: "8:00 AM - 6:00 PM"
  wednesday: "8:00 AM - 6:00 PM"
  thursday: "8:00 AM - 6:00 PM"
  friday: "8:00 AM - 6:00 PM"
  saturday: "9:00 AM - 4:00 PM"
  sunday: "Closed"

# Social Media (optional - leave empty if not applicable)
social:
  facebook: "https://facebook.com/yourpage"
  instagram: "https://instagram.com/yourpage"
  linkedin: ""
  youtube: ""

# Website & SEO
website:
  url: "https://www.yoursite.com.au"
  google_maps_url: ""  # Optional
  google_reviews_url: ""  # Optional

# Google Maps Integration
google_maps:
  # Full iframe embed code from Google Maps (recommended)
  embed: '<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>'

# Footer Configuration
footer:
  # Leave empty for auto-selection of featured suburbs
  featured_suburbs: []
```

## Environment Variables (.env)

The `.env` file now contains ONLY sensitive information like API keys and passwords:

```bash
# PostGIS Database Connection (for location pages)
POSTGIS_HOST="localhost"
POSTGIS_PORT="5432"
POSTGIS_DATABASE="au_suburbs_db"
POSTGIS_USER="suburbs_user"
POSTGIS_PASSWORD="your-password-here"

# Maximum number of location pages to generate (default: 100)
# Note: Each page takes ~10 seconds to build
MAX_LOCATION_PAGES="100"

# Google Maps API Key (optional)
PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"

# AI Vision APIs (optional - for image analysis)
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"

# Stock Photo APIs (optional)
UNSPLASH_ACCESS_KEY="your-unsplash-key"
PEXELS_API_KEY="your-pexels-key"
PIXABAY_API_KEY="your-pixabay-key"
```

---

## Page Content (YAML)

All main pages (Homepage, About, Contact) use consolidated YAML files to control their content sections. This consistent approach makes it easy to customize any page without coding.

### How It Works

Each page has a single YAML file that contains all its sections in order:
- **Homepage:** `/src/content/homepage/homepage.yaml`
- **About Page:** `/src/content/about/about.yaml`
- **Contact Page:** `/src/content/contact/contact.yaml`

### File Structure
Each YAML file contains a `sections` array with components listed in display order:
```yaml
sections:
  - component: HeroWithForm
    enabled: true
    props:
      title: "Your Title"
      subtitle: "Your Subtitle"
  - component: TwoColumnSection
    enabled: true
    props:
      heading: "Section Heading"
      # ... more props
```

### Managing Sections (All Pages)
- **To disable a section:** Set `enabled: false` on that section
- **To reorder sections:** Move the section to a different position in the array
- **To add a section:** Add a new component object to the sections array
- **To delete a section:** Remove the section from the array or set `enabled: false`

### Template Variables (Shortcodes)
Use these variables in any YAML content field or Markdown files. They are automatically replaced at build time for optimal SEO:

**General Variables:**
- `{{businessName}}` - Your business name from .env
- `{{phone}}` - Your phone number
- `{{email}}` - Your email address
- `{{formattedPhone}}` - Phone formatted for tel: links
- `{{street}}` - Street address
- `{{city}}` - City name
- `{{state}}` - State abbreviation
- `{{postcode}}` - Postal code
- `{{mainLocation}}` - Complete location (e.g., "Adelaide, SA 5000")

**Service-Specific Variables (in service pages):**
- `{{serviceTitle}}` - Current service title
- `{{serviceDescription}}` - Service description
- `{{serviceSlug}}` - Service URL slug

**Legal Variables (Fixed - Queensland registration):**
- `{{governingState}}` - Always "Queensland" (company registration)
- `{{governingCity}}` - Always "Brisbane" (company registration)

**Location Variables (calculated dynamically):**
- `{{distance}}` - Distance from main location
- `{{direction}}` - Compass direction from main location
- `{{randomNearby}}` - Random nearby location from service areas

All shortcodes are processed server-side during build time, ensuring search engines see the actual content rather than placeholder variables.

### Common Section Types (Available Across Pages)

#### Hero Section
Used for page headers and banners. Available on Homepage, About, and Contact pages.

```yaml
component: HeroWithForm  # or Hero, HeroSection, etc.
enabled: true
props:
  heading: "Professional Pressure Washing Services"  # Main title
  subheading: "Transform your property with our expert cleaning"
  backgroundImage: "/images/hero-bg.jpg"  # Optional
  backgroundStyle: "gradient"  # Options: "gradient", "image"
  ctaText: "Get Free Quote"  # Optional button
  ctaLink: "/contact"
  showQuoteForm: true  # Homepage only - shows inline quote form
```

#### Two-Column Section
Text and image side-by-side. Perfect for storytelling and features.

```yaml
component: TwoColumnSection
enabled: true
props:
  heading: "Why Choose {{businessName}}"
  text: |
    We've been serving Adelaide for over 13 years, building our 
    reputation one satisfied customer at a time. Our team uses 
    professional-grade equipment and eco-friendly cleaning solutions.
    
    We guarantee:
    - 100% satisfaction or your money back
    - Fully insured and licensed operation
    - Same-day service available
    - Eco-friendly cleaning products
  image: "/images/team-photo.jpg"
  imageAlt: "Our professional team"
  imagePosition: "right"  # "left" or "right"
  link:
    text: "Learn More About Us"
    href: "/about"
```

#### Icon Grid / Values Section
Display features or values with icons.

```yaml
component: IconGrid  # or "ValuesSection" for About page
enabled: true
props:
  heading: "Why Choose Us"
  subheading: "What sets us apart"  # Optional
  columns: 3  # 2, 3, or 4
  items:  # or "values" for About page
    - icon: "shield-check"
      title: "Fully Insured"
      description: "Complete liability coverage"
    - icon: "clock"
      title: "On-Time Service"
      description: "We respect your schedule"
    - icon: "award"
      title: "Guaranteed Quality"
      description: "100% satisfaction guaranteed"
```

#### CTA Banner
Call-to-action section with buttons. Available on all pages.

```yaml
component: CTABanner
enabled: true
props:
  heading: "Ready to Get Started?"
  description: "Free quotes available - no obligation"
  background: "gradient"  # Options: "gradient", "solid"
  primaryButton:
    text: "Get Free Quote"
    href: "/contact"
  secondaryButton:
    text: "Call Now"
    href: "tel:{{phone}}"
```

---

### Homepage Sections

Location: `/src/content/homepage/homepage.yaml`

#### Services Grid (Homepage and Service Pages)
```yaml
component: ServicesGrid
enabled: true
props:
  heading: "Our Services"
  subtitle: "Professional cleaning solutions for every need"
  display: "featured"  # Options: "all", "featured", "specific"
  specific: []  # Array of service slugs when display is "specific"
  limit: 6  # Maximum number of services to show
  layout: "auto"  # Options: "auto", "fixed", "balanced"
  columns: 3  # Number of columns (used when layout is "fixed")
  showIcons: true  # Show service icons
  showViewAll: true  # Show "View All Services" button
  justifyContent: "center"  # Flexbox alignment: "center", "space-between", "flex-start"
  minCardWidth: 280  # Minimum card width in pixels
  maxCardWidth: 400  # Maximum card width in pixels
```

##### Flexible Service Grid Layout

The ServicesGrid component now features intelligent flexbox-based layouts that automatically adapt to any number of services, ensuring aesthetically pleasing displays:

**Auto Layout** (`layout: "auto"`):
- Automatically adjusts based on the number of services
- 2 services: Side-by-side with controlled width
- 3 services: Single row of three
- 4 services: 2x2 grid
- 5 services: 3+2 layout (avoids orphaned single item)
- 6 services: 2 rows of 3
- 7 services: 4+3 on wide screens, 3+2+2 on medium
- 8+ services: Optimal grid arrangement

**Fixed Layout** (`layout: "fixed"`):
- Uses the specified `columns` value
- Cards wrap to new rows as needed
- Best for consistent layouts across pages

**Responsive Behavior**:
- Desktop: Full column layout
- Tablet: Reduces to 2-3 columns
- Mobile: Single column stack

**Example Configurations**:
```yaml
# Homepage - Show featured services in auto layout
component: ServicesGrid
props:
  display: "featured"
  layout: "auto"
  justifyContent: "center"
  
# Services Page - Show all services
component: ServicesGrid
props:
  display: "all"
  layout: "auto"
  maxCardWidth: 380

# Specific services in fixed 2-column layout
component: ServicesGrid
props:
  display: "specific"
  specific: ["residential-services", "commercial-services"]
  layout: "fixed"
  columns: 2
```

### About Page Sections

Location: `/src/content/about/about.yaml`

#### Why Choose Us Section (About Only)
```yaml
component: WhyChooseUs
enabled: true
props:
  heading: "Why Choose {{businessName}}"
  reasons:
    - title: "Experienced Team"
      description: "Over 15 years of industry expertise"
    - title: "Quality Guaranteed"
      description: "100% satisfaction or your money back"
    - title: "Eco-Friendly"
      description: "Environmentally safe cleaning products"
    - title: "Competitive Pricing"
      description: "Fair, transparent pricing with no hidden fees"
```

---

### Contact Page Sections

Location: `/src/content/contact/contact.yaml`

#### Contact Form Section
```yaml
component: ContactForm
enabled: true
props:
  heading: "Get Your Free Quote"
  description: "Fill out the form below and we'll get back to you within 24 hours"
  includeServiceField: true
  submitText: "Send Message"
  redirectTo: "/thank-you"  # Optional success page
```

#### Contact Info Section
```yaml
component: ContactInfo
enabled: true
props:
  heading: "Get In Touch"
  showPhone: true
  phoneLabel: "Call Us"
  phoneDescription: "Mon-Fri 8am-6pm, Sat 9am-4pm"
  showEmail: true
  emailLabel: "Email Us"
  emailDescription: "We'll respond within 24 hours"
  showAddress: true
  addressLabel: "Visit Us"
  showMapLink: true
  mapLinkText: "Get Directions"
```

#### Business Hours Section
```yaml
component: BusinessHours
enabled: true
props:
  title: "Business Hours"
  showStatus: true  # Shows "Open Now" or "Closed"
  showNote: true
  noteText: "Hours may vary on holidays"
```

#### Emergency Notice Section
```yaml
component: EmergencyNotice
enabled: true
props:
  heading: "Need Emergency Service?"
  description: "For urgent service needs outside business hours"
  showPhone: true
  phoneText: "Call Now: {{phone}}"
  alertStyle: "warning"  # Options: "info", "warning", "danger"
```

#### Service Areas Section
```yaml
component: ServiceAreas
enabled: true
props:
  heading: "Areas We Serve"
  subheading: "Professional service throughout the region"
  showAllAreas: true  # Uses areas from .env
  showCta: true
  ctaText: "Don't see your area? Contact us!"
  ctaButtonText: "Check Your Area"
  ctaButtonLink: "/contact"
```

---

## Service Pages (Markdown + Dynamic Sections)

Service pages combine Markdown content with dynamic YAML sections, using the same flexible system as other pages.

### Service Content Structure
Service pages use a folder-based structure with separate YAML files for FAQ and Why Choose sections:

```
/src/content/services/
├── tile-roof-cleaning/
│   ├── index.md          # Main service content
│   ├── faq.yaml          # FAQ questions (optional)
│   └── why-choose.yaml   # Why choose reasons (optional)
├── metal-roof-cleaning/
│   ├── index.md
│   ├── faq.yaml
│   └── why-choose.yaml
└── gutter-cleaning/
    └── index.md          # YAML files are optional
```

**Note**: FAQ and Why Choose YAML files are stored separately in:
- `/src/content/serviceFAQ/[service-name]/faq.yaml`
- `/src/content/serviceWhyChoose/[service-name]/why-choose.yaml`

### Service Markdown Format (index.md)
```markdown
---
title: "Tile Roof Cleaning"
description: "Professional tile roof cleaning in Adelaide"
excerpt: "Expert tile roof cleaning with soft washing"
icon: "🏠"  # Emoji or icon class
image: "/images/services/tile-roof-cleaning.jpg"
featured: true  # Show in featured services
order: 1  # Display order in lists
seo:
  title: "Tile Roof Cleaning Adelaide | Professional Services"
  description: "Custom SEO description for search engines"
---

## Professional Tile Roof Cleaning

Your markdown content goes here. This will be rendered in the service-content section.

### What We Offer

- Detailed service descriptions
- Benefits and features
- Process explanations
- FAQs

### Our Process

1. **Initial Consultation** - Free assessment and quote
2. **Professional Service** - Expert delivery
3. **Quality Guarantee** - 100% satisfaction
```

### H2 Section Processing (Automatic Formatting)

Service pages automatically process H2 sections for enhanced visual presentation with alternating backgrounds. Special sections get custom formatting:

#### FAQ Sections
Create an FAQ accordion by using an H2 heading "Frequently Asked Questions" followed by bold questions:

```markdown
## Frequently Asked Questions

**How often should I schedule service?**
We recommend quarterly service for most homes, depending on your specific needs.

**Do you offer emergency services?**
Yes, we provide 24/7 emergency services for urgent situations.

**Are you licensed and insured?**
Absolutely. We're fully licensed, bonded, and insured for your peace of mind.
```

This automatically creates an interactive accordion with expandable answers.

#### Why Choose Sections
Create a feature grid by using an H2 heading containing "Why Choose" followed by a bullet list:

```markdown
## Why Choose Our Company?

- Experienced Team: Over 15 years of industry expertise
- Quality Guaranteed: 100% satisfaction or your money back
- Eco-Friendly: Environmentally safe cleaning products
- Competitive Pricing: Fair, transparent pricing with no hidden fees
```

This automatically creates a professional grid layout with checkmark icons.

### Service-Specific YAML Files

#### FAQ YAML Format (`/src/content/serviceFAQ/[service-name]/faq.yaml`)
```yaml
faqs:
  - question: "How often should tile roofs be cleaned?"
    answer: "We recommend professional cleaning every 2-3 years, depending on your location and surrounding environment."
  
  - question: "Will pressure washing damage my tiles?"
    answer: "That's why we use soft washing - high pressure can crack tiles and force water under them. Our low-pressure methods are completely safe."
  
  - question: "Do you treat moss and lichen?"
    answer: "Yes! We don't just remove visible growth - we treat the roots and spores to prevent rapid regrowth."
```

#### Why Choose YAML Format (`/src/content/serviceWhyChoose/[service-name]/why-choose.yaml`)
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

**Note**: These YAML files are automatically loaded when the service page renders. If no YAML files exist, the sections will be omitted from the page.

#### Regular H2 Sections
All other H2 sections are automatically wrapped with alternating white/gray backgrounds for visual separation:

```markdown
## Our Service Process

Standard content here gets wrapped with a background color.

## Service Benefits

This section will have a different background color for visual variety.
```

### Two-Column Content Blocks (New Feature)

Service pages and other markdown content now support powerful two-column shortcodes for creating engaging layouts with images and text side-by-side.

#### Basic Two-Column Shortcode
```markdown
[two-column image="/images/services/feature.jpg" position="right"]
### Feature Heading

Your **markdown content** here with full support for:
- Lists
- **Bold** and *italic* text
- Links and more

This content appears alongside the image for better visual engagement.
[/two-column]
```

#### Advanced Options
```markdown
[two-column 
  image="/images/services/process.jpg" 
  position="left" 
  background="gray"
  variant="expanded"]
### Our Process

Content with gray background and expanded padding for emphasis.

[/two-column]
```

#### Available Attributes
- **image** - Path to the image (required)
- **position** - Image position: "left" or "right" (default: "right")
- **background** - Background color: "white", "gray", "primary", "gradient" (default: "white")
- **variant** - Size variant: "default", "compact", "expanded" (default: "default")
- **imageAlt** - Alt text for the image (recommended for accessibility)

#### CTA Buttons in Blocks
Add call-to-action buttons within any two-column block:
```markdown
[two-column image="/images/service.jpg" position="right"]
### Ready to Get Started?

Professional service you can trust.

```

#### Best Practices
1. **Alternate image positions** - Switch between left and right for visual flow
2. **Use backgrounds sparingly** - Gray or primary backgrounds help important sections stand out
3. **Keep content concise** - Two-column blocks work best with focused content
4. **Descriptive images** - Use images that complement and enhance your text
5. **Strategic CTAs** - Place call-to-action buttons at key decision points

### Service Page Sections (YAML)

Service pages use a consolidated YAML file for all services, with optional service-specific overrides:

#### Directory Structure
```
/src/content/serviceSections/
├── services-default.yaml      # Default sections for ALL services
└── residential-services.yaml  # Optional: Custom sections for specific service
```

#### Default Service Sections
All services automatically get these sections from `services-default.yaml`:

```yaml
sections:
  # Hero with form
  - component: HeroWithForm
    enabled: true
    props:
      title: "{{serviceTitle}}"  # Pulls from service markdown
      subtitle: "{{serviceDescription}}"
      backgroundImage: "{{serviceImage}}"
      formTitle: "Get a FREE Quote"

  # Service content (markdown from service file)
  - component: ServiceContent
    enabled: true
    props:
      title: null
      className: null
      injectContent: true  # Injects markdown content

  # Service areas
  - component: ServiceAreasWithLocations
    enabled: true
    props:
      heading: "Areas We Service"
      subtitle: "We provide professional services across these locations"
      showMap: true

  # Call to action
  - component: CTABanner
    enabled: true
    props:
      heading: "Ready to Get Started with {{serviceTitle}}?"
      description: "Contact us today for a free consultation and quote."
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
      limit: null
      showAll: null
```

#### Custom Service Sections
To customize a specific service, create a YAML file with the service slug:

**Example: Custom sections for residential services**
Create `/src/content/serviceSections/residential-services.yaml`:
```yaml
sections:
  # Override hero section
  - component: HeroWithForm
    enabled: true
    props:
      title: "Residential {{serviceTitle}}"
      subtitle: "Professional home services"
      # ... custom props

  # Add FAQ section
  - component: ServiceFAQ
    enabled: true
    props:
      heading: "Frequently Asked Questions"
      subtitle: "Get answers to common questions"
      faqs:
        - question: "How often should I schedule service?"
          answer: "We recommend quarterly service for most homes."
        - question: "Do you offer emergency services?"
          answer: "Yes, we provide 24/7 emergency services."
        - question: "Are you licensed and insured?"
          answer: "Absolutely. We're fully licensed, bonded, and insured."

  # Keep other default sections
  - component: ServiceContent
    enabled: true
    props:
      injectContent: true

  # ... other sections
```

#### Available Service Section Components
- `HeroWithForm` - Hero section with embedded form
- `Hero` - Standard hero section
- `ServiceContent` - Renders markdown content
- `ServiceFeatures` - Feature grid with icons
- `ServiceFAQ` - Frequently asked questions accordion
- `ServiceProcess` - Step-by-step process
- `RelatedServices` - Links to other services
- `TwoColumnSection` - Text and image sections
- `IconGrid` - Features/benefits grid
- `CTABanner` - Call-to-action sections
- `ServiceAreasWithLocations` - Service areas with optional map
- `Testimonials` - Customer reviews (coming soon)
- `Gallery` - Image gallery (coming soon)

### Template Variables in Service Sections
These variables are automatically replaced in YAML content:
- `{{serviceTitle}}` - The service title
- `{{serviceDescription}}` - The service description
- `{{businessName}}` - Your business name
- `{{phone}}` - Your phone number
- `{{email}}` - Your email address

### Tips for Service Pages
1. **Keep markdown focused on content** - Let YAML handle layout
2. **Use default sections** - Only create custom YAML files when needed
3. **Section order matters** - Sections display in the order they appear in the YAML array
4. **Test on mobile** - Ensure sections look good on all devices
5. **SEO optimization** - Use the seo frontmatter for better search visibility

- Increases property value
- Prevents damage from mold and mildew
- Improves curb appeal
- Extends surface lifespan

### Pricing

Our pressure washing services start at $199 for standard driveways. 
Contact us for a free, personalized quote based on your specific needs.

[Get Your Free Quote](/contact)
```

### Service Metadata Options
```yaml
title: "Service Name"           # Required
description: "Brief description" # Required - used for SEO
icon: "icon-name"               # Required - icon identifier
image: "/images/service.jpg"    # Optional - hero image
featured: true                  # Optional - show in featured section
order: 1                        # Required - sort order
price: "From $199"              # Optional - pricing information
duration: "2-3 hours"           # Optional - typical job duration
```

---

## Legal Pages (Privacy & Terms)

Legal pages are managed through Markdown files in `/src/content/legal/`. These pages automatically replace shortcode tokens with your business information at build time, ensuring proper SEO indexing.

### Legal Page Files
```
/src/content/legal/
  privacy-policy.md      # Privacy Policy content
  terms-conditions.md    # Terms & Conditions content
  README.md             # Documentation for legal pages
```

### Available Tokens
These tokens are automatically replaced with values from `/src/config/site.ts`:

| Token | Description | Example |
|-------|-------------|---------|
| `{{businessName}}` | Your business name | Adelaide Pressure Cleaning |
| `{{phone}}` | Your phone number | (08) 7228 0262 |
| `{{email}}` | Your email address | info@adelaidepressure.com.au |
| `{{street}}` | Street address | 123 Main Street |
| `{{city}}` | City | Adelaide |
| `{{state}}` | State/Province | SA |
| `{{postcode}}` | Postal code | 5000 |

### Jurisdiction Settings (Terms & Conditions)
**IMPORTANT:** Legal jurisdiction is always Queensland/Brisbane as Web and Glow Pty Ltd is registered in Queensland.

The Terms & Conditions automatically use Queensland as the governing jurisdiction:
> "These Terms are governed by the laws of Queensland, Australia."

This is hardcoded and cannot be changed, regardless of where the service is provided, because the company (Web and Glow Pty Ltd) that owns all websites is registered in Queensland.

### Customizing Legal Content

1. **Edit the Markdown files** in `/src/content/legal/`
2. **Use tokens** for business information that might change
3. **Override jurisdiction** if needed in the Terms frontmatter
4. **Important Notice**: The current templates include disclosures for Web and Glow Pty Ltd as the operating company. Update these sections with your business structure.

### Web and Glow Pty Ltd Disclosures
The templates include specific disclosures for lead generation/connection services:
- Privacy Policy: Section about role as a connection service
- Terms & Conditions: Service provider arrangement notices

**If you're not operating as a lead generation service**, remove or modify these sections.

### Setting Last Updated Date
The last updated date is automatically generated unless you specify it in the frontmatter:

```yaml
---
lastUpdated: 2024-01-15  # Optional - auto-generated if not provided
---
```

---

## Colors and Branding

### Setting Brand Colors
Edit the color values in your `config/business.yaml` file:

```yaml
colors:
  primary: "3B82F6"      # Blue - Main brand color
  secondary: "10B981"    # Green - Supporting elements
  accent: "EF4444"       # Red - Highlights
  cta: "FF6B35"          # Orange - Call-to-action buttons
```

### Color Usage in Template
- **Primary:** Headers, navigation, main brand elements
- **Secondary:** Supporting elements, icons
- **Accent:** Highlights, special features
- **CTA:** Call-to-action buttons, important links

### Common Color Schemes

#### Professional Blue
```bash
PUBLIC_COLOR_PRIMARY="2563EB"
PUBLIC_COLOR_SECONDARY="3B82F6"
PUBLIC_COLOR_ACCENT="60A5FA"
PUBLIC_COLOR_CTA="EF4444"
```

#### Eco Green
```bash
PUBLIC_COLOR_PRIMARY="10B981"
PUBLIC_COLOR_SECONDARY="34D399"
PUBLIC_COLOR_ACCENT="6EE7B7"
PUBLIC_COLOR_CTA="F59E0B"
```

#### Bold Red
```bash
PUBLIC_COLOR_PRIMARY="DC2626"
PUBLIC_COLOR_SECONDARY="EF4444"
PUBLIC_COLOR_ACCENT="F87171"
PUBLIC_COLOR_CTA="1F2937"
```

---

## Images and Media

### Image Locations
Place your images in `/public/images/`:
```
/public/images/
  hero-bg.jpg           # Homepage hero background
  logo.png              # Business logo
  team-photo.jpg        # About section photo
  /services/            # Service-specific images
    pressure-washing.jpg
    roof-cleaning.jpg
  /gallery/             # Gallery images
    before-after-1.jpg
    before-after-2.jpg
```

### Recommended Image Sizes
- **Hero backgrounds:** 1920x1080px (landscape)
- **Service images:** 800x600px
- **Team photos:** 600x400px
- **Gallery images:** 800x600px
- **Logo:** 200x60px (or proportional)

### Image Optimization Tips
1. Use JPEG for photos (smaller file size)
2. Use PNG for logos and graphics with transparency
3. Compress images before uploading (use TinyPNG or similar)
4. Keep images under 500KB when possible

### Replacing Placeholder Images
1. Navigate to `/public/images/`
2. Delete or rename the placeholder image
3. Upload your new image with the same filename
4. Or update the filename reference in the relevant YAML/Markdown file

---

## Forms and Contact

### Quote Form Configuration
The quote form uses Netlify Forms. Fields can be customized in the form component.

### Standard Form Fields
- Name (required)
- Phone (required)
- Email (required)
- Service Type (dropdown)
- Message (textarea)
- Preferred Contact Time (optional)

### Form Notifications
Netlify Forms can send notifications to your email:
1. Log into Netlify dashboard
2. Go to Forms → Settings
3. Add notification email address

### Adding Custom Fields
To add custom fields to forms, edit the form component and add:
```html
<label>
  Property Type:
  <select name="property-type" required>
    <option value="">Select...</option>
    <option value="residential">Residential</option>
    <option value="commercial">Commercial</option>
  </select>
</label>
```

---

## Advanced Customization

### Architecture Overview (v1.5.0)

The template uses a modern, maintainable architecture with TypeScript and unified processing:

#### Template Processing Architecture
All template variable replacement is handled by a unified `TemplateProcessor` system:
- **Base TemplateProcessor**: Handles common business variables (name, phone, email, etc.)
- **ServiceTemplateProcessor**: Extends base with service-specific variables
- **LocationTemplateProcessor**: Extends base with location and Spintax support

This eliminates code duplication and ensures consistent variable processing across all pages.

#### Component Registry Pattern
Dynamic components are loaded through a centralized registry:
- Components are registered once in `/src/lib/component-registry.ts`
- Pages use component names (strings) in YAML configurations
- The registry handles component resolution at runtime

#### TypeScript Migration
All core modules are now TypeScript with full type safety:
- Remark plugins (markdown processing)
- Template processors
- Image handling utilities
- Build scripts

#### Simplified Image Matching
The complex AI-based image analysis has been replaced with a lightweight keyword matcher:
- 80% simpler code
- Instant matching (no API calls)
- Keyword-based relevance scoring
- Fallback to placeholder images

### Adding New Page Sections
1. Open the appropriate YAML file:
   - Homepage: `/src/content/homepage/homepage.yaml`
   - About: `/src/content/about/about.yaml`
   - Contact: `/src/content/contact/contact.yaml`
2. Add a new section object to the `sections` array at your desired position
3. Specify the component name and props
4. The component must exist in `/src/components/` and be registered in the component registry

### Creating Additional Pages
Add new `.astro` files to `/src/pages/`:
- `/src/pages/gallery.astro` → yoursite.com/gallery
- `/src/pages/faq.astro` → yoursite.com/faq

### Modifying Navigation Menu
Edit the Header component to add/remove menu items:
```astro
<!-- In Header.astro -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/services">Services</a>
  <a href="/gallery">Gallery</a>  <!-- New item -->
  <a href="/contact">Contact</a>
</nav>
```

### Custom CSS
Add custom styles to `/src/styles/global.css`:
```css
/* Custom styles */
.my-custom-class {
  /* your styles */
}
```

---

## Deployment Checklist

Before going live:
- [ ] Replace all placeholder content in `.env`
- [ ] Update all images in `/public/images/`
- [ ] Customize homepage sections in `/src/content/homepage/`
- [ ] Customize about page sections in `/src/content/about/`
- [ ] Customize contact page sections in `/src/content/contact/`
- [ ] Create/edit all service pages in `/src/content/services/`
- [ ] Review and update Privacy Policy in `/src/content/legal/privacy-policy.md`
- [ ] Review and update Terms & Conditions in `/src/content/legal/terms-conditions.md`
- [ ] Update Web and Glow Pty Ltd disclosures if not applicable
- [ ] Verify legal jurisdiction settings (governingState, governingCity)
- [ ] Test all forms (contact form, quote form)
- [ ] Set up form notifications in Netlify
- [ ] Update meta descriptions and SEO content
- [ ] Add Google Analytics ID (if using)
- [ ] Test on mobile devices
- [ ] Verify all contact information is correct
- [ ] Check business hours are accurate
- [ ] Confirm service areas are complete

---

## Location Pages (Phase 10 - Complete)

### Overview
The template includes fully functional dynamic location-specific landing pages powered by PostGIS and Spintax. This feature generates unique, SEO-optimized pages for each suburb in your service area, with smart footer links for improved SEO discovery.

### Current Status
- ✅ **PostGIS Integration**: Connected to database with 16,498 Australian suburbs
- ✅ **Spintax Engine**: Generates unique content variations for each location
- ✅ **Page Generator**: Fully functional with 506+ location pages
- ✅ **Footer Location Links**: Smart selection with population-based prioritization
- ✅ **Google Maps Integration**: Embedded maps with API key support

### Location Pages Configuration

The template now includes **static JSON suburb data** for location pages, eliminating the need for PostGIS database access during deployment. Location pages work automatically on platforms like Netlify.

#### Using Static JSON Data (Default - No Setup Required)
Location pages are automatically generated using the pre-exported `src/data/suburbs.json` file containing 511 suburbs within 50km of Adelaide. No database configuration needed!

#### Optional: Using Live PostGIS Database
If you want to use a live PostGIS database instead of static data, add these settings to your `.env` file:

```bash
# Service radius for location page generation (in kilometers)
SERVICE_RADIUS_KM="50"

# Main location for SEO (e.g., "Adelaide", "Western Sydney")
PUBLIC_MAIN_LOCATION="Adelaide"

# Optional: Override center location (defaults to business address)
# SERVICE_CENTER_LAT="-34.9285"
# SERVICE_CENTER_LNG="138.6007"

# Footer featured suburbs (comma-separated, leave empty for auto-selection)
# Auto-selection uses population data and geographic diversity
# Example: "North Adelaide,Glenelg,Norwood,Unley,Prospect,Burnside"
FOOTER_FEATURED_SUBURBS=""

# Maximum number of location pages to generate (default: 100)
# Note: Each page takes ~10 seconds to build due to Google Maps iframe processing
# 100 pages = ~17 minutes, 500 pages = ~85 minutes
MAX_LOCATION_PAGES="100"

# PostGIS Database Connection (Optional - only needed if not using static JSON data)
# Option 1: Connection string
# POSTGIS_CONNECTION_STRING="postgresql://user:password@localhost:5432/suburbs_db"

# Option 2: Individual connection parameters
POSTGIS_HOST="localhost"
POSTGIS_PORT="5432"
POSTGIS_DATABASE="au_suburbs_db"
POSTGIS_USER="suburbs_user"
POSTGIS_PASSWORD=""
```

### Google Maps Integration
Configure Google Maps embed in the footer:

```bash
# Google Maps Integration (Optional)
# Option 1: Full iframe embed code from Google Maps (No API key needed - RECOMMENDED)
# Get this from Google Maps: Click Share → Embed a map → Copy HTML
# Example: PUBLIC_GOOGLE_MAPS_EMBED="<iframe src='https://www.google.com/maps/embed?pb=...' width='600' height='450'></iframe>"
# PUBLIC_GOOGLE_MAPS_EMBED=""

# Option 2: Google Place ID (for Google Business Profile - requires API key)
# Get this from Google Maps: Search your business → Share → Copy link
# Extract the ID after "place/" in the URL
# Example: PUBLIC_GOOGLE_MAPS_PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4"
# PUBLIC_GOOGLE_MAPS_PLACE_ID=""

# Option 3: API key for automatic maps (requires Google Cloud account)
# Required for Places API search or if using Place ID above
# Get from: https://console.cloud.google.com/
# PUBLIC_GOOGLE_MAPS_API_KEY=""
```

### Updating Suburb Data

#### Option 1: Using Static JSON (Recommended)
The template includes pre-exported suburb data in `src/data/suburbs.json`. To update this data:

```bash
# 1. Ensure PostGIS database is running locally
# 2. Update center coordinates in scripts/export-suburbs.ts if needed
# 3. Run the export script
npx tsx scripts/export-suburbs.ts
```

This will regenerate `src/data/suburbs.json` with the latest suburb data.

#### Option 2: Using Live PostGIS Database
If using a PostGIS database, it needs:
- **suburbs** table with columns: id, name, state, latitude, longitude, location (geometry)
- **suburb_postcodes** table with columns: suburb_id, postcode, is_primary (optional)
- PostGIS extension enabled
- Spatial index on geometry column

### Spintax Templates
Location pages use Spintax patterns to generate unique content:

```javascript
// Example template variations
"{Professional|Expert|Trusted} services in {{suburb}}"
// Generates: "Professional services in North Adelaide"
//       or: "Expert services in North Adelaide"
//       or: "Trusted services in North Adelaide"
```

### Available Placeholders
- `{{suburb}}` - Suburb name
- `{{postcode}}` - Postal code
- `{{state}}` - State abbreviation
- `{{distance}}` - Distance from service center
- `{{direction}}` - Compass direction (N, NE, E, etc.)
- `{{nearbySuburbs:5}}` - List of 5 nearby suburbs
- `{{businessName}}` - Your business name
- `{{serviceRadius}}` - Service area radius

### Testing Location Features

Export/update suburb data from PostGIS:
```bash
npx tsx scripts/export-suburbs.ts
```

Test PostGIS connection (if using database):
```bash
npx tsx test-postgis.ts
```

Test location queries:
```bash
npx tsx test-locations.ts
```

Test Spintax templates:
```bash
npx tsx test-spintax.ts
```

---

## Getting Help

### Common Issues

**Images not showing:**
- Check file paths (must start with `/`)
- Verify image exists in `/public/images/`
- Check filename case sensitivity

**Sections not appearing:**
- Ensure `enabled: true` in YAML file
- Check YAML syntax (use yamllint.com)
- Verify file is in correct directory

**Forms not working:**
- Ensure Netlify Forms is enabled
- Check form has `data-netlify="true"` attribute
- Verify all required fields are present

### Support Resources
- Documentation: `/instructions/`
- GitHub Issues: [your-repo-url]/issues
- Astro Docs: https://docs.astro.build
- Netlify Forms: https://docs.netlify.com/forms/setup/

---

*Last updated: 2025-09-07*
*Template Version: 1.6.0*

### Change Log
- **v1.6.0 (2025-09-07)**: Configuration refactoring - YAML-based business configuration, separated sensitive data to .env
- **v1.5.0 (2025-09-07)**: Major code quality improvements - Unified template processing, TypeScript migration, simplified image matching
- **v1.4.3 (2025-09-07)**: Image cleanup - Removed 17 unused placeholder and service images
- **v1.4.2 (2025-09-07)**: Server-side shortcode processing - Replaced client-side JavaScript with build-time remark plugin for better SEO
- **v1.4.1 (2025-09-07)**: UI/UX refinements - Fixed H2 section backgrounds, FAQ styling, About page alignment
- **v1.4.0 (2025-09-07)**: YAML-based service content architecture for FAQ and Why Choose sections
- **v1.3.1 (2025-09-05)**: Added flexible service grid display with intelligent auto-layout
- **v1.3.0 (2025-09-05)**: Added two-column content blocks with markdown shortcode support
- **v1.2.0 (2025-09-02)**: Added location pages with PostGIS integration