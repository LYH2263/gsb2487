const prisma = require('../db');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: '名称不能为空' });

    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory };
