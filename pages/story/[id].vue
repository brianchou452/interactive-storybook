<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";

const route = useRoute();
const storyIdWithPageID = route.params.id as string;
const storyId = storyIdWithPageID.split("X")[0];
const currentPage = storyIdWithPageID.split("X")[1] || "1";

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
const imgWidth = ref(1080);
const imgHeight = ref(1920);
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

onMounted(() => {
  currentStory.value?.options.forEach((option) => {
    preloadRouteComponents(`/story/${storyId}X${option.next}`);
  });
});

watchEffect(() => {
  updateStory();
});

function calculatePosition(position: {
  x: number | string;
  y: number | string;
}) {
  let x: number, y: number;
  if (typeof position.x === "string" && position.x.endsWith("%")) {
    x = (parseFloat(position.x) / 100) * imgWidth.value;
  } else {
    x = (Number(position.x) / 1080) * imgWidth.value;
  }
  if (typeof position.y === "string" && position.y.endsWith("%")) {
    y = (parseFloat(position.y) / 100) * imgHeight.value;
  } else {
    y = (Number(position.y) / 1920) * imgHeight.value;
  }
  return { x, y };
}

function onImgLoad() {
  if (imgRef.value) {
    imgWidth.value = imgRef.value.clientWidth;
    imgHeight.value = imgRef.value.clientHeight;
  }
}
</script>

<template>
  <div v-if="currentStory">
    <ClientOnly>
      <div class="p-0 m-0 h-full w-full">
        <div style="position: relative; display: inline-block">
          <div
            v-for="content in contents"
            :key="content.text"
            :style="{
              position: 'absolute',
              top: `${calculatePosition(content.position).y}px`,
              left: `${calculatePosition(content.position).x}px`,
              // transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }"
            class="w-full"
          >
            <p class="p-2">{{ content.text }}</p>
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
            <NuxtLink
              :to="{
                name: 'story-id',
                params: { id: `${storyId}X${option.next}` },
              }"
            >
              {{ option.text }}
            </NuxtLink>
          </div>
          <img
            v-if="imgSrc"
            ref="imgRef"
            :src="imgSrc"
            alt="動態圖片"
            class="p-0 m-0 object-contain h-full"
            @load="onImgLoad"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
  <div v-else>
    <p>Loading story...</p>
  </div>
</template>
