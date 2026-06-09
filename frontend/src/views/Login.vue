<template>
  <div class="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
    <!-- Left: brand/illustration -->
    <div class="hidden md:flex items-center justify-center bg-gradient-to-br from-primary-100 to-indigo-100 relative">
      <div class="text-center p-12">
        <div class="w-16 h-16 mx-auto mb-6 bg-primary-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">B</div>
        <h2 class="text-3xl font-black text-slate-800 mb-2">管理后台</h2>
        <p class="text-slate-500">登录后管理文章与分类</p>
      </div>
    </div>

    <!-- Right: form -->
    <div class="p-8 sm:p-12 flex items-center">
      <form class="w-full max-w-sm mx-auto space-y-6" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-slate-800">欢迎回来</h1>
          <p class="text-slate-500 text-sm">请输入管理员账号进行登录</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-1">用户名</label>
          <input v-model="username" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3" placeholder="admin" autocomplete="username" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-1">密码</label>
          <input v-model="password" type="password" class="w-full bg-slate-50 border-none rounded-xl px-4 py-3" placeholder="••••••" autocomplete="current-password" />
        </div>

        <BaseButton class="w-full" :loading="loading" type="submit">登录</BaseButton>

        <p class="text-xs text-slate-400">默认账号密码：<span class="font-mono text-slate-600">admin / 123456</span></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import BaseButton from '../components/ui/BaseButton.vue';
import { useUiStore } from '../stores/ui';

const auth = useAuthStore();
const ui = useUiStore();
const router = useRouter();
const route = useRoute();

const username = ref('admin');
const password = ref('123456');
const loading = ref(false);

const onSubmit = async () => {
  if (!username.value || !password.value) {
    return ui.showToast('请输入用户名和密码', 'error');
  }
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    ui.showToast('登录成功', 'success');
    const redirect = route.query.redirect || '/admin';
    router.replace(redirect);
  } catch (e) {
    ui.showToast(e.message, 'error');
  } finally {
    loading.value = false;
  }
};
</script>

