function slugify(text) {
  let slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!slug) {
    slug = 'post-' + Date.now();
  }
  
  return slug;
}

module.exports = { slugify };
