const express = require('express');
const router = express.Router();
const { login, profile } = require('../controllers/auth.controller');
const { authRequired } = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', authRequired, profile);

module.exports = router;

