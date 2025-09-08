# Business Images Directory

This directory contains all business-specific images that are used to customize the website. The intelligent image injection system processes these images to automatically match them to appropriate website sections.

## Directory Structure

```
business-images/
├── pending/         # Upload your business images here for AI analysis
├── approved/        # Processed images that have been matched to site sections
├── stock/           # Downloaded stock photos (auto-generated)
├── manifest.json    # Auto-generated image metadata and mappings
├── analysis-cache.json  # AI analysis results cache
├── stock-cache.json     # Stock photo metadata cache
└── manifest-report.json # Image matching report
```

## Usage Guide

### 1. Uploading Images

Place all your business images in the `pending/` directory. These can include:

- **Storefront/building photos** - Exterior shots of your business location
- **Team photos** - Staff members, team at work
- **Service action shots** - Workers performing services
- **Before/after photos** - Showing results of your work
- **Equipment photos** - Tools and machinery used
- **Completed projects** - Examples of finished work
- **Certificates/awards** - Professional certifications

**Supported formats:** JPG, PNG, WebP
**Recommended size:** At least 1920px wide for hero images, 800px+ for content images

### 2. Image Processing Workflow

Once images are uploaded to `pending/`:

1. Run the image analysis command:
   ```bash
   npm run images:analyze
   ```

2. The system will:
   - Analyze each image using AI vision to understand content
   - Match images to appropriate website sections
   - Generate optimized versions for web use
   - Create smart alt text for accessibility
   - Move matched images to `approved/` directory

3. Review the generated manifest:
   ```bash
   npm run images:report
   ```

4. For any unmatched image slots, the system will:
   - First check for generic matches from your uploaded images
   - Then fetch appropriate stock photos if configured
   - Finally use smart placeholders if no images are available

### 3. Image Naming Best Practices

While not required (AI will analyze content), descriptive filenames help:

- `team-photo-2024.jpg` → More likely to match team/about sections
- `roof-cleaning-action.jpg` → Will match service-specific sections
- `before-after-gutter.jpg` → Recognized as comparison image
- `hero-main.jpg` → Considered for homepage hero section

### 4. Automatic Fallbacks

The system implements an intelligent fallback chain:

1. **Your uploaded images** (best match based on AI analysis)
2. **Your uploaded images** (generic match if no perfect fit)
3. **Stock photos** (if MCP integration is configured)
4. **Smart placeholders** (professional SVG with your brand colors)

### 5. Manual Overrides

To manually specify an image for a particular slot, edit the `manifest.json` file after running the analysis:

```json
{
  "slots": {
    "homepage.hero.background": {
      "required": true,
      "matched": "approved/hero-main.jpg",
      "override": "approved/specific-image.jpg"  // Add this line
    }
  }
}
```

### 6. Custom Configuration (Optional)

To customize image matching behavior, create an `image-config.json` file in the root of this directory:

```json
{
  "providers": {
    "vision": {
      "chain": ["openai", "anthropic", "mock"]
    }
  },
  "fallback": {
    "minRelevanceScore": 70
  }
}
```

## Commands

```bash
# Analyze uploaded images
npm run images:analyze

# Generate requirements report
npm run images:report

# Match images to slots
npm run images:match

# Fetch missing stock photos (requires API keys)
npm run images:fetch-stock

# Run complete image pipeline
npm run images:process
```

## Troubleshooting

### Images not being matched
- Ensure images are high quality and well-lit
- Check that subject matter is clear and relevant
- Review the manifest.json for matching scores
- Consider renaming files to be more descriptive

### Build errors
- Verify all images in `approved/` are valid image files
- Check that manifest.json is valid JSON
- Ensure no duplicate filenames exist

### Performance issues
- Optimize large images before uploading (max 5MB recommended)
- Limit pending images to 50-100 at a time for processing
- Use WebP format for better performance

## Support

For assistance with the image injection system, refer to:
- `/instructions/active/IMAGE_GUIDE.md` - Detailed technical documentation
- `CLAUDE.md` - AI agent instructions for customization