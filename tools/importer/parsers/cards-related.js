/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news used in related-content sections on article pages.
 * Source: https://www.honeywell.com/us/en/news/featured-stories/*
 * Selector: .related-content
 * Structure: Each row = [image | title-link] (2 columns per card)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('li, .related-content__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img, figure img');
    const link = item.querySelector('p a, h2 a, h3 a, a[href]');

    if (link) {
      const imageCell = img ? [img] : [];
      const textCell = [];
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      h.append(a);
      textCell.push(h);

      cells.push(imageCell.length > 0 ? [imageCell, textCell] : [textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
