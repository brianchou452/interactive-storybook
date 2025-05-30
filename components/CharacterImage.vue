<template>
  <div
    :style="{
      position: 'absolute',
      top: `${calculatePosition(position).y}px`,
      left: `${calculatePosition(position).x}px`,
    }"
    class="z-10"
  >
    <img :src="src" alt="character" class="p-0 m-0 object-contain h-full z-0" />
  </div>
</template>

<script lang="ts" setup>
const { src, position, calculatePosition } = defineProps<{
  src: string;
  position: { x: number | string; y: number | string };
  calculatePosition: (position: { x: number | string; y: number | string }) => {
    x: number;
    y: number;
  };
}>();
</script>
