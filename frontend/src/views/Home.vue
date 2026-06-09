<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="text-center space-y-4 py-8">
      <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
        探索 <span class="text-primary-500">博大精深</span> 的知识世界
      </h1>
      <p class="text-slate-500 text-lg max-w-2xl mx-auto">
        分享技术洞见，记录生活点滴。这里是你的个性化智能博客空间。
      </p>
    </section>

    <!-- Content Section -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar / Tags -->
      <aside class="w-full md:w-64 space-y-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-4">分类</h3>
          <div class="space-y-2">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="toggleCategory(cat.id)"
              :class="[
                'w-full text-left px-4 py-2 rounded-xl transition-all',
                selectedCategory === cat.id ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              ]"
            >
              {{ cat.name }}
              <span class="float-right text-xs opacity-50">{{ cat._count?.posts || 0 }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Post List -->
      <div class="flex-grow">
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="h-64 bg-white rounded-2xl animate-pulse border border-slate-100"></div>
        </div>
        
        <div v-else-if="posts.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <p class="text-slate-400">暂无相关文章</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-6">
          <div 
            v-for="post in posts" 
            :key="post.id"
            @click="$router.push(`/post/${post.slug}`)"
            class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row gap-6"
          >
            <div class="flex-grow space-y-4">
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                  {{ post.category?.name || '默认' }}
                </span>
                <span class="text-slate-300 text-xs">/</span>
                <span class="text-slate-400 text-xs font-medium">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
              </div>
              
              <h2 class="text-2xl font-bold text-slate-800 group-hover:text-primary-500 transition-colors leading-tight">
                {{ post.title }}
              </h2>
              
              <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">
                {{ post.excerpt || post.content.substring(0, 100) }}
              </p>
              
              <div class="flex items-center gap-6 pt-2">
                <div class="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ post.viewCount }} 次阅读</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 012 2v8a2 2 0 01-2-2h-3l-4 4z" />
                  </svg>
                  <span>{{ post._count?.comments || 0 }} 条评论</span>
                </div>
              </div>
            </div>
            
            <div class="hidden sm:flex items-center justify-center p-4">
              <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../utils/api';

const posts = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);

const fetchData = async () => {
  loading.value = true;
  try {
    const postParams = selectedCategory.value ? { categoryId: selectedCategory.value } : {};
    const [postRes, catRes] = await Promise.all([
      api.get('/posts', { params: postParams }),
      api.get('/categories')
    ]);
    posts.value = postRes.data;
    categories.value = catRes.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (id) => {
  selectedCategory.value = selectedCategory.value === id ? null : id;
  fetchData();
};

onMounted(fetchData);
</script>
