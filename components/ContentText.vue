<template>
  <div
    :style="{
      position: 'absolute',
      top: `${calculatePosition(position).y}px`,
      left: `${calculatePosition(position).x}px`,
      pointerEvents: 'none',
    }"
    class="w-full z-30"
  >
    <p class="p-2">{{ text }}</p>
  </div>
</template>

<script lang="ts" setup>
const { text, position, calculatePosition } = defineProps<{
  text: string;
  position: { x: number | string; y: number | string };
  calculatePosition: (position: { x: number | string; y: number | string }) => {
    x: number;
    y: number;
  };
}>();
</script>
