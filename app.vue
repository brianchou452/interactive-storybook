<script lang="ts" setup>
import "~/assets/css/fixed-vertical.css";

useHead({
  title: "互動式繪本",
  meta: [{ name: "description", content: "互動式繪本" }],
  bodyAttrs: {
    class: "test",
  },
});
</script>

<template>
  <UApp>
    <div class="fullscreen-black-bg">
      <div
        class="fixed-vertical-container"
        :ui="{
          padding: '0px',
        }"
      >
        <NuxtLayout>
          <Transition name="fade" mode="out-in">
            <NuxtPage />
          </Transition>
        </NuxtLayout>
      </div>
    </div>
  </UApp>
</template>
