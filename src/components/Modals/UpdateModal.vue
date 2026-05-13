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
    <p>The first ever special event has now concluded! Thank you so much for playing.</p>
    <p class="last">The winners can be found in the <b>event icon</b> in the top left. Stay tuned for future challenges!</p>
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