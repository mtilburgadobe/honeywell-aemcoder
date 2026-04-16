/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.honeywell.com/us/en
 * Selector: .cmp-section-container-preview-mode.bg-color-gray-1:not(#hero-banner) .responsivegrid.bg-transparent.p-15.mt-15
 * Structure: Each row = [image | category-label + description] (2 columns per card)
 */
export default function parse(element, { document }) {
  // Each matching element is one feature card (Automation, Energy Transition, Aviation)
  // containing an image and text with category label + description
  const image = element.querySelector('.cmp-image img, .image_desktop img, img, picture img');
  const categoryLink = element.querySelector('.cmp-text a');
  const descriptionEl = element.querySelector('.cmp-text h6, .cmp-text p:not(:has(a))');

  const cells = [];

  // Column 1: Image
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Column 2: Category label + description
  const textCell = [];
  if (categoryLink) textCell.push(categoryLink);
  if (descriptionEl) textCell.push(descriptionEl);

  if (imageCell.length > 0 || textCell.length > 0) {
    cells.push([imageCell.length > 0 ? imageCell : '', textCell.length > 0 ? textCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
