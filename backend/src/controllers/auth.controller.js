const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const login = async (req, res) => {
  const { username, password } = req.body || {};
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || '123456';
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ success: true, data: { token, user: { username, role: 'admin' } } });
  }
  return res.status(401).json({ success: false, message: '用户名或密码错误' });
};

const profile = async (req, res) => {
  // req.user set by auth middleware
  return res.json({ success: true, data: req.user });
};

module.exports = { login, profile };

