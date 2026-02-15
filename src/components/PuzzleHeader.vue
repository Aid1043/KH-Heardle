<script setup lang="ts">

import { CURRENT_PUZZLE, puzzleSeed, puzzleQ } from "@/main";
import puzzles from '@/settings/puzzles.json'

var currentHeader = (puzzleSeed + 1) + " / " + puzzles[CURRENT_PUZZLE].length
if (puzzleQ.type == "Submit") {
  currentHeader = "Submit Score"
}

const message = puzzleQ.message ? puzzleQ.message : null;

</script>

<template>
  <div class="max-w-screen-md mx-auto">
    <div class="main-container">
      <h1 class="font-medium">
        {{puzzles[CURRENT_PUZZLE].title}}: 
        {{currentHeader}}
        <span v-if="message != null">
          <br/>{{ message }}
        </span>
      </h1>
    </div>
  </div>
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
    padding: 1rem;
    align-items: center;
  }

  h1 {
    width: fit-content;
    min-height: 3rem;
    padding: 0.75rem;

    font-weight: 10;
    font-size: 2rem;
    line-height: 2rem;
    text-align: center;
    flex: 1 1 0%;
    color: black;
    
    background: var(--color-puzzle);
    border-style: none;
    border-radius: 15px;
  }

  .justify-end {
    justify-content: flex-end;
  }
</style>