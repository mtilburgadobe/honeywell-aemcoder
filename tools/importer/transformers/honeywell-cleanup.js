/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Honeywell site cleanup.
 * Selectors from captured DOM of https://www.honeywell.com/us/en
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent overlays, notification banners, and access-check elements
    // Found in captured DOM: div.access-check-main, div.globalnotification, div#honeywell-brand-name
    WebImporter.DOMUtils.remove(element, [
      '.access-check-main',
      '#honeywell-brand-name',
      '.globalnotification',
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '#customHeadId',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, navigation chrome
    // Found in captured DOM: div.cmp-experiencefragment--header, div.cmp-experiencefragment--footer
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'meta',
      'link',
      'input',
      'noscript',
      'iframe',
    ]);
    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-sly-test');
    });
  }
}
