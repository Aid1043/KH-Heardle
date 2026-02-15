<script setup lang="ts">
import { ref, onMounted } from "vue";
import settings from "@/settings/settings.json";
import { sudokuMode } from "@/main";

const guessDistribution = ref<number[]>([]);
const maxGuesses = ref(0);
const infiniteStats = ref<{ gamesWon: number; gamesPlayed: number }>({ gamesWon: 0, gamesPlayed: 0 });
const infiniteAccuracy = ref(0);
const sudokuGuessDistribution = ref<number[]>([]);
const sudokuMaxGuesses = ref(0);


onMounted(() => {
  document.getElementById("modal-title").innerHTML = "Stats";
  guessDistribution.value = calculateAverageGuesses();
  maxGuesses.value = Math.max(...guessDistribution.value) ? Math.max(...guessDistribution.value) : 1;
  infiniteStats.value = getInfiniteStats();
  infiniteAccuracy.value = infiniteStats.value.gamesPlayed > 0 ? (infiniteStats.value.gamesWon / infiniteStats.value.gamesPlayed) * 100 : 0;
  sudokuGuessDistribution.value = calculateAverageGuessesSudoku();
  sudokuMaxGuesses.value = Math.max(...sudokuGuessDistribution.value) ? Math.max(...sudokuGuessDistribution.value) : 1;
});

function calculateAverageGuesses() {
  const statDistribution = Array(settings["guess-number"] + 1).fill(0);

  const stats = localStorage.getItem("userStats");
  if (!stats) return statDistribution;

  const parsedStats = JSON.parse(stats);
  for (const stat of parsedStats) {
    if (stat.isFinished && stat.id > 20000) statDistribution[stat.guess] += 1;
  }
  return statDistribution;
}

function getInfiniteStats() {
  const infiniteStatsRaw = localStorage.getItem("userStatsInfinite");
  if (!infiniteStatsRaw) return { gamesWon: 0, gamesPlayed: 0 };

  return JSON.parse(infiniteStatsRaw);
}

function calculateAverageGuessesSudoku() {
  const statDistribution = Array(settings["sudoku-guess-number"] + 1).fill(0);

  const stats = localStorage.getItem("sudokuStats");
  if (!stats) return statDistribution;

  const parsedStats = JSON.parse(stats);
  for (const stat of parsedStats) {
    if (stat.isFinished) statDistribution[stat.guess - 1] += 1;
  }
  return statDistribution;
}
</script>

<template>
  <div v-if="!sudokuMode">
    <div class = "stats-header">Daily Challenge</div>
    <div class="bar-graph-container">
      <div class="bar-graph-row" v-for="(value, index) in guessDistribution" :key="index">
        <div v-if="index === settings['guess-number']">
          <p class="bar-graph-label">Skipped:</p>
        </div>
        <div v-else>
          <p class="bar-graph-label">{{ settings['times'][index] }} sec:</p>
        </div>

        <div class="bar-graph-bar-outer">
          <div class="bar-graph-bar-inner" :style="{ width: (value / maxGuesses) * 100 + '%' }" ></div>
        </div>

        <p class="bar-graph-value">{{ value }}</p>
      </div>
    </div>
    <div class="stats-header" style="margin-top: 20px; border-top: 1px solid var(--color-line); padding-top: 15px;">Infinite Mode</div>
    <div class="bar-graph-container">
      <div class="bar-graph-row">
        <p class="bar-graph-label">Won:</p>
        <p class = "bar-graph-value">{{ infiniteStats.gamesWon }}</p>
      </div>
      <div class="bar-graph-row">
        <p class="bar-graph-label">Played:</p>
        <p class = "bar-graph-value">{{ infiniteStats.gamesPlayed }}</p>
      </div>
      <div class="bar-graph-row">
        <p class="bar-graph-label">Accuracy:</p>
        <div class="bar-graph-bar-outer">
          <div class="bar-graph-bar-inner-infinite" :style="{ width: Math.max(1, infiniteAccuracy) + '%' }" ></div>
        </div>
        <p class = "bar-graph-value">{{Math.round(infiniteAccuracy)}}%</p>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="stats-header">Sudoku</div>
    <div class="bar-graph-container">
      <div class="bar-graph-row" v-for="(value, index) in sudokuGuessDistribution" :key="index">
        <div v-if="index === settings['sudoku-guess-number']">
          <p class="bar-graph-label">Failed:</p>
        </div>
        <div v-else-if="index === 0">
          <p class="bar-graph-label">1 try:</p>
        </div>
        <div v-else>
          <p class="bar-graph-label">{{ index + 1 }} tries:</p>
        </div>

        <div class="bar-graph-bar-outer">
          <div class="bar-graph-bar-inner-sudoku" :style="{ width: (value / sudokuMaxGuesses) * 100 + '%' }" ></div>
        </div>

        <p class="bar-graph-value">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-header {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.bar-graph-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.bar-graph-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar-graph-label {
  width: 80px;
  text-align: right;
}
.bar-graph-bar-outer {
  flex-grow: 1;
  background-color: var(--color-dg);
  height: 20px;
  overflow: hidden;
}
.bar-graph-bar-inner {
  height: 100%;
  background-color: var(--color-positive);
}
.bar-graph-bar-inner-infinite {
  height: 100%;
  background-color: var(--color-button-highlight);
}
.bar-graph-bar-inner-sudoku {
  height: 100%;
  background-color: var(--color-sudoku);
}
.bar-graph-value {
  width: 30px;
  text-align: left;
}
</style>