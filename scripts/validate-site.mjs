import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'about.html',
  'caribou.html',
  'oportun.html',
  'geico.html',
  'personal-projects.html'
];
const requiredNavigation = new Set(pages);
const failures = [];

const isExternal = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);

const splitTarget = (value) => {
  const withoutQuery = value.split('?')[0];
  const hashIndex = withoutQuery.indexOf('#');
  if (hashIndex === -1) {
    return { file: withoutQuery, fragment: '' };
  }
  return {
    file: withoutQuery.slice(0, hashIndex),
    fragment: withoutQuery.slice(hashIndex + 1)
  };
};

const resolveTarget = (page, target) => {
  const decoded = decodeURIComponent(target);
  const relativeTarget = decoded || page;
  const pageDirectory = path.posix.dirname(page.replaceAll(path.sep, '/'));
  const normalizedTarget = path.posix.normalize(path.posix.join(pageDirectory, relativeTarget));
  if (normalizedTarget === '..' || normalizedTarget.startsWith('../')) {
    return null;
  }
  return normalizedTarget;
};

const getAttributes = (tag) => {
  const attributes = new Map();
  const attributePattern = /([\w:-]+)\s*=\s*(["'])(.*?)\2/gs;
  for (const match of tag.matchAll(attributePattern)) {
    attributes.set(match[1].toLowerCase(), match[3]);
  }
  return attributes;
};

const getIds = (html) => {
  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gs)) {
    ids.add(match[2]);
  }
  return ids;
};

for (const page of pages) {
  const pagePath = path.join(root, page);
  if (!fs.existsSync(pagePath)) {
    failures.push(`${page}: page is missing`);
    continue;
  }

  const html = fs.readFileSync(pagePath, 'utf8');
  const pageIds = getIds(html);
  const navigationTargets = new Set();

  for (const tagMatch of html.matchAll(/<(?:a|area|img|source|script|video|audio|link)\b[^>]*>/gis)) {
    const tag = tagMatch[0];
    const attributes = getAttributes(tag);
    const attributeName = attributes.has('href') ? 'href' : 'src';
    const target = attributes.get(attributeName);
    if (!target || isExternal(target) || target.startsWith('data:') || target.startsWith('mailto:')) {
      continue;
    }

    const { file, fragment } = splitTarget(target);
    const targetPage = file || page;
    let resolvedTarget;
    try {
      resolvedTarget = resolveTarget(page, targetPage);
    } catch {
      failures.push(`${page}: invalid encoded target ${target}`);
      continue;
    }

    if (!resolvedTarget) {
      failures.push(`${page}: target escapes site root ${target}`);
      continue;
    }

    const targetPath = path.resolve(root, ...resolvedTarget.split('/'));
    if (targetPath !== root && !targetPath.startsWith(`${root}${path.sep}`)) {
      failures.push(`${page}: target escapes site root ${target}`);
      continue;
    }
    if (!fs.existsSync(targetPath)) {
      failures.push(`${page}: missing local target ${target}`);
      continue;
    }

    if (attributeName === 'href' && pages.includes(resolvedTarget)) {
      navigationTargets.add(resolvedTarget);
    }

    if (fragment) {
      if (!resolvedTarget.endsWith('.html')) {
        failures.push(`${page}: fragment target is not an HTML page ${target}`);
        continue;
      }
      const targetHtml = fs.readFileSync(targetPath, 'utf8');
      if (!getIds(targetHtml).has(fragment)) {
        failures.push(`${page}: missing fragment target ${target}`);
      }
    }
  }

  for (const requiredPage of requiredNavigation) {
    if (!navigationTargets.has(requiredPage)) {
      failures.push(`${page}: required navigation target is missing ${requiredPage}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Static site validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Static site validation passed for ${pages.length} HTML pages.`);
}
