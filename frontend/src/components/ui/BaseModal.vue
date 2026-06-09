<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="close"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-slate-800">{{ title }}</h3>
            <button @click="close" class="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="text-slate-600 mb-6">
            <slot />
          </div>
          <div class="flex justify-end gap-3">
            <BaseButton v-if="showCancel" variant="secondary" @click="close">{{ cancelText }}</BaseButton>
            <BaseButton :variant="confirmVariant" :loading="loading" @click="confirm">{{ confirmText }}</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import BaseButton from './BaseButton.vue';

const props = defineProps({
  show: Boolean,
  title: { type: String, default: '提示' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  showCancel: { type: Boolean, default: true },
  confirmVariant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => emit('close');
const confirm = () => emit('confirm');
</script>

<style scoped>
.modal-enter-from { opacity: 0; transform: scale(0.95); }
.modal-enter-active { transition: all 0.3s ease-out; }
.modal-enter-to { opacity: 1; transform: scale(1); }
.modal-leave-from { opacity: 1; transform: scale(1); }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
