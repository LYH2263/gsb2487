<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">管理后台</h1>
        <p class="text-slate-500 text-sm">管理你的所有博文内容</p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="secondary" @click="logout">退出登录</BaseButton>
        <BaseButton @click="openCreate">新增文章</BaseButton>
      </div>
    </div>

    <!-- Posts Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4 font-semibold">标题</th>
            <th class="px-6 py-4 font-semibold">分类</th>
            <th class="px-6 py-4 font-semibold">状态</th>
            <th class="px-6 py-4 font-semibold">日期</th>
            <th class="px-6 py-4 font-semibold text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-medium text-slate-800">{{ post.title }}</div>
              <div class="text-xs text-slate-400">{{ post.slug }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{{ post.category?.name || '-' }}</span>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                post.published ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              ]">
                {{ post.published ? '已发布' : '草稿' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-400">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <BaseButton variant="ghost" size="sm" @click="editPost(post)">编辑</BaseButton>
                <BaseButton variant="ghost" size="sm" class="text-red-500 hover:bg-red-50" @click="confirmDelete(post)">删除</BaseButton>
              </div>
            </td>
          </tr>
          <tr v-if="posts.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-slate-400">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Create Modal -->
    <BaseModal 
      :show="showModal" 
      :title="editingPost ? '编辑文章' : '新增文章'" 
      @close="showModal = false" 
      @confirm="savePost"
      :loading="saveLoading"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-1">标题</label>
          <input v-model="form.title" class="w-full bg-slate-50 border-none rounded-xl px-4 py-2" placeholder="请输入标题" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-1">分类</label>
          <select v-model="form.categoryId" class="w-full bg-slate-50 border-none rounded-xl px-4 py-2">
            <option :value="null">未分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-bold text-slate-400 uppercase">内容</label>
            <BaseButton 
              size="xs" 
              variant="secondary" 
              @click="generateAIContent" 
              :loading="aiLoading"
              :disabled="!form.title"
            >
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI 自动生成
              </span>
            </BaseButton>
          </div>
          <textarea v-model="form.content" class="w-full bg-slate-50 border-none rounded-xl px-4 py-2 min-h-[200px]" placeholder="手动输入或点击 AI 生成..."></textarea>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.published" id="published" class="rounded text-primary-500" />
          <label for="published" class="text-sm text-slate-600">立即发布</label>
        </div>
      </div>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="确认删除"
      confirmText="确认删除"
      confirmVariant="danger"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
      :loading="deleteLoading"
    >
      你确定要删除文章《{{ postToDelete?.title }}》吗？此操作无法撤销。
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../utils/api';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseModal from '../components/ui/BaseModal.vue';
import { useUiStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const uiStore = useUiStore();
const auth = useAuthStore();
const router = useRouter();
const posts = ref([]);
const categories = ref([]);
const loading = ref(true);

const showModal = ref(false);
const editingPost = ref(null);
const saveLoading = ref(false);
const form = reactive({
  title: '',
  content: '',
  categoryId: null,
  published: false
});

const showDeleteModal = ref(false);
const postToDelete = ref(null);
const deleteLoading = ref(false);
const aiLoading = ref(false);

const logout = () => {
  auth.logout();
  router.replace('/login');
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [postRes, catRes] = await Promise.all([
      api.get('/posts'),
      api.get('/categories')
    ]);
    posts.value = postRes.data;
    categories.value = catRes.data;
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editingPost.value = null;
  form.title = '';
  form.content = '';
  form.categoryId = null;
  form.published = false;
  showModal.value = true;
};

const editPost = (post) => {
  editingPost.value = post;
  form.title = post.title;
  form.content = post.content;
  form.categoryId = post.categoryId;
  form.published = post.published;
  showModal.value = true;
};

const generateAIContent = async () => {
  if (!form.title) return;
  aiLoading.value = true;
  try {
    const res = await api.post('/ai/generate', { title: form.title });
    form.content = res.data;
    uiStore.showToast('AI 内容生成成功', 'success');
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    aiLoading.value = false;
  }
};

const savePost = async () => {
  if (!form.title || !form.content) {
    return uiStore.showToast('请填写标题和内容', 'error');
  }
  saveLoading.value = true;
  try {
    if (editingPost.value) {
      await api.put(`/posts/${editingPost.value.id}`, form);
      uiStore.showToast('更新成功', 'success');
    } else {
      await api.post('/posts', form);
      uiStore.showToast('创建成功', 'success');
    }
    showModal.value = false;
    fetchData();
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  deleteLoading.value = true;
  try {
    await api.delete(`/posts/${postToDelete.value.id}`);
    uiStore.showToast('文章已删除', 'success');
    showDeleteModal.value = false;
    fetchData();
  } catch (err) {
    uiStore.showToast(err.message, 'error');
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(fetchData);
</script>
