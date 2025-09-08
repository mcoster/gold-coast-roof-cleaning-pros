# Intelligent Image Injection System - Technical Guide

## Overview

The Intelligent Image Injection System is an advanced image management solution for the AstroLocal template that automatically analyzes, matches, and optimizes images for your website. It uses AI-powered image analysis to match user-uploaded images to appropriate website sections, with intelligent fallbacks to stock photos or branded placeholders.

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ User Uploads    │────▶│ Image Analysis   │────▶│ Smart Matching  │
│ (pending/)      │     │ (AI Vision API)  │     │ (Relevance)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Stock Photos    │◀────│ Fallback Chain   │────▶│ Approved Images │
│ (MCP Server)    │     │ (User→Stock→SVG) │     │ (approved/)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ SmartImage      │◀────│ Image Registry   │────▶│ Build Output    │
│ Component       │     │ (manifest.json)  │     │ (optimized)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Core Components

### 1. Image Registry (`src/lib/image-registry.ts`)

The central nervous system of the image injection system. It:
- Scans all YAML and Markdown files for image references
- Maintains a manifest of required image slots
- Tracks which images are matched to which slots
- Generates reports on image coverage

**Key Methods:**
- `scanForImageSlots()` - Discovers all image requirements
- `scanAvailableImages()` - Inventories uploaded images
- `updateRegistry()` - Synchronizes manifest with current state
- `generateReport()` - Creates coverage analytics

### 2. Image Analysis Service (`src/lib/image-analysis.ts`)

AI-powered image understanding engine that:
- Analyzes image content using vision APIs
- Detects subjects, scenes, and business relevance
- Calculates quality scores
- Generates contextual metadata

**Analysis Categories:**
- Team photos (group detection)
- Service action shots (work in progress)
- Before/after comparisons
- Equipment and tools
- Building/location shots
- Certificates and awards

**Relevance Scoring Algorithm:**
```typescript
score = (
  subjectMatch * 20 +
  tagMatch * 15 +
  descriptionMatch * 10 +
  businessRelevance * 30 +
  quality * 25
) * confidence
```

### 3. SmartImage Component (`src/components/SmartImage.astro`)

Intelligent image display component with:
- Automatic fallback chain (User → Stock → Placeholder)
- Responsive optimization via Astro Image
- Multiple placeholder styles
- Debug mode for development
- Lazy loading and progressive enhancement

**Usage:**
```astro
<SmartImage
  slotId="homepage.hero.background"
  alt="Professional roof cleaning service"
  priority="high"
  fallback="gradient"
/>
```

### 4. Placeholder Generator (`src/lib/image-placeholders.ts`)

Creates professional SVG placeholders that:
- Use brand colors from site configuration
- Include contextual icons
- Embed metadata for later replacement
- Support multiple styles (gradient, pattern, blur)

### 5. Image Configuration (`src/config/image-config.ts`)

Centralized configuration for:
- API providers (vision, stock photos)
- Quality presets by component type
- Fallback chain preferences
- Matching algorithm weights
- Development settings

## Build Scripts

### `npm run images:manifest`
Scans all content files and generates a complete manifest of required images.

**Output:**
- `business-images/manifest.json` - Image requirements database
- `business-images/manifest-report.json` - Detailed coverage report

### `npm run images:analyze`
Analyzes all images in `pending/` folder using AI vision.

**Features:**
- Batch processing with progress indicators
- Caching of analysis results
- Quality assessment
- Business relevance detection

### `npm run images:match`
Matches analyzed images to website sections based on relevance.

**Algorithm:**
1. Sorts slots by priority (required first)
2. Calculates relevance scores for each image-slot pair
3. Assigns best matches above threshold
4. Moves matched images to `approved/` folder

### `npm run images:process`
Runs the complete pipeline: manifest → analyze → match

## Image Processing Pipeline

### Step 1: Upload Images
Place images in `business-images/pending/`:
```
pending/
├── team-photo-2024.jpg
├── roof-cleaning-action.jpg
├── before-after-gutter.jpg
└── hero-main.jpg
```

### Step 2: Run Analysis
```bash
npm run images:analyze
```

**Output Example:**
```
📸 Analyzing images...

  ✓ team-photo-2024.jpg
    Subjects: people, group, team
    Scene: group photo
    Quality: 92/100
    Business Type: Team Photo

  ✓ roof-cleaning-action.jpg
    Subjects: person working, roof
    Scene: action shot
    Quality: 88/100
    Business Type: Service Action
```

### Step 3: Match to Slots
```bash
npm run images:match
```

**Matching Process:**
```
🎯 Matching 4 images to 12 slots...

  ✓ homepage.hero: hero-main.jpg (95%)
  ✓ about.team: team-photo-2024.jpg (98%)
  ✓ services.roof: roof-cleaning-action.jpg (92%)
```

### Step 4: Review Manifest
Check `business-images/manifest.json` for:
- Matched images and scores
- Remaining unmatched slots
- Manual override opportunities

## Fallback Chain

The system implements a sophisticated multi-level fallback strategy:

```
1. User Image (Perfect Match)
   ↓ Score ≥ 90%
2. User Image (Good Match)
   ↓ Score ≥ 70%
3. Stock Photo (Multi-Provider)
   ├─ Unsplash (Primary)
   ├─ Pexels (If Unsplash fails)
   └─ Pixabay (Final fallback)
   ↓ If all fail or none configured
4. SVG Placeholder
   ↓ Always available
```

### Vision Analysis Fallback
```
1. OpenAI Vision API
   ↓ If fails or not configured
2. Anthropic Claude Vision
   ↓ If fails or not configured
3. Mock Analysis (filename-based)
   ↓ Always available
```

### Custom Configuration

Edit `business-images/image-config.json` to customize behavior:
```json
{
  "providers": {
    "vision": {
      "chain": ["openai", "anthropic", "mock"]
    },
    "stock": {
      "chain": ["unsplash", "pexels", "pixabay"]
    }
  },
  "fallback": {
    "chain": ["user", "stock", "placeholder"],
    "minRelevanceScore": 70
  }
}
```

## AI Vision Integration (Multi-Provider Fallback)

The system automatically tries vision providers in order until one succeeds:
1. **OpenAI Vision** (Primary)
2. **Anthropic Claude** (Fallback)
3. **Mock Analysis** (Always available)

### Configuration

```env
# OpenAI Vision (Primary Provider)
OPENAI_API_KEY=your-openai-api-key
VISION_MODEL_OPENAI=gpt-4-vision-preview  # or gpt-4-turbo

# Anthropic Claude Vision (Fallback)
ANTHROPIC_API_KEY=your-anthropic-api-key
VISION_MODEL_ANTHROPIC=claude-3-opus-20240229  # or claude-3-sonnet

# System will automatically use whichever is available
```

### Provider Behavior
- If OpenAI fails (rate limit, error), system tries Anthropic
- If both fail, uses intelligent mock analysis
- Results are cached to minimize API calls
- Each successful analysis shows which provider was used

## Stock Photo Integration (Multi-Provider Fallback)

The system automatically tries stock photo providers in order:
1. **Unsplash** (Best quality, 50 req/hour free)
2. **Pexels** (Good variety, 200 req/hour free)
3. **Pixabay** (Large collection, 100 req/min free)

### Configuration

```env
# Configure one or more providers
UNSPLASH_ACCESS_KEY=your-unsplash-key     # Recommended
PEXELS_API_KEY=your-pexels-key           # Good fallback
PIXABAY_API_KEY=your-pixabay-key         # Final fallback
```

### Fetching Stock Photos

```bash
# Fetch stock photos for unmatched slots
npm run images:fetch-stock

# Run complete pipeline including stock photos
npm run images:process-all
```

### Attribution
- Stock photos automatically include attribution files
- Check `business-images/stock/*-attribution.txt`
- System tracks which provider supplied each image

## Manual Overrides

### Override Specific Slot
Edit `manifest.json`:
```json
{
  "slots": {
    "homepage.hero.background": {
      "matchedImage": "approved/hero-main.jpg",
      "override": "approved/special-hero.jpg"
    }
  }
}
```

### Force Placeholder Style
In component usage:
```astro
<SmartImage
  src="/images/forced-placeholder.jpg"
  fallback="gradient"
  alt="Placeholder example"
/>
```

## Performance Optimization

### Image Formats
- **WebP**: Default for modern browsers (85% quality)
- **AVIF**: Optional for cutting-edge optimization
- **JPEG**: Fallback for compatibility

### Responsive Sizes
Component priorities determine generated sizes:
- **High**: 640, 768, 1024, 1280, 1536, 1920px
- **Medium**: 640, 768, 1024, 1280px
- **Low**: 640, 768, 1024px

### Lazy Loading
All images except hero sections use lazy loading by default.

## Troubleshooting

### Images Not Matching

**Issue:** High-quality images not matching to slots
**Solution:**
1. Check filename includes relevant keywords
2. Ensure image quality is good (well-lit, clear subject)
3. Lower `minRelevanceScore` in config (default: 70)
4. Review `manifest-report.json` for scoring details

### Build Performance

**Issue:** Slow builds with many images
**Solution:**
1. Process images in batches of 50-100
2. Use `approved/` folder for already-processed images
3. Enable caching in `analysis-cache.json`
4. Consider using WebP exclusively

### Memory Issues

**Issue:** Out of memory during processing
**Solution:**
```bash
NODE_OPTIONS="--max-old-space-size=8192" npm run images:process
```

## Advanced Features

### Custom Analysis Provider

Create a custom provider in `src/lib/image-analysis.ts`:
```typescript
private async analyzeWithCustom(imagePath: string): Promise<ImageAnalysis> {
  // Your custom analysis logic
  return customAnalysis;
}
```

### Batch Processing

For large image sets, create a batch script:
```typescript
// scripts/batch-process.ts
import { readdirSync } from 'fs';

const batches = chunkArray(images, 50);
for (const batch of batches) {
  await processBatch(batch);
}
```

### CI/CD Integration

Add to your build pipeline:
```yaml
# .github/workflows/build.yml
- name: Process Images
  run: |
    npm run images:manifest
    npm run images:analyze
    npm run images:match
```

## Best Practices

1. **Naming Convention**: Use descriptive filenames
   - ✅ `team-office-2024.jpg`
   - ❌ `IMG_1234.jpg`

2. **Image Quality**: Upload high-resolution originals
   - System will optimize for web automatically
   - Minimum 1920px width for hero images

3. **Organization**: Group related images
   - `pending/team/` - Team photos
   - `pending/services/` - Service action shots
   - `pending/gallery/` - Portfolio images

4. **Regular Maintenance**: 
   - Clear `analysis-cache.json` monthly
   - Review unused images quarterly
   - Update stock photo queries seasonally

## Security Considerations

1. **API Keys**: Never commit API keys
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Image Validation**: System validates all uploads
   - File type checking
   - Size limits (5MB default)
   - Malware scanning (when configured)

3. **Privacy**: Consider image content
   - Remove metadata from customer photos
   - Blur faces if required
   - Check licensing for stock photos

## Future Enhancements

### Planned Features
- [ ] Real-time image analysis via MCP
- [ ] Automatic stock photo fetching
- [ ] AI-generated images for placeholders
- [ ] Multi-language alt text generation
- [ ] A/B testing for image variations
- [ ] CDN integration for approved images

### Community Contributions
We welcome contributions! Areas of interest:
- Additional vision API providers
- More stock photo sources
- Advanced matching algorithms
- Performance optimizations

## Support

For issues or questions:
1. Check this guide first
2. Review `business-input/README.md`
3. Check console logs with `LOG_IMAGE_MATCHING=true`
4. Open an issue with manifest and error logs