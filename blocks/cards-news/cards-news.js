import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      const img = div.querySelector('img');
      if (div.children.length === 1 && (pic || (img && !div.querySelector('h1, h2, h3, h4, h5, h6, a')))) {
        div.className = 'cards-news-card-image';
      } else {
        div.className = 'cards-news-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.replaceWith(optimizedPic);
    } else {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  const heading = document.createElement('h2');
  heading.className = 'cards-news-heading';
  heading.textContent = 'Related Content';

  block.textContent = '';
  block.append(heading);
  block.append(ul);
}
