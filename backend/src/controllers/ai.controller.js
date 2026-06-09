const axios = require('axios');
const logger = require('../logger');

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.ywzxkj.com';
const AI_API_KEY = process.env.AI_API_KEY || 'sk-IdMtusB1laSIKy6RGqtzh8QRmW7EMlbXFif19rqpTTBjzWPF';

const generateContent = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: '请提供标题' });
    }

    logger.info(`Generating AI content for title: ${title}`);

    const response = await axios.post(`${AI_BASE_URL}/v1/chat/completions`, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的博客作家。请根据用户提供的标题，撰写一篇专业、有趣且结构清晰的博客文章。请直接输出正文内容，不要包含标题或其他无关信息。使用 Markdown 格式。'
        },
        {
          role: 'user',
          content: `标题: ${title}`
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    const content = response.data.choices[0].message.content;
    res.json({ success: true, data: content });
  } catch (err) {
    logger.error(`AI Generation failed: ${err.message}`);
    // Return a more user-friendly error if possible
    const errorMsg = err.response?.data?.error?.message || 'AI 生成失败，请稍后重试';
    res.status(500).json({ success: false, message: errorMsg });
  }
};

module.exports = { generateContent };
