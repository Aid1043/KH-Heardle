<script setup lang="ts">

import { ref as refB } from "vue";
import { CURRENT_PUZZLE } from "@/main";
import puzzles from '@/settings/puzzles.json'

import { ref, runTransaction } from "firebase/database";
import { db } from "@/firebase";

const score = getPuzzleScore();
const submitted = refB(getPuzzleSubmitted());

function getPuzzleScore() {
  const savedScore = localStorage.getItem(`puzzleScore-${puzzles[CURRENT_PUZZLE].id}`)
  return savedScore !== null ? JSON.parse(savedScore) : 0;
}
function getPuzzleSubmitted() {
  const savedSubmitted = localStorage.getItem(`puzzleSubmitted-${puzzles[CURRENT_PUZZLE].id}`)
  return savedSubmitted !== null ? JSON.parse(savedSubmitted) : false;
}

function OnSubmit() {
  if (!submitted.value) {
    const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
    if (!inputEl || inputEl.value === undefined || inputEl.value === "" || !isValidUsername(inputEl.value) || score == 0) {
      return;
    }

    runTransaction(ref(db, `puzzleScores/${puzzles[CURRENT_PUZZLE].id}/user-${inputEl.value}`), (currentValue) => {
      return Math.max((currentValue || 0), score);
    });

    submitted.value = true;
    localStorage.setItem(`puzzleSubmitted-${puzzles[CURRENT_PUZZLE].id}`, JSON.stringify(true))
  }
}

function isValidUsername(str) {
  const regex = /^[a-z0-9 ]+$/i;
  return regex.test(str);
}
</script>

<template>
  <div class="max-w-screen-md mx-auto">
    <div class="main-container">
      <div class = "main-row-text-score">
        Score: {{ score }}
      </div>
      <div class = "main-row-text">
        Submit your score here after completing every puzzle!<br/><br/>
        Once the special event is over, the names of the players with the highest scores will be announced. Good luck!
      </div>
      <div class = "main-row-field" v-if="!submitted">
        <input ref="searchinput" class="font-input" id="autoComplete" type="search" dir="ltr" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="none"
                  aria-controls="autoComplete_list_1" aria-autocomplete="both" placeholder="Username (no special characters)"
                  role="combobox" aria-owns="autoComplete_list" aria-haspopup="true" aria-expanded="false"
                  @keydown.enter="OnSubmit">
        <button class="submit" @click="OnSubmit">
          Submit Score
        </button>
      </div>
      <div class = "main-row-text" v-else>
        Your score has been sumbitted!
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  header {
    border-style: solid;
    border-color: var(--color-line);
    border-bottom-width: 1px;
  }

  .main-container {
    color: var(--color-fg);
    padding: 1rem;
  }

  .main-row-text-score {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.7rem;
    line-height: 1.7rem;
  }

  .main-row-text {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    line-height: 1.2rem;
  }

  .main-row-field {
    align-items: center;
    justify-content: space-evenly;
    display: flex;
  }

  .justify-end {
    justify-content: flex-end;
  }

  button {
    display: flex;

    padding: 0.5rem;
    text-transform: uppercase;

    letter-spacing: 0.2em;

    border: none;

    align-items: center;
    font-weight: 10;
    line-height: 1.3rem;

    cursor: pointer;

    &.submit{
      background: var(--color-submit);
    }
  }
</style>
