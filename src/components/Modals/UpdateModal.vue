<script setup lang="ts">

import IconMusicNote from "@/components/icons/iconMusicNote.vue";
import IconSpeaker from "@/components/icons/IconSpeaker.vue";
import IconHeart from "@/components/icons/IconHeart.vue";
import {onMounted} from "vue";
import IconThumbUp from "../icons/IconThumbUp.vue";

onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "Update";
})

</script>

<template>
  <div class="update-content">
    <h1>Seeded Games</h1>
    <p>A "Seeded Link" button has appeared in the options menu in both modes! Click it to generate a fixed batch of puzzles that you can play together with friends.</p>
    <h1>Share Specific Puzzles</h1>
    <p>Find a particularly cool puzzle in Infinite Mode? Now you can get a permanent link to share it!</p>
    <h1>Sudoku Difficulty</h1>
    <p class="last">Difficulty select has been added to Sudoku Mode! Play on Beginner to ensure plenty of possible answers or try the unbalanced Critical mode.</p>
  </div>
</template>

<style scoped>
  .update-content {
    text-align: center;
  }

  p {
    margin-bottom: 2rem;
    font-size: 1.4rem;
    line-height: 1.4rem;
  }
  .last {
    margin-bottom: 0.5rem;
  }

  h1 {
    margin-bottom: 1rem;
  }
</style>