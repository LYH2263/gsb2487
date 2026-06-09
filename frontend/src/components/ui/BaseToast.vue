<template>
  <div class="fixed top-6 right-6 z-[60] flex flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        :class="[
          'px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 min-w-[300px] backdrop-blur-md',
          toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
        ]"
      >
        <span v-if="toast.type === 'success'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="font-medium text-sm">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUiStore } from '../../stores/ui';
const uiStore = useUiStore();
</script>

<style scoped>
.toast-enter-from { opacity: 0; transform: translateX(30px) scale(0.9); }
.toast-enter-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-to { opacity: 1; transform: translateX(0) scale(1); }
.toast-leave-from { opacity: 1; transform: scale(1); }
.toast-leave-active { transition: all 0.3s ease-in; }
.toast-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }
</style>
