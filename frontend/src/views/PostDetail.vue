<template>
  <div v-if="post" class="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
    <!-- Header -->
    <header class="space-y-6">
      <BaseButton variant="ghost" size="sm" @click="$router.push('/')" class="-ml-2">
        ← 返回首页
      </BaseButton>
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-wider">
          {{ post.category?.name }}
        </div>
        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
          {{ post.title }}
        </h1>
        <div class="flex items-center gap-4 text-slate-400 text-sm py-4">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ new Date(post.createdAt).toLocaleDateString() }}
          </span>
          <span class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ post.viewCount }}
          </span>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="prose prose-slate prose-lg max-w-none bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
      <div v-html="post.content" class="whitespace-pre-wrap text-slate-700 leading-relaxed"></div>
    </div>

    <!-- Comments Section -->
    <section class="space-y-8">
      <h3 class="text-2xl font-bold text-slate-800">评论 ({{ post.comments?.length || 0 }})</h3>
      
      <!-- New Comment Form -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <textarea 
          v-model="newComment" 
          placeholder="写下你的想法..." 
          class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-500/20 transition-all min-h-[100px]"
        ></textarea>
        <div class="flex flex-col sm:flex-row gap-4">
          <input v-model="authorName" placeholder="你的名字" class="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2" />
          <BaseButton @click="submitComment" :loading="submitLoading">发表评论</BaseButton>
        </div>
      </div>

      <!-- Comment List -->
      <div class="space-y-6">
        <div v-for="comment in post.comments" :key="comment.id" class="bg-white p-6 rounded-2xl border border-slate-50 flex gap-4">
          <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
            {{ comment.authorName[0] }}
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800">{{ comment.authorName }}</span>
              <span class="text-xs text-slate-400">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed">{{ comment.content }}</p>
          </div>
        </div>
        <div v-if="post.comments?.length === 0" class="text-center text-slate-400 py-8">
          暂无评论，快来抢沙发吧！
        </div>
      </div>
    </section>
  </div>
  
  <div v-else-if="loading" class="max-w-4xl mx-auto space-y-12">
    <div class="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
    <div class="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
    <div class="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../utils/api';
import BaseButton from '../components/ui/BaseButton.vue';
import { useUiStore } from '../stores/ui';

const route = useRoute();
const uiStore = useUiStore();
const post = ref(null);
const loading = ref(true);
const newComment = ref('');
const authorName = ref('');
const submitLoading = ref(false);

const fetchPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.slug}`);
    post.value = res.data;
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value || !authorName.value) {
    return uiStore.showToast('请填写完整评论信息', 'error');
  }
  submitLoading.value = true;
  try {
    await api.post('/comments', {
      content: newComment.value,
      authorName: authorName.value,
      postId: post.value.id
    });
    uiStore.showToast('评论发表成功', 'success');
    newComment.value = '';
    authorName.value = '';
    fetchPost(); // Refresh
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    submitLoading.value = false;
  }
};

onMounted(fetchPost);
</script>
