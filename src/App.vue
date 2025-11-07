<script setup lang="ts">
// Component imports
import Header from "@/components/Header.vue";
import ModalBase from "@/components/Modals/ModalBase.vue";
import {onMounted, onBeforeUnmount, ref, shallowRef} from "vue";
import TutorialModal from "@/components/Modals/TutorialModal.vue";

// Vue Binding References
const style = ref("height:" + window.innerHeight + "px;")
const showModal = ref(false);
const currentModal = shallowRef(null);

// Setting Manager
import themes from '@/settings/themes.json'
import settings from "@/settings/settings.json"
import MainGame from "@/components/MainGame.vue";

import { currentGameState } from "@/main";
import EndGame from "@/components/EndGame.vue";

// CSS Variables
const colors = {};

// Modal function
function openModal(modalComponent) {
  currentModal.value = modalComponent;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

onMounted(() => {
  window.addEventListener('resize', ()=>style.value = "height:" + window.innerHeight + "px;");

  let r = document.querySelector(':root');

  for (let theme in themes) {
    if(theme === "!COMMENT!") continue;

    let colorKey = "--color-"+theme;

    let value = themes[theme]["value"];
    if(themes[theme]["type"] === "url") value = "url('" + value + "')";
    if(themes[theme]["type"] === "var") value = "var(" + "--color-"+value + ")";

    console.log(colorKey);

    r.style.setProperty(colorKey, value);
  }

  if(window.localStorage.getItem('firstPlay') !== "false"){
    openModal(TutorialModal);
    window.localStorage.setItem('firstPlay', 'false');
  }

  document.title = settings["tab-title"]
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', ()=>style.value = "height:" + window.innerHeight + "px;");
});

</script>

<template>
  <main id='main' :style="style">
    <ModalBase v-if="showModal" @close="closeModal" :wide="currentModal?.__name === 'SupportModal'">
      <component :is="currentModal" />
    </ModalBase>
    <div class="no-flex">
      <Header @create-modal="(modal)=>openModal(modal)"/>
    </div>
    <MainGame v-if="!currentGameState.isFinished"/>
    <EndGame v-else/>
  </main>
</template>

<style scoped lang="scss">
main {
  background: var(--color-bg);
  color: var(--color-fg);

  overflow: auto;

  display: flex;

  flex-direction: column;
}

.no-flex {
  flex: none;
}
</style>
