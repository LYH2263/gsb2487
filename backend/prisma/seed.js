const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'blog',
  connectionLimit: Number(process.env.DB_POOL || 5),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // Create Categories
  const tech = await prisma.category.upsert({
    where: { name: '技术' },
    update: {},
    create: { name: '技术' },
  });

  const life = await prisma.category.upsert({
    where: { name: '生活' },
    update: {},
    create: { name: '生活' },
  });

  const essay = await prisma.category.upsert({
    where: { name: '随笔' },
    update: {},
    create: { name: '随笔' },
  });

  // Create Posts
  await prisma.post.upsert({
    where: { slug: 'my-first-blog' },
    update: {},
    create: {
      title: '我的第一篇智能博客',
      slug: 'my-first-blog',
      content: '欢迎来到我的个性化智能博客系统！这是使用 Vue 3 和 Node.js 构建的全栈项目。',
      excerpt: '开启智能博客之旅...',
      published: true,
      categoryId: life.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: 'vue3-guide' },
    update: {},
    create: {
      title: 'Vue 3 实战指南',
      slug: 'vue3-guide',
      content: 'Vue 3 带来了组合式 API (Composition API)，让代码逻辑更加清晰和易于复用...',
      excerpt: '深入了解 Vue 3 的核心魅力。',
      published: true,
      categoryId: tech.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
