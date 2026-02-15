<script setup lang="ts">
import IconInfo from "@/components/icons/IconInfo.vue"
import IconSettings from "@/components/icons/IconSettings.vue";
import IconStats from "@/components/icons/IconStats.vue";
import IconAbout from "@/components/icons/IconAbout.vue";
import IconMenu from "@/components/icons/IconMenu.vue";
import IconEvent from "@/components/icons/IconEvent.vue";


import AboutModal from "@/components/Modals/AboutModal.vue";
import SupportModal from "@/components/Modals/SupportModal.vue";
import TutorialModal from "@/components/Modals/TutorialModal.vue";
import StatsModal from "@/components/Modals/StatsModal.vue";
import MenuModal from "@/components/Modals/MenuModal.vue";
import EventModal from "@/components/Modals/EventModal.vue";


import settings from "@/settings/settings.json"

import { sudokuMode } from "@/main";

const emit = defineEmits(['create-modal']);
</script>

<template>
  <header>
    <div class="max-w-screen-md mx-auto">
      <div class="main-container">
        <div class="button-container">
          <button @click="emit('create-modal', AboutModal)">
            <IconInfo/>
          </button>
          <button @click="emit('create-modal', TutorialModal)">
            <IconAbout/>
          </button>
          <!-- <button @click="emit('create-modal', EventModal)">
            <IconEvent/>
          </button> -->
        </div>
        <img v-if="!sudokuMode" src="@/assets/images/kh-http-logo.png" alt="Kingdom Hearts Heed to the Pulse" class="logo-image"/>
        <img v-else src="@/assets/images/kh-https-logo.png" alt="Kingdom Hearts Heed to the Pulse: Sudoku" class="logo-image"/>
        <!-- <h1 class="font-title">Kingdom Hearts</h1> -->
        <div class="button-container justify-end">
          <button @click="emit('create-modal', StatsModal)">
            <IconStats/>
          </button>
          <button @click="emit('create-modal', SupportModal)">
            <IconSettings/>
          </button>
          <button @click="emit('create-modal', MenuModal)">
            <IconMenu/>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  header {
    border-style: solid;
    border-color: var(--color-line);
    border-bottom-width: 1px;
  }

  .main-container{
    display: flex;
    justify-content: space-evenly;
    color: var(--color-fg);
    // padding: 0.75rem;
    align-items: center;
  }

  .button-container {
    display: flex;
    flex: 1 1 0%;

    button{
      border: none;
      cursor: pointer;
    }
  }

  h1 {
    font-weight: 10;
    text-align: center;
    flex: 1 1 0%;
  }

  .logo-image {
    max-height: 8rem;
    max-width: 50%;
    height: auto;
    object-fit: contain;
  }

  .justify-end {
    justify-content: flex-end;
  }
</style>