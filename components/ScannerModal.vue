<template>
  <UModal
    :open="open"
    title="掃描要加入背包的物品"
    fullscreen
    @update:open="$emit('update:open', $event)"
    @close="onClose"
  >
    <UButton
      icon="i-heroicons-plus"
      color="primary"
      variant="soft"
      class="w-16 h-16 flex items-center justify-center"
    />
    <template #body>
      <QRScanner ref="qrScannerRef" @scan="onScan" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Item } from "~/stores/backpack";
import { useBackpacktStore } from "~/stores/backpack";
import QRScanner from "./QRScanner.vue";
const emit = defineEmits(["close", "update:open", "scan"]);
const _props = defineProps<{
  open: boolean;
}>();

const toast = useToast();
const WORD_EXTERNAL_QRCODE = "非允許的 QRCode";
const availableProps = ref<{
  description: string;
  properties: Item[];
}>();
const qrScannerRef = ref<InstanceType<typeof QRScanner> | null>(null);

function onScan(result: string) {
  emit("scan", result);
  console.log("掃描結果:", result);
  let matched = false;
  const backpackStore = useBackpacktStore();
  availableProps.value?.properties.forEach((item) => {
    if (item.id === result) {
      matched = true;
      console.log("掃描成功:", item);
      handleToast(`成功將${item.name}加入背包`);
      backpackStore.addItem(item);
      emit("update:open", false); // 掃描成功時自動關閉 modal
    }
  });
  if (!matched) {
    handleToast(WORD_EXTERNAL_QRCODE);
  }
}

onMounted(async () => {
  try {
    const res = await fetch("/storybook/2/available_game_props.json");
    availableProps.value = await res.json();
  } catch (err) {
    console.error("讀取 available_url.json 失敗", err);
  }
});

function onClose() {
  emit("close");
  if (qrScannerRef.value) {
    qrScannerRef.value.stopCamera();
    console.log("掃描器已停止");
  }
}

function handleToast(content: string) {
  toast.add({
    title: content,
  });
}
</script>
