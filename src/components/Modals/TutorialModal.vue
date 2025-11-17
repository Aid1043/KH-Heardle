<script setup lang="ts">

import IconMusicNote from "@/components/icons/iconMusicNote.vue";
import IconSpeaker from "@/components/icons/IconSpeaker.vue";
import IconHeart from "@/components/icons/IconHeart.vue";
import {onMounted} from "vue";
import { sudokuMode } from "@/main";

import settings from "@/settings/settings.json"
import IconThumbUp from "../icons/IconThumbUp.vue";

onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "How to play";
})

function goToInfinite() {
  sessionStorage.setItem('infinite', true.toString());
  sessionStorage.setItem('sudoku-mode', false.toString());
  window.location.reload();
}

function goToDaily() {
  sessionStorage.setItem('infinite', false.toString());
  sessionStorage.setItem('sudoku-mode', false.toString());
  window.location.reload();
}

function goToSudoku() {
  sessionStorage.setItem('sudoku-mode', true.toString());
  window.location.reload();
}

</script>

<template>
  <div>
    <div v-if="!sudokuMode">
      <div class="info">
        <div class="icon">
          <IconMusicNote/>
        </div>
        <div>
          <p>Listen to a short clip of a Kingdom Hearts song, then choose the title and game from the list.</p>
        </div>
      </div>
      <div class="info">
        <div class="icon">
          <IconSpeaker/>
        </div>
        <div>
          <p>Skipped or incorrect attempts unlock more of the song.</p>
        </div>
      </div>
      <div class="info">
        <div class="icon">
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <IconHeart/>
          </div>
        </div>
        <div>
          <p>Test yourself with the Daily Challenge or customize the song list in Infinite Mode!</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="info">
        <div class="icon">
          <IconMusicNote/>
        </div>
        <div>
          <p>Fill in all cells with Kingdom Hearts songs that fit the category of its row and column!</p>
        </div>
      </div>
      <div class="info">
        <div class="icon">
          <IconSpeaker/>
        </div>
        <div>
          <p>You may not repeat songs on the baord. Each cell will have at least two correct answers.</p>
        </div>
      </div>
      <div class="info">
        <div class="icon">
          <IconThumbUp/>
        </div>
        <div>
          <p>You will have three attempts to submit a solution. The puzzle will refresh daily!</p>
        </div>
      </div>
    </div>
    <div class="button-container font-medium">
      <div class="button-columns"> 
        <button @click="goToDaily">Daily</button>
        <button @click="goToInfinite" style="background: var(--color-button-highlight);">Infinite</button>
      </div>
    </div>
    <div class="button-container font-medium">
      <div class="button-columns"> 
        <button @click="goToSudoku" style="background: var(--color-sudoku);">Sudoku Mode</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  align-items: center;

  margin-bottom: 1.5rem;
}

.info .icon {
  color: var(--color-line);
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.button-container {
  display: flex;
  justify-content: center;

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  margin-top: 0.5rem;
}

.button-columns {
  display: flex;
  gap: 3rem;
}

.button-container button {
  text-transform: uppercase;

  text-indent: 0.25em;
  letter-spacing: 0.2em;
  font-weight: 10;

  padding: 0.5rem;

  background: var(--color-submit);

  border-style: none;

  align-items: center;
  display: flex;

  cursor: pointer;
}
</style>