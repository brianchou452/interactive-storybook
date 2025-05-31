<template>
  <div class="scan-container">
    <video ref="videoRef">
      <track id="video" kind="captions" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const toast = useToast();

const emit = defineEmits(["scan"]);

const videoRef = ref<HTMLVideoElement | null>(null);
const codeReaderRef = ref<unknown>(null); // controlsRef 型別修正
let controlsRef: { stop?: () => void } | null = null;
let streamRef: MediaStream | null = null;

const WORD_CAMERA_PERMISSION_DENIAL = "未取得相機權限";

function handleToast(content: string) {
  toast.add({
    title: content,
  });
}

function handleScan(data: string) {
  if (data) {
    emit("scan", data);
  }
}

function handleError(error: unknown) {
  console.error("QR Scanner Error:", error);
}

onMounted(async () => {
  const { BrowserQRCodeReader } = await import("@zxing/browser");
  const codeReader = new BrowserQRCodeReader();
  codeReaderRef.value = codeReader;
  let selectedDeviceId: string | undefined;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "environment" },
    });
    streamRef = stream;
    selectedDeviceId = stream.getVideoTracks()[0].getSettings().deviceId;
  } catch (err) {
    console.error("Camera permission error:", err);
    handleToast(WORD_CAMERA_PERMISSION_DENIAL);
  }
  controlsRef = await codeReader.decodeFromVideoDevice(
    selectedDeviceId,
    videoRef.value || undefined,
    (result, error) => {
      if (result) {
        handleScan(result.getText());
      } else if (error) {
        if (error.getKind && error.getKind() !== "NotFoundException") {
          handleError(error);
        }
      }
    }
  );
});

function stopCamera() {
  console.log("Stopping camera...");
  if (controlsRef && typeof controlsRef.stop === "function") {
    controlsRef.stop();
  }
  if (streamRef) {
    streamRef.getTracks().forEach((track) => track.stop());
    streamRef = null;
  }
  console.log("Camera stopped.");
}

defineExpose({ stopCamera });

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.scan-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}
.scan-range {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 60vw;
  max-width: 400px;
  transform: translate(-50%, -50%);
  opacity: 0.7;
}
.toast {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #f87171;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 10;
  font-size: 1rem;
}
</style>
