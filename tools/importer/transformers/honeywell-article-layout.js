/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Move related-content block before article body for sidebar float layout.
 * On Honeywell article pages, related content appears as a right sidebar.
 * In EDS, we achieve this by placing the block before the article text and floating it right.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    // Find the related-content block table (created by parser)
    const relatedBlock = element.querySelector('table');
    if (!relatedBlock) return;

    // Check if it's a cards-news block
    const firstCell = relatedBlock.querySelector('tr:first-child td, tr:first-child th');
    if (!firstCell || !firstCell.textContent.trim().toLowerCase().includes('cards-news')) return;

    // Find the heading "Related Content" before it
    let relatedHeading = null;
    let prev = relatedBlock.previousElementSibling;
    while (prev) {
      if (prev.tagName && prev.tagName.match(/^H[1-6]$/) && prev.textContent.trim() === 'Related Content') {
        relatedHeading = prev;
        break;
      }
      prev = prev.previousElementSibling;
    }

    // Find the article body start (first paragraph or heading after hero block)
    const heroBlock = element.querySelector('table');
    if (heroBlock === relatedBlock) return;

    // Find first content element after all block tables at the start
    const allChildren = [...element.children];
    let insertPoint = null;
    for (const child of allChildren) {
      if (child.tagName === 'TABLE') continue;
      if (child.tagName === 'P' || child.tagName.match(/^H[1-6]$/)) {
        insertPoint = child;
        break;
      }
    }

    if (insertPoint && relatedBlock) {
      // Move related heading and block before article body
      if (relatedHeading) {
        insertPoint.before(relatedHeading);
      }
      insertPoint.before(relatedBlock);
    }
  }
}
