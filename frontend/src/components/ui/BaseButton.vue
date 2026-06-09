<template>
  <button
    :class="[
      'inline-flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 font-medium active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size]
    ]"
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizeClasses = {
  xs: 'text-[10px] px-2 py-1',
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};
</script>
