<script setup lang="ts">

import {onMounted} from "vue";
import { PUZZLE_ACTIVE } from "@/main";


onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "Game Menu";
})

function goToInfinite() {
  sessionStorage.setItem('infinite', true.toString());
  sessionStorage.setItem('sudoku-mode', false.toString());
  window.location.reload();
}

function goToDaily() {
  sessionStorage.setItem('infinite', false.toString());
  sessionStorage.setItem('sudoku-mode', false.toString());
  window.location.search = "";
}

function goToSudoku() {
  sessionStorage.setItem('infinite', false.toString());
  sessionStorage.setItem('sudoku-mode', true.toString());
  window.location.search = "";
}

function goToSudokuInfinite() {
  sessionStorage.setItem('infinite', true.toString());
  sessionStorage.setItem('sudoku-mode', true.toString());
  window.location.reload();
}

function goToPuzzle() {
  const params = new URLSearchParams(window.location.search);
  params.set("p", (0).toString());
  window.location.search = params.toString();
}

</script>

<template>
  <div class="menu-container">
      Heed to the Pulse
    <div class="button-container font-medium">
      <div class="button-columns"> 
        <button @click="goToDaily">Daily</button>
        <button @click="goToInfinite" style="background: var(--color-button-highlight);">Infinite</button>
      </div>
    </div>
    <div class="next">
      Heed to the Pulse: Sudoku
    </div>
    <div class="button-container font-medium">
      <div class="button-columns"> 
        <button @click="goToSudoku" style="background: var(--color-sudoku);">Daily Sudoku</button>
        <button @click="goToSudokuInfinite" style="background: var(--color-sudoku);">Infinite Sudoku</button>
      </div>
    </div>
    <span v-if="PUZZLE_ACTIVE">
      <div class="next">
        Limited-Time Challenge Event
      </div>
      <div class="button-container font-medium">
        <div class="button-columns"> 
          <button @click="goToPuzzle" style="background: var(--color-puzzle); color: black">Special Event</button>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>

.menu-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  font-size: 1.6rem;

  .next {
    padding-top: 1rem;
  }
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