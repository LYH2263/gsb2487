const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', authRequired, categoryController.createCategory);

module.exports = router;
