/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-info. Base: columns (3 columns).
 * Source: https://www.honeywell.com/us/en
 * Selector: .advancedaccordion-block
 * Structure: Single row with 3 columns, each with title + description
 */
export default function parse(element, { document }) {
  // Each advancedaccordion-block is one column item
  // Find all sibling accordion blocks at the same level
  const parent = element.parentElement;
  const allAccordions = parent ? parent.querySelectorAll('.advancedaccordion-block') : [element];

  const columnCells = [];

  allAccordions.forEach((accordion) => {
    const title = accordion.querySelector('.advancedaccordion-question, .advancedaccordion-title');
    const content = accordion.querySelector('.advancedaccordion-item p, .advancedaccordion-item');

    const col = [];
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      col.push(h);
    }
    if (content) {
      const p = document.createElement('p');
      p.textContent = content.textContent.trim();
      col.push(p);
    }
    columnCells.push(col);
  });

  // Build single row with N columns
  const cells = [];
  if (columnCells.length > 0) {
    cells.push(columnCells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
