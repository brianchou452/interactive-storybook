<template>
  <div
    :style="{
      position: 'absolute',
      top: `${calculatePosition(option.position).y}px`,
      left: `${calculatePosition(option.position).x}px`,
      transform: 'translate(-50%, -50%)',
    }"
    class="bg-orange-700 px-4 py-2 rounded z-20"
  >
    <a href="#" class="text-white" @click.prevent="handleClick">
      {{ option.text }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { Option, Position } from "~/components/types";
import { useBackpacktStore } from "~/stores/backpack";

const { option, storyId, calculatePosition } = defineProps<{
  option: Option;
  storyId: string;
  calculatePosition: (position: Position) => {
    x: number;
    y: number;
  };
}>();

const backpackStore = useBackpacktStore();
const router = useRouter();

function handleClick(e: Event) {
  console.log("點擊選項:", option);
  if (!backpackStore.hasRequiredItems(option.requireItems)) {
    console.warn("缺少必要道具，無法跳轉");
    e.preventDefault();
    // 取得缺少的 id 並轉換成名稱
    const missingIds = backpackStore.getMissingItemIds(option.requireItems);
    const missingNames = missingIds.map((id) => {
      return id.split(":")[0];
    });
    const toast = useToast();

    toast.add({
      title: `缺少必要道具：${missingNames.join("、")}`,
    });
    return;
  }
  router.push({
    name: "story-id",
    params: { id: `${storyId}X${option.next}` },
  });
}
</script>
