const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'blog_secret';

function authRequired(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权：缺少令牌' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: '未授权：令牌无效或已过期' });
  }
}

module.exports = { authRequired, JWT_SECRET };

