#!/bin/bash

# Migration script to update imports to use NPM package

echo "Starting migration to @mcoster/astro-local-package..."

# Components that should be imported from the package
PACKAGE_COMPONENTS=(
  "Breadcrumb"
  "BusinessHours"
  "ContactForm"
  "ContactInfo"
  "ContentBlocks"
  "CTABanner"
  "FloatingCTA"
  "Footer"
  "Header"
  "Hero"
  "HeroWithForm"
  "IconGrid"
  "MapEmbed"
  "MarkdownContent"
  "QuoteForm"
  "RelatedServices"
  "Section"
  "SEO"
  "ServiceAreas"
  "ServiceAreasWithLocations"
  "ServiceCard"
  "ServiceContent"
  "ServiceFAQ"
  "ServiceFeatures"
  "ServicesGrid"
  "SmartImage"
  "Spacer"
  "TwoColumnSection"
  "WhyUs"
)

# Update imports in all .astro files
echo "Updating component imports..."
for component in "${PACKAGE_COMPONENTS[@]}"; do
  echo "  - Updating $component imports..."
  find src -name "*.astro" -type f -exec sed -i '' \
    "s|from '@/components/${component}.astro'|from '@mcoster/astro-local-package/components/${component}.astro'|g" {} \;
done

# Update Layout import
echo "Updating Layout imports..."
find src -name "*.astro" -type f -exec sed -i '' \
  "s|from '@/layouts/Layout.astro'|from '@mcoster/astro-local-package/layouts/Layout.astro'|g" {} \;

# Update utility imports from lib to package utils
echo "Updating utility imports..."
UTILS=(
  "config-loader"
  "spintax"
  "template-processor"
  "image-registry"
  "locations"
)

for util in "${UTILS[@]}"; do
  echo "  - Updating $util imports..."
  find src -name "*.astro" -name "*.ts" -name "*.js" -type f -exec sed -i '' \
    "s|from '@/lib/${util}'|from '@mcoster/astro-local-package/utils/${util}'|g" {} \;
done

echo "Migration script complete!"
echo ""
echo "Next steps:"
echo "1. Run: export GITHUB_TOKEN=your_token_here"
echo "2. Run: npm install"
echo "3. Remove duplicate component files from src/components/"
echo "4. Test the build: npm run build"