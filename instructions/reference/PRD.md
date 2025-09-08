# PRD v1.1: Astro Template for Local Service Providers

## 1. Overview
This document outlines the requirements for "Astro Local Template" - a premium, production-ready Astro template designed for local home service provider businesses. The goal is to provide developers with a fast, SEO-optimized, and easily customizable foundation for building lead-generating websites.

---

## 2. Target Audience
* **Primary User (The Developer):** Freelance developers or small agencies needing to rapidly build and deploy professional, high-performance websites for clients.
* **Secondary User (Digital Agency Team):** The digital agency team members assigned to update and modiy content.
* **End User (The Homeowner):** A potential customer who needs to quickly find service information and contact details, often on a mobile device.

---

## 3. Goals & Objectives
* Achieve a Google Lighthouse score of 95+ across all categories.
* Reduce development and deployment time significantly.
* Optimize the site structure and design for lead conversion.
* Ensure the project is a pure static site, perfect for hosting on platforms like Netlify.

---

## 4. Core Features & Requirements

#### 4.1. Design & Responsiveness
The template will use a mobile-first approach for a seamless experience on all devices.
* **FR-1.1:** Fluid layout adapting from mobile to desktop.
* **FR-1.2:** Intuitive mobile navigation (hamburger menu).
* **FR-1.3:** Prominent, click-to-call phone numbers.
* **FR-1.4:** **Styling:** The template will use **Tailwind CSS**. This choice is prioritized for its utility-first approach, which works exceptionally well with modern AI coding assistants and build tools for static sites.
* **FR-1.5:** **Theming:** The template will include several pre-built color schemes. A developer can select a theme through a configuration file. Customization is further simplified through the use of global CSS variables in the primary stylesheet, allowing for easy changes to colors, fonts, and spacing.
* **FR-1.6:** **Examples:** Screenshot examples of the style that we are aiming to achieve with this template are found within /instructions/sample-layouts

#### 4.2. SEO Best Practices
The template will have a strong technical SEO foundation.
* **FR-2.1:** Full control over page titles, meta descriptions, and Open Graph tags.
* **FR-2.2:** Strictly semantic HTML5 structure with a logical heading hierarchy (`<h1>`, `<h2>`, etc.).
* **FR-2.3:** **Structured Data (Schema):** The template will include pre-configured Schema.org markup for **`LocalBusiness`** (using data from the central config file) and **`Service`** (for individual service pages). No other schema types are required for V1.
* **FR-2.4:** Automatic generation of canonical URLs, an `sitemap.xml` file, and a default `robots.txt` file.

#### 4.3. Performance
Performance is paramount, leveraging Astro's static site generation.
* **FR-3.1:** Astro's `<Image />` component will be used for automatic image optimization, responsive sizing, and modern format conversion (WebP/AVIF).
* **FR-3.2:** Images and iframes below the fold will be lazy-loaded.
* **FR-3.3:** The template will ship with zero client-side JavaScript by default, using Astro Islands for any necessary interactivity.

#### 4.4. Content Management
The content management workflow will be simple and developer-centric.
* **FR-4.1:** **Git-based Workflow:** Content will be managed directly within the project's code repository. This is ideal for developers using AI coding tools and familiar with Git.
* **FR-4.2:** **Centralized Configuration:** A single file (e.g., `src/config.ts`) will manage global site data like Business Name, Phone Number, Address, Social Media links, etc.
* **FR-4.3:** **Content Collections:** Astro's content collections will be used for structured content like **Services** and **Testimonials**, with content written in Markdown files.

---

## 5. Key Pages & Components
The template will include the following pre-built assets:
* **Pages:**
    * Homepage
    * About Us
    * Service Pages (individual pages for services, eg. roof repair, gutter installation)
    * Location Pages (individual pages targeting locales within the service area, eg. Roofing Manhattan, Roofing Brooklyn)
    * Contact Us
    * Legal Compliance Pages - incl. Privacy Policy, Terms and Conditions
* **Components:**
    * Header & Footer
    * Hero Section
    * Testimonial Slider/Grid
    * **Contact Form:** A standard HTML `<form>` with no client-side JavaScript. It will be built to work seamlessly with platform-based form handling services like Netlify Forms by including the necessary HTML attributes.
    * "Why Choose Us" Section
    * Service Area List/Map

* **Out of Scope for V1:** A blog feature is explicitly **not** a requirement for the initial version of this template.