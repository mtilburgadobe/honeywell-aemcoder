/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards (no images variant).
 * Source: https://www.honeywell.com/us/en
 * Selector: .filtered-list
 * Structure: Each row = [headline-link] (1 column per card, no images)
 */
export default function parse(element, { document }) {
  // Find all news article items in the filtered list
  const items = element.querySelectorAll('.filtered-list-component__item, li.filtered-list-component__item');

  const cells = [];

  items.forEach((item) => {
    const headline = item.querySelector('.filtered-list-component__item-headline, h2, h3');
    const link = item.querySelector('a.filtered-list-component__item-link, a[href]');

    const cardCell = [];
    if (headline && link) {
      // Create a linked heading
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = headline.textContent.trim();
      const h = document.createElement('h3');
      h.append(a);
      cardCell.push(h);
    } else if (headline) {
      cardCell.push(headline);
    }

    if (cardCell.length > 0) {
      cells.push(cardCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
