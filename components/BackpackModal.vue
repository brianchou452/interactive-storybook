<template>
  <UModal
    :open="open"
    title="背包"
    fullscreen
    @update:open="$emit('update:open', $event)"
  >
    <UButton
      :avatar="{
        src: 'https://github.com/nuxt.png',
      }"
      size="md"
      color="neutral"
      variant="outline"
      class="absolute bottom-8 right-4"
    >
      背包
    </UButton>
    <template #body>
      <UButton
        label="Close"
        color="neutral"
        variant="outline"
        @click="$emit('close')"
      />
      <slot name="scanner"></slot>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
defineEmits(["close", "update:open"]);
</script>
