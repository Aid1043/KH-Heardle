<script setup lang="ts">

import {onMounted} from "vue";
import { PUZZLE_ACTIVE, CURRENT_PUZZLE } from "@/main";
import puzzles from '@/settings/puzzles.json'


onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "Event";
})

function goToPuzzle() {
  const params = new URLSearchParams(window.location.search);
  params.set("p", (0).toString());
  window.location.search = params.toString();
}

</script>

<template>
  <div class="results-text">
      <p>In limited-time events, you play through a special set of curated puzzles and compete for a high score!</p>
      <p>The winners of the each event will be listed here until the start of the next event.</p>
      <p>Your progress on each question is saved automatically.</p>
    </div>
  <div class="menu-container" v-if="PUZZLE_ACTIVE">
    <h2>{{ puzzles[CURRENT_PUZZLE].title }}</h2>
    <p v-for="line in puzzles[CURRENT_PUZZLE].description">{{ line }}</p>
    <div class="button-container font-medium">
      <div class="button-columns"> 
        <button @click="goToPuzzle" style="background: var(--color-puzzle); color: black">Play Event</button>
      </div>
    </div>
  </div>
  <div class="results-container" v-else>
    <div class="results-text">
      <p>There is no event in progress.</p>
      <p>Check out the winners of the last event!</p>
    </div>
    <h2>{{ puzzles[CURRENT_PUZZLE].title }}</h2>
    <div class="winners-list">
      <ul><li v-for="winner in puzzles[CURRENT_PUZZLE].winners" :key="winner.name">{{ winner.score }} points: {{ winner.name }}</li></ul>
    </div>
  </div>
</template>

<style scoped>

.menu-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  font-size: 1.2rem;
  line-height: 1.2rem;

  p {
    padding-top: 1rem;
  }
}

.results-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  font-size: 1.2rem;
  line-height: 1.2rem;
}

.results-text {
  width: 100%;
  border-bottom: 2px solid var(--color-line); 
  margin-bottom: 1rem;
  text-align: center;
  
  p {
    padding-bottom: 1rem;
  }
}

.winners-list {
  min-width: 50%;
  text-align: left;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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