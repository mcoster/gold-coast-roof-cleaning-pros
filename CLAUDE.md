# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AstroLocal Template** - A static site generation template for local service provider websites built with Astro, Tailwind CSS, and TypeScript. Designed for deployment on platforms like Netlify.

## Commands

### Development Commands
```bash
npm run dev          # Start development server (default: http://localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run astro check  # Check TypeScript and Astro components
```

### Common Tasks
```bash
npx astro add <integration>  # Add new integrations (e.g., react, vue, svelte)
npm install                   # Install dependencies
```

### Image Processing Commands
```bash
npm run images:manifest  # Scan content for required images
npm run images:analyze   # Analyze pending images with AI vision
npm run images:match     # Match images to website sections
npm run images:report    # Generate image requirements report
npm run images:process   # Run complete image pipeline
```

## Architecture & Tech Stack

* **Framework:** Astro (Static Site Generation)
* **Styling:** Tailwind CSS v4 (configured via @tailwindcss/vite)
* **Language:** TypeScript (strict mode)
* **Deployment:** Static hosting (Netlify, Vercel, etc.)
* **Configuration:** YAML-based business config + env vars for secrets
* **File Structure:**
  * `config/` - Business configuration (business.yaml)
  * `src/pages/` - Page routes (.astro files)
  * `src/components/` - Reusable Astro components (to be created)
  * `src/layouts/` - Page layouts (to be created)
  * `src/styles/` - Global styles (includes Tailwind CSS)
  * `public/` - Static assets
  * `instructions/` - Project documentation and design references
  * `business-images/` - Business-specific images
    * `pending/` - User-uploaded images awaiting processing
    * `approved/` - Processed and matched images
    * `stock/` - Downloaded stock photos

## Development Guidelines

### Core Principles
* **KISS:** Keep solutions simple and straightforward
* **YAGNI:** Only implement explicitly requested features
* **DRY:** Avoid code duplication
* **Single Responsibility:** One purpose per component/function
* **Fail Fast:** Handle errors explicitly, no silent failures

### Code Limits
* Files: Max 500 lines (refactor at 200-300)
* Functions: Max 50 lines
* Components: Max 100 lines

### Code Style
* Indentation: 2 spaces
* Strings: Single quotes
* Semicolons: Required
* Naming: camelCase (functions/variables), PascalCase (components)
* TypeScript: Explicit type annotations required

### Important Rules
* Only make explicitly requested changes
* Never add mock data to application code
* Never modify `.env` files
* Use existing patterns before introducing new ones
* Reference `instructions/reference/PRD.md` for project requirements

## Image Handling System

### Overview
The project includes an Intelligent Image Injection System that automatically analyzes and matches images to website sections. When working with images:

1. **Check for uploaded images** in `business-images/pending/`
2. **Run image analysis** with `npm run images:analyze`
3. **Match to sections** with `npm run images:match`
4. **Review manifest** at `business-images/manifest.json`

### SmartImage Component
Use the `SmartImage` component for automatic image handling:
```astro
<SmartImage
  slotId="homepage.hero.background"
  alt="Descriptive alt text"
  priority="high"
/>
```

### Fallback Chain
The system follows this priority order:
1. User-uploaded images (best relevance match)
2. Stock photos (if MCP configured)
3. SVG placeholders (always available)

### When Users Ask About Images
* Direct them to place images in `business-images/pending/`
* Explain the automatic matching process
* Reference `/instructions/active/IMAGE_GUIDE.md` for detailed documentation
* Run `npm run images:process` for complete pipeline

### Image Best Practices
* Use descriptive filenames (e.g., `team-photo-2024.jpg`, not `IMG_1234.jpg`)
* Upload high-quality originals (system handles optimization)
* Minimum 1920px width for hero images
* Group related images in subdirectories
- Always run the dev server with NODE_OPTIONS="--max-old-space-size=8192"