<script setup lang="ts">

import MusicLink from "@/components/MusicLink.vue";
import GuessSummary from "@/components/GuessSummary.vue";
import InfiniteButton from "@/components/InfiniteButton.vue";
import { SelectedMusic } from '@/main';
import IconShare from "@/components/icons/IconShare.vue";

import settings from "@/settings/settings.json"

import { currentGameState, ParseStringWithVariable, infiniteEnabled } from "@/main";
import TransportBar from "@/components/TransportBar.vue";
import { ref } from "vue";


// calculate time
setInterval(() => {
  const timer = document.getElementById("timer");
  if (!timer) return;

  const now = new Date();

  const tomorrowUtcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1, // tomorrow
    0, 0, 0, 0
  );

  const diff = tomorrowUtcMidnight - now.getTime();

  if (diff <= 0) {
    window.location.reload();
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timer.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}, 1000);


function goToInfinite() {
  sessionStorage.setItem('infinite', true.toString());
  sessionStorage.setItem('sudoku-mode', false.toString());
  window.location.reload();

}

function goToSudoku() {
  sessionStorage.setItem('sudoku-mode', true.toString());
  window.location.reload();
}

const copied = ref(false);
function copyShare() {
  var copyText = "Today's KH Heed to the Pulse puzzle:\n\n";
  
  for (var i = 0; i < currentGameState.value.guessed.length; i++) {
    const guess = currentGameState.value.guessed[i];
    if (!guess) continue;

    if(guess.name === "Skipped") copyText = copyText.concat("⬛");
    else if(guess.isCorrect) copyText = copyText.concat("🟩");
    else if(guess['equal-to']['tags']['title'] === SelectedMusic.tags['title']) copyText = copyText.concat("🟨");
    else copyText = copyText.concat("🟥");
  }

  copyText = copyText.concat("\n\n#HeedToThePulse\n\nhttps://aid1043.github.io/KH-Heardle/");

  navigator.clipboard.writeText(copyText);

  copied.value = true;
}
</script>

<template>
  <div class="max-w-screen-sm main-container">
    <MusicLink :is-won="currentGameState.guessed[currentGameState.guessed.length-1].isCorrect"/>
    <div class="note-container">
      <p class="second-text">{{ SelectedMusic.tags["arranger"] }} ({{ SelectedMusic.tags['year'] }}).</p>
      <p class="second-text">{{SelectedMusic.note}}</p>
      <p class="second-text">Read more at the <a :href="SelectedMusic.wiki" :title="'Read about ' + SelectedMusic.title + ' on the KHWiki.'" target="_blank">KHWiki</a>.</p>
    </div>
    <div class="summary-container">
      <p class="guess-number font-big"> {{ currentGameState.guessed[currentGameState.guessed.length-1].isCorrect ? currentGameState.guessed.length.toString() : '0' }} </p>
      <GuessSummary class="summary"/>
      <p class="second-text" v-if="currentGameState.guessed[currentGameState.guessed.length-1].isCorrect">
        {{ ParseStringWithVariable((infiniteEnabled ? settings["phrases"]["infinite-win-text"] : settings["phrases"]["default-win-text"])) }}
      </p>
      <p class="second-text" v-else>
        {{ ParseStringWithVariable((infiniteEnabled ? settings["phrases"]["infinite-lose-text"] : settings["phrases"]["default-lose-text"])) }}
      </p>
      <div class="share" v-if="!infiniteEnabled">
        <p class="share-text" v-if="copied">Copied results to clipboard!</p>
        <button @click="copyShare">
          {{ ParseStringWithVariable(settings["phrases"]["share-button"]) }}
          <IconShare class="inline-block ml-2"/>
        </button>
      </div>
    </div>
    <div v-if="!infiniteEnabled">
      <div class="timer-container">
        <div class="next-text font-medium"> {{ ParseStringWithVariable(settings["phrases"]["timer-text"]) }} </div>
        <div id="timer" class="font-big">14:25:42</div>
      </div>
      <div class="infinite-button-container">
        <div class="margin"></div>
          <div class="button-container">
           <div class="button-columns"> 
            <button @click="goToInfinite" style="background: var(--color-button-highlight); border-style: none; cursor: pointer;">Infinite Mode</button>
            <button @click="goToSudoku" style="background: var(--color-sudoku); border-style: none; cursor: pointer;">Sudoku Mode</button>
          </div>
        </div> 
      </div>
    </div>
    <div v-else>
      <div class="next-button-container">
        <button class="font-medium" onclick="window.location.reload()"> {{ ParseStringWithVariable(settings["phrases"]["next-button"]) }} </button>
      </div>
    </div>
  </div>
  <TransportBar/>
</template>

<style scoped>
.main-container{
  display: flex;
  flex-direction: column;

  justify-content: space-between;

  width: 100%;
  height: 100%;

  margin: 0 auto;

  overflow: auto
}

.note-container {
  text-align: center;
  padding: 0 0.75rem;
  background-color: var(--color-highlight);

  .second-text {
    padding: 0.25rem 0;
    line-height: 1.75rem;
  }
}

.summary-container {
  text-align: center;
  padding: 0 0.75rem;

  .guess-number {
    color: var(--color-lg)
  }
  .summary{
    justify-content: center;
    display: flex;
    margin: 0.5rem 0;
  }
  .second-text {
    padding: 0.25rem 0;
    line-height: 1.75rem;
  }

  .share-text {
    padding: 0.25rem 0;
    line-height: 1.75rem;
  }

  .share {
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 0.75rem;

    button {
      display: flex;

      align-items: center;

      padding: 0.5rem;
      text-transform: uppercase;

      text-indent: 0.25em;
      letter-spacing: 0.2em;

      border: none;

      background-color: var(--color-positive);
      cursor: pointer;
    }
  }
}

.infinite-button-container{
  background: var(--color-highlight);
  padding: 0.75rem 0 1.25rem;
  margin: 0 0.75rem;

  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;

  .margin {
    display: flex;
    margin-bottom: 0.75rem;
  }
}

.timer-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 0.75rem 1.5rem;

  .next-text{
    text-align: center;
    color: var(--color-lg);
  }

  #timer {
    text-indent: 0.25em;
    letter-spacing: 0.2em;
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

    background: var(--color-submit);

    border-style: none;

    align-items: center;
    display: flex;

    cursor: pointer;
  }
}

.button-container {
  display: flex;
  justify-content: center;
  
  margin-top: 0.5rem;
  border-style: none;
}

.button-columns {
  display: flex;
  gap: 3rem;
  border-style: none;
}
</style>