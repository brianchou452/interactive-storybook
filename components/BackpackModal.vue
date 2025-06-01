<template>
  <UModal
    :open="open"
    title="背包"
    fullscreen
    @update:open="$emit('update:open', $event)"
  >
    <UButton
      :avatar="{
        src: '/storybook/2/picture/背包.png',
      }"
      size="xl"
      color="neutral"
      variant="outline"
      class="absolute bottom-8 right-4 z-50"
    >
      背包
    </UButton>
    <template #body>
      <div class="p-4">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="item in backpackItems"
            :key="item.id"
            class="flex flex-col items-center justify-center bg-white rounded-lg shadow p-2"
          >
            <img
              :src="item.src"
              :alt="item.name"
              class="w-16 h-16 object-contain mb-2"
            />
            <span class="text-xs text-center">{{ item.name }}</span>
          </div>
          <!-- 新增道具按鈕 -->
          <div class="flex flex-col items-center justify-center">
            <slot name="scanner"></slot>
            <span class="text-xs text-center mt-2">加入新道具</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBackpacktStore } from "~/stores/backpack";
defineProps<{ open: boolean }>();
defineEmits(["close", "update:open"]);
const backpackStore = useBackpacktStore();
const { getItems } = storeToRefs(backpackStore);
const backpackItems = getItems;
</script>
