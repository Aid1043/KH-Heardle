<script setup lang="ts">
import {onMounted} from "vue";

onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "About";
})
</script>

<template>
  <p><i>Kingdom Hearts Heed to the Pulse</i> is a music guessing game based on the web game Heardle and the community game Melody of Madness.</p>
  <p>Created by <a href="https://bsky.app/profile/aid1043.bsky.social/">Aid1043</a>. Core functionality forked from s4pph1r3's <a href="https://github.com/s4pph1r3-dev/Heardle-Base/">Heardle Base</a>.</p>
  <p>The game supports over 1000 arrangements! The full list of songs is available <a href="https://docs.google.com/spreadsheets/d/1vv1SczYhINmpU6yi6cfgfJ7NmMAyLy9UvaU_z4rINb0">here.</a> </p>
  <p><br></br>Reading the hints:</p>
  <div class="hint-container">
    <div class="hint-item">
      <div class="label">Title: </div>
      <div class="text">Compares the base track with no number or subtitle.</div>
    </div>
    <div class="hint-item">
      <div class="label">Game: </div>
      <div class="text">FM and Re Mind are grouped with the original release.</div>
    </div>
    <div class="hint-item">
      <div class="label">Year: </div>
      <div class="text">FM and Re Mind use their own release dates. Live service games use the initial launch date; KHUX is split pre-/post-rebranding.</div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin-bottom: 0.75rem;
}

.hint-container {
  margin-top: 0.5rem;
  margin-left: 1rem;
}

.hint-item {
  display: flex;
  margin-bottom: 0.5rem;
  
  .label {
    font-weight: bold;
    margin-right: 0.5rem;
    width: 3.5rem;
    text-align: right;
  }
  .text {
    flex: 1;
  }
}
</style>