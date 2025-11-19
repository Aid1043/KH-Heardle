<script setup lang="ts">

import IconMagnifyingGlass from "@/components/icons/IconMagnifyingGlass.vue";
import IconCancel from "@/components/icons/IconCancel.vue";
import FuzzySearch from "fuzzy-search";

import music from "@/settings/music.json"
import sudoku_music from "@/settings/sudoku_music.json"
import settings from "@/settings/settings.json"

import { sudokuGameState, ParseStringWithVariable, sudokuBoard} from "@/main";
import {onMounted} from "vue";
import TransportBar from "./TransportBar.vue";

onMounted(() => {
  document.getElementById("main").onclick = () => {
    const autoCompleteList = document.getElementById('autoComplete_list')
    if(autoCompleteList != null)
      autoCompleteList.setAttribute("hidden", "");
  }
})

function stripDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const normalizedList = sudoku_music['all'].map(s => ({
  original: s,
  normalized: stripDiacritics(s)
}));

const searcher = new FuzzySearch(normalizedList, ['normalized'], {
  sort: false
});

function GetAutocomplete(){
  const autoCompleteList = document.getElementById('autoComplete_list');
  const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
  if (!autoCompleteList || !inputEl) return;
  
  autoCompleteList.removeAttribute('hidden');
  const query = stripDiacritics(inputEl.value);
  const result = searcher.search(query);
  const ordered = sudoku_music['all'].filter(s => {
    return result.some(r => r.original === s);
  });

  autoCompleteList.innerHTML = "";

  for(const item of ordered){
    const li = document.createElement("li");
    li.innerHTML = item;

    li.onclick = ()=>{
      autoCompleteList.setAttribute("hidden", "");
      const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
      if (inputEl) {
        inputEl.value = item;
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

  sudokuGameState.value.guessed[sudokuGameState.value.activeCell] = inputEl.value;

  inputEl.value = ""
}

function Verify() {
  let won = true;

  for (let i = 1; i < 10; i++) {
    const guess = sudokuGameState.value.guessed[i];
    const col = (i-1) % 3;
    const row = i < 4 ? 3 : (i < 7 ? 4 : 5);
    if (sudoku_music[sudokuBoard[col].tag].includes(guess) && sudoku_music[sudokuBoard[row].tag].includes(guess)) {
        sudokuGameState.value.correct[i] = true;
    }
    else {
      sudokuGameState.value.correct[i] = false;
      won = false;
    }
  }

  for (let i = 1; i < 9; i++) {
    for (let j = i + 1; j < 10; j++) {
      if (sudokuGameState.value.guessed[i] === sudokuGameState.value.guessed[j]) {
        sudokuGameState.value.correct[i] = false;
        sudokuGameState.value.correct[j] = false;
        won = false;
      }
    }
  }

  if(won) {
    sudokuGameState.value.isFinished = true;
    sudokuGameState.value.isWon = true;
  }
  else {
    sudokuGameState.value.guess += 1;
    if(sudokuGameState.value.guess > settings["sudoku-guess-number"]){
      sudokuGameState.value.isFinished = true;
      sudokuGameState.value.isWon = false;
    }
  }
}

function ClearText(){
  const inputEl = document.getElementById("autoComplete") as HTMLInputElement;
  const autoCompleteList = document.getElementById("autoComplete_list");

  if (inputEl) {
    inputEl.value = "";
    inputEl.focus();
  }

  if (autoCompleteList) {
    autoCompleteList.setAttribute("hidden", "");
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
                 aria-controls="autoComplete_list_1" aria-autocomplete="both" placeholder="Select a cell, then search for the title"
                 role="combobox" aria-owns="autoComplete_list" aria-haspopup="true" aria-expanded="false"
                 @input="GetAutocomplete"
                 @keydown.enter="OnSubmit">
          <ul id="autoComplete_list" role="listbox" hidden=""></ul>
          <div class="close" @click="ClearText">
            <IconCancel/>
          </div>
        </div>
        <div class="button-container">
          <button class="check" @click="Verify">
            {{ ParseStringWithVariable(settings["phrases"]["sudoku-submit-button"]) }}
          </button> 
          <button class="submit" @click="OnSubmit">
            {{ ParseStringWithVariable(settings["phrases"]["sudoku-enter-button"]) }}
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
  cursor: pointer;
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

    cursor: pointer;

    &.check{
      background: var(--color-sudoku);
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