<template>
  <div
    :style="{
      position: 'absolute',
      top: `${calculatePosition(position).y}px`,
      left: `${calculatePosition(position).x}px`,
      transform: 'translate(-50%, -50%)',
    }"
    class="bg-orange-700 px-4 py-2 rounded z-20"
  >
    <NuxtLink
      :to="{
        name: 'story-id',
        params: { id: `${storyId}X${next}` },
      }"
      class="text-white"
    >
      {{ text }}
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const { text, next, position, storyId, calculatePosition } = defineProps<{
  text: string;
  next: string;
  position: { x: number | string; y: number | string };
  storyId: string;
  calculatePosition: (position: { x: number | string; y: number | string }) => {
    x: number;
    y: number;
  };
}>();
</script>
