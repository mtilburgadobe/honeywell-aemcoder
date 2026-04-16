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

  // tools/importer/import-featured-story.js
  var import_featured_story_exports = {};
  __export(import_featured_story_exports, {
    default: () => import_featured_story_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2");
    const description = element.querySelector(".cmp-text p, p:not(:has(img))");
    let img = element.querySelector('img[src*="scene7"], img[src*="honeywell"], .s7dm-dynamic-media img');
    if (!img) {
      const style = element.getAttribute("style") || "";
      const bgMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
      if (bgMatch) {
        let bgUrl = bgMatch[1];
        if (bgUrl.startsWith("//")) bgUrl = "https:" + bgUrl;
        img = document.createElement("img");
        img.src = bgUrl;
        img.alt = element.getAttribute("alt") || "";
      }
    }
    const cells = [];
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description && description.textContent.trim().length > 0) textCell.push(description);
    cells.push(textCell);
    if (img) {
      cells.push([img]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-related.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll("li, .related-content__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img, figure img");
      const link = item.querySelector("p a, h2 a, h3 a, a[href]");
      if (link) {
        const imageCell = img ? [img] : [];
        const textCell = [];
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        h.append(a);
        textCell.push(h);
        cells.push(imageCell.length > 0 ? [imageCell, textCell] : [textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
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

  // tools/importer/transformers/honeywell-article-layout.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const relatedBlock = element.querySelector("table");
      if (!relatedBlock) return;
      const firstCell = relatedBlock.querySelector("tr:first-child td, tr:first-child th");
      if (!firstCell || !firstCell.textContent.trim().toLowerCase().includes("cards-news")) return;
      let relatedHeading = null;
      let prev = relatedBlock.previousElementSibling;
      while (prev) {
        if (prev.tagName && prev.tagName.match(/^H[1-6]$/) && prev.textContent.trim() === "Related Content") {
          relatedHeading = prev;
          break;
        }
        prev = prev.previousElementSibling;
      }
      const heroBlock = element.querySelector("table");
      if (heroBlock === relatedBlock) return;
      const allChildren = [...element.children];
      let insertPoint = null;
      for (const child of allChildren) {
        if (child.tagName === "TABLE") continue;
        if (child.tagName === "P" || child.tagName.match(/^H[1-6]$/)) {
          insertPoint = child;
          break;
        }
      }
      if (insertPoint && relatedBlock) {
        if (relatedHeading) {
          insertPoint.before(relatedHeading);
        }
        insertPoint.before(relatedBlock);
      }
    }
  }

  // tools/importer/import-featured-story.js
  var parsers = {
    "hero-article": parse,
    "cards-news": parse2
  };
  var PAGE_TEMPLATE = {
    name: "featured-story",
    description: "Featured story article page with hero image, article body, and related content",
    blocks: [
      { name: "hero-article", instances: ["#hero-banner-split"] },
      { name: "cards-news", instances: [".related-content"] }
    ],
    sections: [
      { id: "section-1", name: "Article Hero", selector: "#hero-banner-split", style: null, blocks: ["hero-article"], defaultContent: [] },
      { id: "section-2", name: "Article Body", selector: ".cmp-text", style: null, blocks: [], defaultContent: ["h1", "h2", "h3", "p", "ul", "ol"] },
      { id: "section-3", name: "Related Content", selector: ".related-content", style: null, blocks: ["cards-news"], defaultContent: ["h2"] }
    ]
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
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
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_featured_story_default = {
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
            console.error(`Failed to parse ${block.name}:`, e);
          }
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
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_featured_story_exports);
})();
