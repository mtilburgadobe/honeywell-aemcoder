export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  const pic = firstRow?.querySelector('picture');
  const img = firstRow?.querySelector('img');

  if (pic || img) {
    if (!pic && img) {
      // Wrap bare img in a picture-like container for consistent CSS
      const wrapper = document.createElement('div');
      wrapper.className = 'hero-corporate-bg';
      wrapper.append(img);
      firstRow.replaceWith(wrapper);
    } else {
      firstRow.className = 'hero-corporate-bg';
    }
  } else {
    block.classList.add('no-image');
  }
}
