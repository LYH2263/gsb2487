const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/', commentController.createComment);

module.exports = router;
