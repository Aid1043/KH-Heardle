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
    <h1>Special Event</h1>
    <p>A limited-time challenge mode has been added to celebrate <a href="https://www.marchcaprice.com/">March Caprice 6</a>!</p>
    <p>Play a curated set of puzzles and compete for a high score! The top scorers will have their names shown here after the event is over.</p>
    <p class="last">More information can be found by clicking the new <b>event icon</b> in the top left. Good luck!</p>
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