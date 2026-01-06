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
    <h1>New Menu Layout</h1>
    <p>A much-requested navigation menu has been added to the top right! The settings and tutorial buttons have moved around to make the layout more intuitive.</p>
    <h1>Sudoku Fixes</h1>
    <p class="last">The database has been updated with a bunch of small tweaks for songs that didn't have all of the right categories.</p>
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
    line-height: 2rem;
  }
</style>