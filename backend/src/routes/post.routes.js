const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', postController.getPosts);
router.get('/:slug', postController.getPostBySlug);
router.post('/', authRequired, postController.createPost);
router.put('/:id', authRequired, postController.updatePost);
router.delete('/:id', authRequired, postController.deletePost);

module.exports = router;
