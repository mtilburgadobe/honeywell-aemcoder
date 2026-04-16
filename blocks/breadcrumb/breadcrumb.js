function titleCase(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function decorate(block) {
  let path = window.location.pathname;

  // Strip /drafts prefix for local dev
  if (path.startsWith('/drafts')) {
    path = path.replace(/^\/drafts/, '');
  }

  // Strip /us/en locale prefix for cleaner breadcrumb
  const localePath = '/us/en';
  if (path.startsWith(localePath)) {
    path = path.substring(localePath.length);
  }

  const segments = path.split('/').filter(Boolean);

  const ol = document.createElement('ol');

  // Home link
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.append(homeLink);
  ol.append(homeLi);

  // Build breadcrumb, skip date segments (year/month)
  let currentPath = localePath;
  const skipPatterns = /^\d{4}$|^\d{2}$/;

  segments.forEach((segment, i) => {
    currentPath += `/${segment}`;
    if (skipPatterns.test(segment)) return;

    const li = document.createElement('li');
    const isLast = i === segments.length - 1;

    if (isLast) {
      li.textContent = document.title.split('|')[0].trim();
    } else {
      const a = document.createElement('a');
      a.href = currentPath;
      a.textContent = titleCase(segment);
      li.append(a);
    }
    ol.append(li);
  });

  block.textContent = '';
  block.append(ol);
}
