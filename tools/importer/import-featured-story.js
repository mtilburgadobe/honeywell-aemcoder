/* eslint-disable */
/* global WebImporter */

import heroArticleParser from './parsers/hero-article.js';
import cardsRelatedParser from './parsers/cards-related.js';
import honeywellCleanupTransformer from './transformers/honeywell-cleanup.js';
import articleLayoutTransformer from './transformers/honeywell-article-layout.js';

const parsers = {
  'hero-article': heroArticleParser,
  'cards-news': cardsRelatedParser,
};

const PAGE_TEMPLATE = {
  name: 'featured-story',
  description: 'Featured story article page with hero image, article body, and related content',
  blocks: [
    { name: 'hero-article', instances: ['#hero-banner-split'] },
    { name: 'cards-news', instances: ['.related-content'] },
  ],
  sections: [
    { id: 'section-1', name: 'Article Hero', selector: '#hero-banner-split', style: null, blocks: ['hero-article'], defaultContent: [] },
    { id: 'section-2', name: 'Article Body', selector: '.cmp-text', style: null, blocks: [], defaultContent: ['h1', 'h2', 'h3', 'p', 'ul', 'ol'] },
    { id: 'section-3', name: 'Related Content', selector: '.related-content', style: null, blocks: ['cards-news'], defaultContent: ['h2'] },
  ],
};

const transformers = [honeywellCleanupTransformer, articleLayoutTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
