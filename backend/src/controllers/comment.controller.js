const prisma = require('../db');

const createComment = async (req, res, next) => {
  try {
    const { content, authorName, authorEmail, postId, parentId } = req.body;
    if (!content || !authorName || !postId) {
      return res.status(400).json({ success: false, message: '必填字段缺失' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorName,
        authorEmail,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null
      }
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId), parentId: null },
      include: {
        replies: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

module.exports = { createComment, getCommentsByPost };
