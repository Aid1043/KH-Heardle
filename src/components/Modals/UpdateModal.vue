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
    <h1>20 New Songs Added</h1>
      <p>- 9 early arrangements of KH3 songs from the Premium Showcase demo</p>
      <p>- 5 ringtones from Kingdom Hearts Mobile</p>
      <p>- 3 unused versions of songs from KHBBS and KH2.5</p>
      <p>- 3 live recordings from the 2026 Music of Square Enix conerts</p>
    <p class="last">Be sure to check the "Include unused tracks" setting (and the appropriate games) to see these songs in Infinite Mode!</p>
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