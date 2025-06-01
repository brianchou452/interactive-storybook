<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import BackpackModal from "~/components/BackpackModal.vue";
import CharacterImage from "~/components/CharacterImage.vue";
import ContentText from "~/components/ContentText.vue";
import OptionButton from "~/components/OptionButton.vue";
import ScannerModal from "~/components/ScannerModal.vue";
import type { Option, Position } from "../../components/types";

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
const containerRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(1080);
const containerHeight = ref(1920);

const options = ref((currentStory.value?.options || []) as unknown as Option[]);
const contents = ref(
  (currentStory.value?.content || []) as unknown as {
    text: string;
    position: {
      x: number | string;
      y: number | string;
    };
  }[]
);
const characters = ref(
  (currentStory.value?.characters || []) as unknown as {
    name: string;
    src: string;
    position: Position;
  }[]
);

const backpackModel = ref(false);
const scannerModel = ref(false);

function updateStory() {
  if (currentStory.value?.background) {
    imgSrc.value = currentStory.value.background.src;
  }
  if (currentStory.value?.options) {
    options.value = currentStory.value.options.map((option) => option);
  }
  if (currentStory.value?.content) {
    contents.value = currentStory.value.content.map((content) => content);
  }
  if (Array.isArray(currentStory.value?.characters)) {
    characters.value = currentStory.value.characters.map(
      (character) => character
    );
  } else {
    characters.value = [];
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

function updateContainerSize() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth;
    containerHeight.value = containerRef.value.clientHeight;
  }
}

function calculatePosition(position: {
  x: number | string;
  y: number | string;
}) {
  let x: number, y: number;
  if (typeof position.x === "string" && position.x.endsWith("%")) {
    x = (parseFloat(position.x) / 100) * containerWidth.value;
  } else {
    x = (Number(position.x) / 1080) * containerWidth.value;
  }
  if (typeof position.y === "string" && position.y.endsWith("%")) {
    y = (parseFloat(position.y) / 100) * containerHeight.value;
  } else {
    y = (Number(position.y) / 1920) * containerHeight.value;
  }
  return { x, y };
}

function onImgLoad() {
  if (imgRef.value) {
    imgWidth.value = imgRef.value.clientWidth;
    imgHeight.value = imgRef.value.clientHeight;
  }
  updateContainerSize();
}
</script>

<template>
  <div v-if="currentStory">
    <ClientOnly>
      <div class="p-0 m-0 h-full w-full">
        <div
          ref="containerRef"
          style="position: relative; display: inline-block"
        >
          <img
            v-if="imgSrc"
            ref="imgRef"
            :src="imgSrc"
            alt="動態圖片"
            style="
              z-index: 0;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
            "
            @load="onImgLoad"
          />
          <ContentText
            v-for="content in contents"
            :key="content.text"
            :text="content.text"
            :position="content.position"
            :calculate-position="calculatePosition"
          />
          <OptionButton
            v-for="option in options"
            :key="option.next"
            :option="option"
            :story-id="storyId"
            :calculate-position="calculatePosition"
          />
          <CharacterImage
            v-for="character in characters"
            :key="character.src"
            :src="character.src"
            :position="character.position"
            :calculate-position="calculatePosition"
          />

          <BackpackModal
            :open="backpackModel"
            @update:open="backpackModel = $event"
            @close="backpackModel = false"
          >
            <template #scanner>
              <ScannerModal
                :open="scannerModel"
                @update:open="scannerModel = $event"
                @close="scannerModel = false"
              />
            </template>
          </BackpackModal>
        </div>
      </div>
    </ClientOnly>
  </div>
  <div v-else>
    <p>Loading story...</p>
  </div>
</template>
