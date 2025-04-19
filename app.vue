<script lang="ts" setup>
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
