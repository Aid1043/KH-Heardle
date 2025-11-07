<script setup lang="ts">

import GuessBar from "@/components/GuessBar.vue";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import TransportBar from "@/components/TransportBar.vue";
import GuessField from "@/components/GuessField.vue";
import settings from "@/settings/settings.json";

import { currentGameState, ParseStringWithVariable } from "@/main";

</script>

<template>
  <div class="game-container">
    <div class="max-w-screen-lg">
      <div class="guess-container">
        <template v-for="n in settings['guess-number']">
          <GuessField v-if="currentGameState.guessed[n-1] === undefined" :active="(n === currentGameState.guess+1)"/>
          <GuessField v-else :active="(n===currentGameState.guess+1)" :music="(currentGameState.guessed[n-1])"/>
        </template>
      </div>
    </div>
  </div>
  <!-- <div class="list-text font-medium" v-if="settings['song-list-link'] !== '' && settings['song-list-link'] !== null && settings['song-list-link'] !== undefined" >
    <p>
      <a :href="settings['song-list-link']">
        {{ ParseStringWithVariable(settings["phrases"]["song-list"])  }} <br/>
        <IconArrowDown class="arrow"/>
      </a>
    </p>
  </div> -->
  <TransportBar/>
  <GuessBar/>
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
</style>