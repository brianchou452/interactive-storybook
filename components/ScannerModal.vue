<template>
  <UModal
    :open="open"
    title="掃描要加入背包的物品"
    fullscreen
    @update:open="$emit('update:open', $event)"
    @close="onClose"
  >
    <UButton label="加入物品" color="neutral" />
    <template #body>
      <QRScanner ref="qrScannerRef" @scan="onScan" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import QRScanner from "./QRScanner.vue";
const emit = defineEmits(["close", "update:open", "scan"]);
const _props = defineProps<{
  open: boolean;
}>();

const toast = useToast();
const WORD_EXTERNAL_QRCODE = "非允許的 QRCode";
const availableProps = ref<{
  description: string;
  properties: {
    name: string;
    id: string;
    src: string;
    description: string;
  }[];
}>();
const qrScannerRef = ref<InstanceType<typeof QRScanner> | null>(null);

function onScan(result: string) {
  emit("scan", result);
  console.log("掃描結果:", result);
  handleToast(result);
  let matched = false;
  availableProps.value?.properties.forEach((item) => {
    if (item.id === result) {
      matched = true;
      console.log("掃描成功:", item);
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
