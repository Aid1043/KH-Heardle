<script setup lang="ts">

import IconInfinite from "@/components/icons/IconInfinite.vue";
import settings from "@/settings/settings.json"

import {ParseStringWithVariable} from "@/main";

function goToInfinite() {
  sessionStorage.setItem('infinite', true.toString());

  // Reload so the new settings take effect across the app
  window.location.reload();
}
</script>

<template>
  <div>
    <button class="infinite-button" @click="goToInfinite">
      Infinite Mode
    </button>
  </div>
</template>

<style scoped>
div {
  display: flex;

  text-align: center;
  justify-content: center;
  align-items: center;

  flex-direction: column;
}

.infinite-button {
  background: var(--color-button-highlight);
  color: var(--color-fg);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.infinite-button:hover {
  opacity: 0.9;
}
</style>