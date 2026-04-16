export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length >= 2) {
    // Row 1 = text content (h1 + subtitle), Row 2 = image
    rows[0].classList.add('hero-article-text');
    rows[1].classList.add('hero-article-image');
  }
}
