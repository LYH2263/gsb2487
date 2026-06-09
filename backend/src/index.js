require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger');
const prisma = require('./db');

const postRoutes = require('./routes/post.routes');
const categoryRoutes = require('./routes/category.routes');
const commentRoutes = require('./routes/comment.routes');
const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  logger.info(`Backend server is running on port ${PORT}`);
});
