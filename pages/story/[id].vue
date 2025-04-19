<script lang="ts" setup>
import { nextTick, onMounted, ref, watchEffect } from "vue";

const route = useRoute();
const storyId = route.params.id as string;
const currentPage = route.query.page || "1";

const { data: currentStory } = await useAsyncData(
  "stories",
  () => {
    return queryCollection("stories")
      .andWhere((query) =>
        query.where("storyId", "=", storyId).where("pageId", "=", currentPage)
      )
      .first();
  },
  { immediate: true }
);
const imgSrc = ref("");
const imgRef = ref<HTMLImageElement | null>(null);
const imgWidth = ref(1920);
const imgHeight = ref(1080);
const options = ref(
  (currentStory.value?.options || []) as unknown as {
    text: string;
    next: string;
    position: { x: number; y: number };
  }[]
);
const contents = ref(
  (currentStory.value?.content || []) as unknown as {
    text: string;
    position: {
      x: number;
      y: number;
    };
  }[]
);

async function updateImageSize() {
  await nextTick();
  if (imgRef.value) {
    imgWidth.value = imgRef.value.naturalWidth || imgRef.value.width || 1920;
    imgHeight.value = imgRef.value.naturalHeight || imgRef.value.height || 1080;
    if (imgRef.value.clientWidth && imgRef.value.clientHeight) {
      imgWidth.value = imgRef.value.clientWidth;
      imgHeight.value = imgRef.value.clientHeight;
    }
  }
}

function updateStory() {
  if (typeof window !== "undefined" && currentStory.value?.sound) {
    const audio = new Audio(currentStory.value.sound.src);
    audio.volume = currentStory.value.sound.volume;
    audio.play();
  }
  if (currentStory.value?.background) {
    imgSrc.value = currentStory.value.background.src;
  }
  if (currentStory.value?.options) {
    options.value = currentStory.value.options.map((option) => ({
      text: option.text,
      next: option.next,
      position: option.position,
    }));
  }
  if (currentStory.value?.content) {
    contents.value = currentStory.value.content.map((content) => ({
      text: content.text,
      position: content.position,
    }));
  }
}

function goToPage(nextPageId: string) {
  window.location.href = `/story/${storyId}?page=${nextPageId}`;
}

onMounted(() => {
  updateImageSize();
});

watchEffect(() => {
  updateStory();
  updateImageSize();
});

function calculatePosition(position: { x: number; y: number }) {
  return {
    x: (position.x / 1920) * imgWidth.value,
    y: (position.y / 1080) * imgHeight.value,
  };
}
</script>

<template>
  <div v-if="currentStory">
    <ClientOnly>
      <div style="position: relative; display: inline-block">
        <img
          v-if="imgSrc"
          ref="imgRef"
          :src="imgSrc"
          alt="動態圖片"
          style="display: block; max-width: 100%; height: auto"
          @load="updateImageSize"
        />
        <div
          v-for="content in contents"
          :key="content.text"
          :style="{
            position: 'absolute',
            top: `${calculatePosition(content.position).y}px`,
            left: `${calculatePosition(content.position).x}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }"
        >
          <p>{{ content.text }}</p>
        </div>
        <div
          v-for="option in options"
          :key="option.next"
          :style="{
            position: 'absolute',
            top: `${calculatePosition(option.position).y}px`,
            left: `${calculatePosition(option.position).x}px`,
            transform: 'translate(-50%, -50%)',
          }"
        >
          <button @click="goToPage(option.next)">{{ option.text }}</button>
        </div>
      </div>
    </ClientOnly>
  </div>
  <div v-else>
    <p>Loading story...</p>
  </div>
</template>
