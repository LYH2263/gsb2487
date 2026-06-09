const prisma = require('../db');
const { slugify } = require('../utils/slugify');
const { createPostSchema, updatePostSchema } = require('../validators/post.validator');
const logger = require('../logger');

const getPosts = async (req, res, next) => {
  try {
    const { categoryId, published } = req.query;
    const where = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (published !== undefined) where.published = published === 'true';

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        comments: {
          where: { parentId: null },
          include: {
            replies: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ success: false, message: '文章未找到' });
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const result = createPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.errors });
    }

    const { title, content, excerpt, categoryId, published } = result.data;
    let baseSlug = slugify(title);
    
    if (!baseSlug) {
      baseSlug = `post-${Date.now()}`;
    }
    
    let slug = baseSlug;
    let count = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        published
      },
      include: { category: true }
    });

    logger.info(`Post created: ${post.id}`);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = updatePostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.errors });
    }

    const data = result.data;
    if (data.title) {
        // If title changes, we don't necessarily change slug unless specified, 
        // but for this simple blog we'll keep the old slug or could update it.
        // Let's stick to the old slug for SEO unless we explicitly add a slug field.
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data
    });

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: '文章已删除' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
};
