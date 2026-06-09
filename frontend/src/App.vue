<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <nav class="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2 group cursor-pointer" @click="$router.push('/')">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <span class="text-xl font-bold">B</span>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">个性化博客</span>
          </div>
          <div class="hidden sm:flex items-center gap-8">
            <router-link to="/" class="text-slate-600 hover:text-primary-500 font-medium transition-colors" active-class="text-primary-600">首页</router-link>
            <router-link to="/admin" class="text-slate-600 hover:text-primary-500 font-medium transition-colors" active-class="text-primary-600">管理后台</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-white border-t border-slate-200 py-12 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-slate-400 text-sm">© 2026 个性化智能博客系统 · Powered by Vue 3 & Node.js</p>
      </div>
    </footer>

    <BaseToast />
  </div>
</template>

<script setup>
import BaseToast from './components/ui/BaseToast.vue';
</script>

<style>
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-enter-active { transition: all 0.4s ease-out; }
.fade-enter-to { opacity: 1; transform: translateY(0); }
.fade-leave-from { opacity: 1; transform: translateY(0); }
.fade-leave-active { transition: all 0.3s ease-in; }
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
