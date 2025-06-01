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
    <p ref="storyTextRef" class="p-2"></p>
  </div>
</template>

<script lang="ts" setup>
import Typed from "typed.js";
import { onMounted, ref } from "vue";
const { text, position, calculatePosition } = defineProps<{
  text: string;
  position: { x: number | string; y: number | string };
  calculatePosition: (position: { x: number | string; y: number | string }) => {
    x: number;
    y: number;
  };
}>();

const storyTextRef = ref<HTMLElement | null>(null);
let _typedInstance: Typed | null = null;

onMounted(() => {
  if (storyTextRef.value) {
    _typedInstance = new Typed(storyTextRef.value, {
      strings: [text],
      typeSpeed: 50,
    });
  }
});
</script>
