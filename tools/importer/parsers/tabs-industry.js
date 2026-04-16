/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-industry. Base: tabs.
 * Source: https://www.honeywell.com/us/en
 * Selector: .leftrailwithcontent
 * Structure: Each row = [tab-label | tab-content] (2 columns per tab)
 */
export default function parse(element, { document }) {
  // Find tab labels from left rail navigation
  const tabLinks = element.querySelectorAll('.left-rail-tabs a, .nav-tabs a, ul.nav a');

  // Find tab content panels
  const tabPanels = element.querySelectorAll('.tab-pane, .tab-content > div[id]');

  const cells = [];

  tabLinks.forEach((link, i) => {
    const label = link.textContent.trim();
    const panel = tabPanels[i];

    const labelCell = label;
    let contentCell = '';

    if (panel) {
      // Extract content from panel - get text content, links, descriptions
      const panelContent = [];
      const panelHeadings = panel.querySelectorAll('h2, h3, h4, h5, h6');
      const panelParagraphs = panel.querySelectorAll('p, .cmp-text p');
      const panelLinks = panel.querySelectorAll('a[href]');

      panelHeadings.forEach((h) => panelContent.push(h));
      panelParagraphs.forEach((p) => {
        if (p.textContent.trim()) panelContent.push(p);
      });

      if (panelContent.length > 0) {
        contentCell = panelContent;
      } else if (panelLinks.length > 0) {
        contentCell = Array.from(panelLinks);
      } else {
        contentCell = panel.textContent.trim() || label;
      }
    } else {
      contentCell = label;
    }

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-industry', cells });
  element.replaceWith(block);
}
