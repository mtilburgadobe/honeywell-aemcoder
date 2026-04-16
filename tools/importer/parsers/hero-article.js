/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Split layout: text left, image right.
 * Source: Honeywell featured stories and press releases
 * Selector: #hero-banner-split
 * Structure: Row 1 = [h1 + subtitle], Row 2 = [image]
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h1, h2');

  // Extract subtitle/description paragraph
  const description = element.querySelector('.cmp-text p, p:not(:has(img))');

  // Extract hero image - check CSS background first, then img elements
  let img = element.querySelector('img[src*="scene7"], img[src*="honeywell"], .s7dm-dynamic-media img');
  if (!img) {
    const style = element.getAttribute('style') || '';
    const bgMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
    if (bgMatch) {
      let bgUrl = bgMatch[1];
      if (bgUrl.startsWith('//')) bgUrl = 'https:' + bgUrl;
      img = document.createElement('img');
      img.src = bgUrl;
      img.alt = element.getAttribute('alt') || '';
    }
  }

  const cells = [];

  // Row 1: Text content (heading + subtitle)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description && description.textContent.trim().length > 0) textCell.push(description);
  cells.push(textCell);

  // Row 2: Image
  if (img) {
    cells.push([img]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
