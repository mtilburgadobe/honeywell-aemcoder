/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns (2 columns).
 * Source: https://www.honeywell.com/us/en
 * Selector: .responsivegrid.bg-light-gray.p-15 > .aem-Grid > .responsivegrid.bg-light-gray.p-30
 * Structure: Single row with 2 columns, each with title + description + CTA
 */
export default function parse(element, { document }) {
  // Each matched element is one column panel (Help & Support or Sales)
  const parent = element.parentElement;
  const allPanels = parent ? parent.querySelectorAll(':scope > .responsivegrid.bg-light-gray.p-30') : [element];

  const columnCells = [];

  allPanels.forEach((panel) => {
    const titleEl = panel.querySelector('.cmp-text b, .cmp-text strong');
    const descEl = panel.querySelectorAll('.cmp-text p');
    const ctaLink = panel.querySelector('.cmp-call-to-action a');

    const col = [];
    if (titleEl) {
      const h = document.createElement('h3');
      h.textContent = titleEl.textContent.trim();
      col.push(h);
    }
    // Get description paragraph (second p, after the title p)
    descEl.forEach((p) => {
      if (!p.querySelector('b, strong') && p.textContent.trim()) {
        col.push(p);
      }
    });
    if (ctaLink) col.push(ctaLink);
    columnCells.push(col);
  });

  const cells = [];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
