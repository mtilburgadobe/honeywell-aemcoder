/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCorporateParser from './parsers/hero-corporate.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tabsIndustryParser from './parsers/tabs-industry.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsInfoParser from './parsers/columns-info.js';
import heroPromoParser from './parsers/hero-promo.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import honeywellCleanupTransformer from './transformers/honeywell-cleanup.js';
import honeywellSectionsTransformer from './transformers/honeywell-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-corporate': heroCorporateParser,
  'cards-feature': cardsFeatureParser,
  'tabs-industry': tabsIndustryParser,
  'cards-news': cardsNewsParser,
  'columns-info': columnsInfoParser,
  'hero-promo': heroPromoParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Honeywell US homepage with hero, featured content, and promotional sections',
  urls: [
    'https://www.honeywell.com/us/en',
  ],
  blocks: [
    {
      name: 'hero-corporate',
      instances: ['#hero-banner'],
    },
    {
      name: 'cards-feature',
      instances: ['.cmp-section-container-preview-mode.bg-color-gray-1:not(#hero-banner) .responsivegrid.bg-transparent.p-15.mt-15'],
    },
    {
      name: 'tabs-industry',
      instances: ['.leftrailwithcontent'],
    },
    {
      name: 'cards-news',
      instances: ['.filtered-list'],
    },
    {
      name: 'columns-info',
      instances: ['.advancedaccordion-block'],
    },
    {
      name: 'hero-promo',
      instances: ['.cmp-section-container-preview-mode.bg-color-gray-3'],
    },
    {
      name: 'columns-contact',
      instances: ['.responsivegrid.bg-light-gray.p-15 > .aem-Grid > .responsivegrid.bg-light-gray.p-30'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '#hero-banner',
      style: null,
      blocks: ['hero-corporate'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Mega Trends',
      selector: '.cmp-section-container-preview-mode.bg-color-gray-1:not(#hero-banner)',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['h2.section-title', '.cmp-text h6'],
    },
    {
      id: 'section-3',
      name: 'What We Do',
      selector: '.leftrailwithcontent',
      style: null,
      blocks: ['tabs-industry'],
      defaultContent: ['h2.section-title'],
    },
    {
      id: 'section-4',
      name: 'Whats New',
      selector: '.filtered-list',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h2.section-title'],
    },
    {
      id: 'section-5',
      name: 'Industrial Digitalization',
      selector: '.advancedaccordion-block',
      style: null,
      blocks: ['columns-info'],
      defaultContent: ['h2.section-title', '.cmp-text .text-header5'],
    },
    {
      id: 'section-6',
      name: 'Honeywell Forge Promo',
      selector: '.cmp-section-container-preview-mode.bg-color-gray-3',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Help and Support',
      selector: '.responsivegrid.bg-light-gray.p-15',
      style: 'grey',
      blocks: ['columns-contact'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  honeywellCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [honeywellSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
