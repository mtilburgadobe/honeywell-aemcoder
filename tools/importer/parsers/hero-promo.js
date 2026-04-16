/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: https://www.honeywell.com/us/en
 * Selector: .cmp-section-container-preview-mode.bg-color-gray-3
 * Structure: Row 1 = background image, Row 2 = heading + paragraph + CTA (single cell)
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector(':scope > img, picture img, img[src*="scene7"], img[src*="images/"]');

  // Extract heading
  const heading = element.querySelector('h5, h4, h3, h2');

  // Extract description paragraph - get second cmp-text p (first is heading)
  const allTexts = element.querySelectorAll('.cmp-text p');
  let description = null;
  for (const p of allTexts) {
    if (p.textContent.trim().length > 20 && !p.querySelector('b')) {
      description = p;
      break;
    }
  }

  // Extract CTA link
  const ctaLink = element.querySelector('.cmp-call-to-action a');

  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: All content in single cell array
  const contentItems = [];
  if (heading) contentItems.push(heading);
  if (description) contentItems.push(description);
  if (ctaLink) contentItems.push(ctaLink);
  cells.push(contentItems);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
