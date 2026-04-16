/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-corporate. Base: hero.
 * Source: https://www.honeywell.com/us/en
 * Selector: #hero-banner
 * Structure: Row 1 = background image, Row 2 = heading + paragraph + CTA (single cell)
 */
export default function parse(element, { document }) {
  // Extract background image - check CSS background-image first, then child img
  let bgImage = element.querySelector(':scope > img, :scope > picture, .image_desktop img, picture img, img[src*="scene7"], img[src*="images/"]');

  // If no <img> found, check for CSS background-image on the element
  if (!bgImage) {
    const style = element.getAttribute('style') || '';
    const bgMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
    if (bgMatch) {
      let bgUrl = bgMatch[1];
      if (bgUrl.startsWith('//')) bgUrl = `https:${bgUrl}`;
      bgImage = document.createElement('img');
      bgImage.src = bgUrl;
      bgImage.alt = element.getAttribute('alt') || '';
    }
  }

  // Extract heading (H1 or H2)
  const heading = element.querySelector('h1, h2');

  // Extract description paragraph
  const description = element.querySelector('.cmp-text p, p.desc');

  // Extract CTA link
  const ctaLink = element.querySelector('.cmp-call-to-action a, a[href]');

  const cells = [];

  // Row 1: Background image (per hero block library)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: All content in a single cell (heading + description + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink && (!heading || !heading.contains(ctaLink)) && (!description || !description.contains(ctaLink))) {
    contentCell.push(ctaLink);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-corporate', cells });
  element.replaceWith(block);
}
