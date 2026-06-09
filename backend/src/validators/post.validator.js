const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题过长'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  published: z.boolean().default(false)
});

const updatePostSchema = createPostSchema.partial();

module.exports = {
  createPostSchema,
  updatePostSchema
};
