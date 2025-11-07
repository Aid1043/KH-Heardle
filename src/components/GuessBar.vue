<script setup lang="ts">

import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconCancel from "@/components/icons/IconCancel.vue";
import FuzzySearch from "fuzzy-search";

import music from "@/settings/music.json"
import settings from "@/settings/settings.json"

import { currentGameState, SelectedMusic, ParseStringWithVariable, infiniteEnabled, saveInfinite } from "@/main";
import {onMounted} from "vue";
import TransportBar from "./TransportBar.vue";

const searcher = new FuzzySearch(music, ["title", "media"], {
  sort: false
});

onMounted(() => {
  document.getElementById("main").onclick = () => {
    const autoCompleteList = document.getElementById('autoComplete_list')
    if(autoCompleteList != null)
      autoCompleteList.setAttribute("hidden", "");
  }
})

function GetAutocomplete(){
  const autoCompleteList = document.getElementById('autoComplete_list');
  const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
  if (!autoCompleteList || !inputEl) return;
  
  autoCompleteList.removeAttribute('hidden');

  // Get allowed filters when in infinite mode
  let allowedStatuses = [];
  let allowedGames = [];
  if (infiniteEnabled.value) {
    try {
      const savedStatuses = localStorage.getItem('allowed-statuses');
      const savedGames = localStorage.getItem('allowed-games');
      allowedStatuses = savedStatuses !== null ? JSON.parse(savedStatuses) : (settings.defaults && settings.defaults["allowed-statuses"]) || [];
      allowedGames = savedGames !== null ? JSON.parse(savedGames) : (settings.defaults && settings.defaults["allowed-games:"]) || [];
    } catch (e) {
      allowedStatuses = (settings.defaults && settings.defaults["allowed-statuses"]) || [];
      allowedGames = (settings.defaults && settings.defaults["allowed-games:"]) || [];
    }
  }

  const result = searcher.search(inputEl.value);
  // Filter by fuzzy search results and both allowed statuses and games in infinite mode
  const ordered = music.filter(m => {
    const matchesSearch = result.includes(m);
    if (!infiniteEnabled.value) {
      const dailyOk = m && m.daily;
      return matchesSearch && dailyOk;
    }
    const statusOk = m && m.status && allowedStatuses.includes(m.status);
    const gameOk = m && m.tags && m.tags.game && allowedGames.includes(m.tags.game);
    return matchesSearch && statusOk && gameOk;
  });

  autoCompleteList.innerHTML = "";

  for(const item of ordered){
    const li = document.createElement("li");
    li.innerHTML = item.title + " | " + item.media;

    li.onclick = ()=>{
      autoCompleteList.setAttribute("hidden", "");
      const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
      if (inputEl) {
        inputEl.value = item.title + " | " + item.media;
        // Keep cursor in box, move to end
        inputEl.focus();
        inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
      }
    }

    autoCompleteList.appendChild(li);
  }
}

function OnSubmit(){
  const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
  if (!inputEl || inputEl.value === undefined || inputEl.value === "") {
    return;
  }

  let equalto = music.find((el)=>{
    return (el.title + " | " + el.media) == inputEl.value;
  })

  currentGameState.value.guessed.push(
      {
        "name": inputEl.value,
        "equal-to": equalto,
        "isCorrect": equalto === (SelectedMusic)
      }
  )

  inputEl.value = ""

  Verify();
}

function OnSkip(){
  currentGameState.value.guessed.push(
      {
        "name": "Skipped",
        "equal-to": undefined,
        "isCorrect": false
      }
  )

  const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
  if (inputEl) inputEl.value = ""

  Verify();
}

function Verify(){
  if(currentGameState.value.guessed[currentGameState.value.guessed.length - 1].isCorrect){
    currentGameState.value.isFinished = true;
    saveInfinite(true);
  } else {
    currentGameState.value.guess += 1;
    if(currentGameState.value.guess >= settings["guess-number"]){
      currentGameState.value.isFinished = true;
      saveInfinite(false);
    }
  }
}
</script>

<template>
  <div class="max-w-screen-sm base-container">
    <div class="container">
      <div>
        <div id="autocomplete-wrapper">
          <IconMagnifyingGlass class="glass"/>
          <input ref="searchinput" class="font-input" id="autoComplete" type="search" dir="ltr" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="none"
                 aria-controls="autoComplete_list_1" aria-autocomplete="both" placeholder="Search for the title or game"
                 role="combobox" aria-owns="autoComplete_list" aria-haspopup="true" aria-expanded="false"
                 @input="GetAutocomplete"
                 @keydown.enter="OnSubmit">
          <ul id="autoComplete_list" role="listbox" hidden=""></ul>
          <div class="close">
            <IconCancel/>
          </div>
        </div>
        <div class="button-container">
          <button class="skip" @click="OnSkip">
            {{ ParseStringWithVariable(settings["phrases"]["skip-button"]) }} <span class="tracking-normal lowercase" v-if="currentGameState.guess < settings['guess-number']-1">(+{{ settings["times"][currentGameState.guess+1] - settings["times"][currentGameState.guess] }}s)</span>
          </button>
          <button class="submit" @click="OnSubmit">
            {{ ParseStringWithVariable(settings["phrases"]["submit-button"]) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-container{
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.container{
  margin: 0 0.75rem 0.75rem;
}

#autocomplete-wrapper{
  position: relative;

  input {
    background: var(--color-bg);
    color: var(--color-fg);
    border-color: var(--color-textbox);

    padding: 0.75rem 0.75rem 0.75rem 2.25rem;

    outline-offset: -2px;

    width: 100%;

    /*focus:outline-none focus:border-custom-positive w-full p-3 pl-9 placeholder:text-custom-line bg-custom-bg text-custom-fg border-custom-mg*/
    &:focus{
      outline: none;
      border-color: var(--color-positive);
    }

    &::placeholder {
      color: var(--color-placeholder);
    }
  }
}

.close {
  position: absolute;
  right: 0.75rem;
  top: 1rem;
}

.glass {
  position: absolute;
  left: 0.75rem;
  top: 1rem;
}

.button-container{
  padding-top: 0.75rem;
  justify-content: space-between;
  display: flex;

  button {
    display: flex;

    padding: 0.5rem;
    text-transform: uppercase;

    letter-spacing: 0.2em;

    border: none;

    align-items: center;
    font-weight: 10;
    line-height: 1.3rem;

    &.skip{
      background: var(--color-mg);
    }
    &.submit{
      background: var(--color-submit);
    }
  }
}

[hidden] {
  display: none;
}

#autoComplete_list {
  border-radius: 4px 4px 0 0;
  top: auto !important;
  bottom: 100% !important;
  z-index: 100;
  font-size: 1.15rem;
  position: absolute;
  background: var(--color-bg);
  width: 100%;
  border: 1px solid var(--color-mg);
  max-height: 500px;
  overflow-y: auto;

  padding: 0;
  margin: 0;

  list-style: none;
}
</style>

<style>
#autoComplete_list li {
  padding: 0.4rem 0.65rem;
  width: 100%;
  border-bottom: 1px solid var(--color-mg);
  letter-spacing: 1px;
  line-height: 1;
}
</style>