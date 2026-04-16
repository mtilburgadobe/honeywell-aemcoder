var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-corporate.js
  function parse(element, { document }) {
    let bgImage = element.querySelector(':scope > img, :scope > picture, .image_desktop img, picture img, img[src*="scene7"], img[src*="images/"]');
    if (!bgImage) {
      const style = element.getAttribute("style") || "";
      const bgMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
      if (bgMatch) {
        let bgUrl = bgMatch[1];
        if (bgUrl.startsWith("//")) bgUrl = `https:${bgUrl}`;
        bgImage = document.createElement("img");
        bgImage.src = bgUrl;
        bgImage.alt = element.getAttribute("alt") || "";
      }
    }
    const heading = element.querySelector("h1, h2");
    const description = element.querySelector(".cmp-text p, p.desc");
    const ctaLink = element.querySelector(".cmp-call-to-action a, a[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink && (!heading || !heading.contains(ctaLink)) && (!description || !description.contains(ctaLink))) {
      contentCell.push(ctaLink);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-corporate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cmp-image img, .image_desktop img, img, picture img");
    const categoryLink = element.querySelector(".cmp-text a");
    const descriptionEl = element.querySelector(".cmp-text h6, .cmp-text p:not(:has(a))");
    const cells = [];
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const textCell = [];
    if (categoryLink) textCell.push(categoryLink);
    if (descriptionEl) textCell.push(descriptionEl);
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : "", textCell.length > 0 ? textCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-industry.js
  function parse3(element, { document }) {
    const tabLinks = element.querySelectorAll(".left-rail-tabs a, .nav-tabs a, ul.nav a");
    const tabPanels = element.querySelectorAll(".tab-pane, .tab-content > div[id]");
    const cells = [];
    tabLinks.forEach((link, i) => {
      const label = link.textContent.trim();
      const panel = tabPanels[i];
      const labelCell = label;
      let contentCell = "";
      if (panel) {
        const panelContent = [];
        const panelHeadings = panel.querySelectorAll("h2, h3, h4, h5, h6");
        const panelParagraphs = panel.querySelectorAll("p, .cmp-text p");
        const panelLinks = panel.querySelectorAll("a[href]");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".filtered-list-component__item, li.filtered-list-component__item");
    const cells = [];
    items.forEach((item) => {
      const headline = item.querySelector(".filtered-list-component__item-headline, h2, h3");
      const link = item.querySelector("a.filtered-list-component__item-link, a[href]");
      const cardCell = [];
      if (headline && link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = headline.textContent.trim();
        const h = document.createElement("h3");
        h.append(a);
        cardCell.push(h);
      } else if (headline) {
        cardCell.push(headline);
      }
      if (cardCell.length > 0) {
        cells.push(cardCell);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse5(element, { document }) {
    const parent = element.parentElement;
    const allAccordions = parent ? parent.querySelectorAll(".advancedaccordion-block") : [element];
    const columnCells = [];
    allAccordions.forEach((accordion) => {
      const title = accordion.querySelector(".advancedaccordion-question, .advancedaccordion-title");
      const content = accordion.querySelector(".advancedaccordion-item p, .advancedaccordion-item");
      const col = [];
      if (title) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        col.push(h);
      }
      if (content) {
        const p = document.createElement("p");
        p.textContent = content.textContent.trim();
        col.push(p);
      }
      columnCells.push(col);
    });
    const cells = [];
    if (columnCells.length > 0) {
      cells.push(columnCells);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse6(element, { document }) {
    const bgImage = element.querySelector(':scope > img, picture img, img[src*="scene7"], img[src*="images/"]');
    const heading = element.querySelector("h5, h4, h3, h2");
    const allTexts = element.querySelectorAll(".cmp-text p");
    let description = null;
    for (const p of allTexts) {
      if (p.textContent.trim().length > 20 && !p.querySelector("b")) {
        description = p;
        break;
      }
    }
    const ctaLink = element.querySelector(".cmp-call-to-action a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentItems = [];
    if (heading) contentItems.push(heading);
    if (description) contentItems.push(description);
    if (ctaLink) contentItems.push(ctaLink);
    cells.push(contentItems);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse7(element, { document }) {
    const parent = element.parentElement;
    const allPanels = parent ? parent.querySelectorAll(":scope > .responsivegrid.bg-light-gray.p-30") : [element];
    const columnCells = [];
    allPanels.forEach((panel) => {
      const titleEl = panel.querySelector(".cmp-text b, .cmp-text strong");
      const descEl = panel.querySelectorAll(".cmp-text p");
      const ctaLink = panel.querySelector(".cmp-call-to-action a");
      const col = [];
      if (titleEl) {
        const h = document.createElement("h3");
        h.textContent = titleEl.textContent.trim();
        col.push(h);
      }
      descEl.forEach((p) => {
        if (!p.querySelector("b, strong") && p.textContent.trim()) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/honeywell-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".access-check-main",
        "#honeywell-brand-name",
        ".globalnotification",
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        "#customHeadId"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "meta",
        "link",
        "input",
        "noscript",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-sly-test");
      });
    }
  }

  // tools/importer/transformers/honeywell-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadataBlock);
        }
        if (section.id !== template.sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-corporate": parse,
    "cards-feature": parse2,
    "tabs-industry": parse3,
    "cards-news": parse4,
    "columns-info": parse5,
    "hero-promo": parse6,
    "columns-contact": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Honeywell US homepage with hero, featured content, and promotional sections",
    urls: [
      "https://www.honeywell.com/us/en"
    ],
    blocks: [
      {
        name: "hero-corporate",
        instances: ["#hero-banner"]
      },
      {
        name: "cards-feature",
        instances: [".cmp-section-container-preview-mode.bg-color-gray-1:not(#hero-banner) .responsivegrid.bg-transparent.p-15.mt-15"]
      },
      {
        name: "tabs-industry",
        instances: [".leftrailwithcontent"]
      },
      {
        name: "cards-news",
        instances: [".filtered-list"]
      },
      {
        name: "columns-info",
        instances: [".advancedaccordion-block"]
      },
      {
        name: "hero-promo",
        instances: [".cmp-section-container-preview-mode.bg-color-gray-3"]
      },
      {
        name: "columns-contact",
        instances: [".responsivegrid.bg-light-gray.p-15 > .aem-Grid > .responsivegrid.bg-light-gray.p-30"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "#hero-banner",
        style: null,
        blocks: ["hero-corporate"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Mega Trends",
        selector: ".cmp-section-container-preview-mode.bg-color-gray-1:not(#hero-banner)",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["h2.section-title", ".cmp-text h6"]
      },
      {
        id: "section-3",
        name: "What We Do",
        selector: ".leftrailwithcontent",
        style: null,
        blocks: ["tabs-industry"],
        defaultContent: ["h2.section-title"]
      },
      {
        id: "section-4",
        name: "Whats New",
        selector: ".filtered-list",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h2.section-title"]
      },
      {
        id: "section-5",
        name: "Industrial Digitalization",
        selector: ".advancedaccordion-block",
        style: null,
        blocks: ["columns-info"],
        defaultContent: ["h2.section-title", ".cmp-text .text-header5"]
      },
      {
        id: "section-6",
        name: "Honeywell Forge Promo",
        selector: ".cmp-section-container-preview-mode.bg-color-gray-3",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Help and Support",
        selector: ".responsivegrid.bg-light-gray.p-15",
        style: "grey",
        blocks: ["columns-contact"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
