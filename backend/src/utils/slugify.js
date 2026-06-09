function slugify(text) {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')              // Replace spaces with -
    .replace(/[^\p{L}\p{N}_-]+/gu, '') // Keep unicode letters/numbers (CJK included), strip the rest
    .replace(/--+/g, '-')              // Replace multiple - with single -
    .replace(/^-+|-+$/g, '');          // Trim leading/trailing dashes

  // Fallback when title contains no usable characters (pure punctuation/emoji),
  // ensuring slug is always non-empty and unique-ish so that the post detail route is reachable.
  return slug || `post-${Date.now()}`;
}

module.exports = { slugify };
