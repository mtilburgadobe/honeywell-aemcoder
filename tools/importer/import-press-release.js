/* eslint-disable */
/* global WebImporter */

import heroArticleParser from './parsers/hero-article.js';
import honeywellCleanupTransformer from './transformers/honeywell-cleanup.js';

const parsers = {
  'hero-article': heroArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'press-release',
  description: 'Press release page with headline, date, body text, and media contact information',
  blocks: [
    { name: 'hero-article', instances: ['#hero-banner-split'] },
  ],
  sections: [
    { id: 'section-1', name: 'Article Hero', selector: '#hero-banner-split', style: null, blocks: ['hero-article'], defaultContent: [] },
    { id: 'section-2', name: 'Article Body', selector: '.cmp-text', style: null, blocks: [], defaultContent: ['h1', 'h2', 'h3', 'p', 'ul', 'ol'] },
  ],
};

const transformers = [honeywellCleanupTransformer];

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
