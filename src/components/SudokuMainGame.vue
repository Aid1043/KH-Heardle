<script setup lang="ts">

import { reactive, computed } from "vue";
import settings from "@/settings/settings.json";
import sudoku_music from "@/settings/sudoku_music.json";
import SudokuGuessBar from "./SudokuGuessBar.vue";

import { sudokuGameState, sudokuBoard, infiniteEnabled } from "@/main";
const hover = reactive(Array(6).fill(false));

const possibleAnswers = computed(() => {
  const results: Array<{ row: any; col: any; tracks: string[] }> = [];

  const colTags = sudokuBoard.slice(0, 3);
  const rowTags = sudokuBoard.slice(3, 6);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const rowTag = rowTags[r];
      const colTag = colTags[c];

      const rowList = sudoku_music[rowTag.tag];
      const colList = sudoku_music[colTag.tag];

      const overlap = rowList.filter(track => colList.includes(track));

      results.push({
        row: rowTag,
        col: colTag,
        tracks: overlap
      });
    }
  }

  return results;
});

</script>

<template>
  <span v-if="sudokuGameState.isFinished">
    <div class="results-container">
      <div class="top-results">
        <span v-if="sudokuGameState.isWon">
          Congratulations! You solved today's puzzle in {{ sudokuGameState.guess }} attempts!
        </span>
        <span v-else>
          You couldn't solve today's puzzle. Better luck tomorrow!
        </span>
      </div>
    </div>
  </span>
  <div class="game-container">
    <div class="max-w-screen-lg">
      <div class="guess-container">
         <div class="grid">
          <div class="cell-instructions">Hover over a hint for details!</div>
          <div class="cell-label" @mouseenter="hover[0] = true" @mouseleave="hover[0] = false">{{ hover[0] ? sudokuBoard[0]['long-desc'] : sudokuBoard[0]['short-desc']}}</div>
          <div class="cell-label" @mouseenter="hover[1] = true" @mouseleave="hover[1] = false">{{ hover[1] ? sudokuBoard[1]['long-desc'] : sudokuBoard[1]['short-desc']}}</div>
          <div class="cell-label" @mouseenter="hover[2] = true" @mouseleave="hover[2] = false">{{ hover[2] ? sudokuBoard[2]['long-desc'] : sudokuBoard[2]['short-desc']}}</div>
          <div class="cell-instructions"></div>

          <div class="cell-label" @mouseenter="hover[3] = true" @mouseleave="hover[3] = false">{{ hover[3] ? sudokuBoard[3]['long-desc'] : sudokuBoard[3]['short-desc']}}</div>
          <div v-for="i in 3" :key="i" class="cell-guess" :class="{ selected: sudokuGameState.activeCell === i, incorrect: !sudokuGameState.correct[i] }" @click="sudokuGameState.activeCell = (sudokuGameState.activeCell === i ? -1 : i)">
          {{ sudokuGameState.guessed[i] ? sudokuGameState.guessed[i] : "Select a track." }}
          </div>
          <div class="cell-instructions"></div>

          <div class="cell-label" @mouseenter="hover[4] = true" @mouseleave="hover[4] = false">{{ hover[4] ? sudokuBoard[4]['long-desc'] : sudokuBoard[4]['short-desc']}}</div>
          <div v-for="i in 3" :key="i" class="cell-guess" :class="{ selected: sudokuGameState.activeCell === i+3, incorrect: !sudokuGameState.correct[i+3] }" @click="sudokuGameState.activeCell = (sudokuGameState.activeCell === i+3 ? -1 : i+3)">
          {{ sudokuGameState.guessed[i+3] ? sudokuGameState.guessed[i+3] : "Select a track." }}
          </div>
          <div class="cell-instructions"></div>

          <div class="cell-label" @mouseenter="hover[5] = true" @mouseleave="hover[5] = false">{{ hover[5] ? sudokuBoard[5]['long-desc'] : sudokuBoard[5]['short-desc']}}</div>
          <div v-for="i in 3" :key="i" class="cell-guess" :class="{ selected: sudokuGameState.activeCell === i+6, incorrect: !sudokuGameState.correct[i+6] }" @click="sudokuGameState.activeCell = (sudokuGameState.activeCell === i+6 ? -1 : i+6)">
          {{ sudokuGameState.guessed[i+6] ? sudokuGameState.guessed[i+6] : "Select a track." }}
          </div>
          <div class="cell-instructions">Submit attempts<br/>remaining:<br/>{{ 1 + settings["sudoku-guess-number"] - sudokuGameState.guess }}</div>
        </div>
      </div>
    </div>
  </div>
  <span v-if="!sudokuGameState.isFinished">
    <SudokuGuessBar/>
  </span>
  <span v-else>
    <div class="results-container">
      <div class="next-button-container" v-if="infiniteEnabled">
        <button class="font-medium" onclick="window.location.reload()"> Next Puzzle </button>
      </div>
      <div class="top-results">Possible Answers</div>
      <div class="answers-list">
        <div v-for="(entry, i) in possibleAnswers" :key="i" class="answer-block">
          {{ entry.row['short-desc'] }} + {{ entry.col['short-desc'] }}
          <div class="answer-item">
            <ul><li v-for="track in entry.tracks" :key="track">{{ track }}</li></ul>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<style scoped>
.game-container {
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  .max-w-screen-lg {
    width: 100%;
    height: 100%;

    overflow: auto;
    justify-content: space-between;

    margin-left : auto;
    margin-right : auto;
    flex-direction: column;
  }
}
.guess-container {
  padding: 0.75rem;
  margin-bottom: 10px;
}

.list-text{
  text-align: center;
  padding: 0.75rem;
  align-items: center;
  flex-direction: column;
  display: flex;

  a {
    color: var(--color-link);
  }

  svg{
    margin-top: 0.5rem;
  }
}

.arrow {
  margin-top: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  width: 800px;
  height: 500px;
  margin: 0 auto;

  .cell-guess {
    border: 1px solid var(--color-line);
    font-size: 1.0rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .cell-guess.selected {
    border: 3px solid var(--color-positive);
  }

  .cell-guess.incorrect {
    background-color: #500000;
  }

  .cell-instructions {
    font-size: 1.0rem;
    line-height: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .cell-label {
    font-size: 1.4rem;
    line-height: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
   .cell-label:hover {
    font-size: 1.0rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

.results-container {
  width: 100%;
  text-align: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  font-size: 1.4rem;


  .top-results {
    padding: 1rem;
    min-width: 50%;
    min-height: 3.2rem;
    margin-top: 20px;
    background-color: var(--color-mg);
    line-height: 1.3rem;
  }
}

.answers-list {
  min-width: 50%;
  margin: 20px auto;
  text-align: left;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.answer-block {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-line);
  line-height: 1.3rem;

  .answer-item {
    font-size: 1.0rem;
  }
}

.next-button-container{
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 1rem 0;

  button {
    text-transform: uppercase;

    text-indent: 0.25em;
    letter-spacing: 0.2em;
    font-weight: 10;

    padding: 0.5rem;

    background: var(--color-sudoku);

    border-style: none;

    align-items: center;
    display: flex;

    cursor: pointer;
  }
}


</style>