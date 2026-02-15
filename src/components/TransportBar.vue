<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import IconPlay from "@/components/icons/IconPlay.vue";
import IconVolume from "@/components/icons/IconVolume.vue";
import IconPlaying from "@/components/icons/IconPlaying.vue";

import settings from "@/settings/settings.json"
import {SoundcloudPlayer} from "@/players/SoundcloudPlayer";
import {YoutubeMusicPlayer} from "@/players/YoutubePlayer";

import {currentGameState, SelectedMusic, StartTime, StartTimeFull, criticalEnabled, infiniteEnabled, volume} from "@/main"
import {Player} from "@/players/PlayerBase";

const isPlaying = ref(false);
const criticalPlayed = ref(0);

let player: Player;

let isFinished = ref(false);

let lengthInSecond = ref(0);

let muted = ref(false);

let seekBarInterval = setInterval(() => {
  const sb = document.getElementById('seekbar');
  const item1 = document.getElementsByClassName('item1')[0];

  if(isPlaying.value){
    let percentage = 0;
    if(isFinished.value){
      // player.GetCurrentMusicLength((n: number)=>{
      //   let duration = n;
        
        player.GetCurrentMusicTime((n2: number)=>{
          n2 -= StartTimeFull*1000;
          percentage = n2 / (SelectedMusic.duration*1000);

          sb.style.width = (percentage*100) + "%";

          item1.innerHTML = Math.floor((n2/1000)/60).toString() + ':' + Math.round(Math.floor(n2/1000)%60).toString().padStart(2, "0");
        })
      // });
    } else {
      player.GetCurrentMusicTime((n2: number)=>{
        percentage = (n2 - StartTime*1000)  / ((settings["times"][currentGameState.value.guess] / (infiniteEnabled.value && criticalEnabled.value ? 2 : 1))*1000);

        sb.style.width = (percentage*100) + "%";

        item1.innerHTML = Math.floor((n2/1000 - StartTime)/60).toString() + ':' + Math.round(Math.floor(n2/1000 - StartTime)%60).toString().padStart(2, "0");
      });
    }

  } else {
    sb.style.width = '0%';
  }
}, 20);

let sepSelectInterval = setInterval(() => {
  if(!isFinished){
    const bar = document.getElementById("bar");
    for(let i = 0; i < bar.children.length; i++){
      const child = bar.children[i+1];
      if(child !== undefined)
      child.classList.remove("sep-selected");
      if(i === currentGameState.value.guess){
        child.classList.add("sep-selected");
      }
    }
  }
}, 30);

onMounted(()=>{
  if(SelectedMusic.url.indexOf("soundcloud.com") !== -1)
    player = new SoundcloudPlayer(SelectedMusic.url);
  else if (SelectedMusic.url.indexOf("youtube.com") !== -1)
    player = new YoutubeMusicPlayer(SelectedMusic.url, "video-player");

  isFinished.value = currentGameState.value.isFinished;

  if(!currentGameState.value.isFinished) {

    const bar = document.getElementById("bar");

    const lastChild = bar.lastChild;
    bar.removeChild(lastChild);

    for(let i = 0; i < settings["guess-number"]; i++){
      const el = document.createElement("div");
      el.classList.add("separator");
      if(i == 0) {
        el.classList.add("sep-selected");
      }
      el.style.setProperty("left", settings["separator"][i] + "%");
      bar.appendChild(el);
    }
    

    bar.appendChild(lastChild);
  }
  else {
    ButtonClick();
  }

  player.GetCurrentMusicLength((n: number)=>{
    lengthInSecond.value = Math.round(n/1000);
  })

  setInitialVolume(volume.value);
})

onUnmounted(()=>{
  sessionStorage.setItem('volume', JSON.stringify(volume.value));
  clearInterval(seekBarInterval);
  clearInterval(sepSelectInterval);
  Stop();
  player.Destroy();
})

function ButtonClick(){
  if(isPlaying.value) Stop()
  else if (!infiniteEnabled.value || !criticalEnabled.value || criticalPlayed.value <= currentGameState.value.guess) Play()
}

function Play(){
  const button = document.getElementById("play-button");
  const icon = document.getElementById("icon");

  console.log(SelectedMusic.title);

  isPlaying.value = true;

  if(currentGameState.value.isFinished){
    // player.PlayMusicUntilEnd(null, null);

    player.PlayMusic(StartTimeFull, SelectedMusic.duration, null, ()=>{
      Stop();
    });

  } else {
    player.PlayMusic(StartTime, settings["times"][currentGameState.value.guess] / (infiniteEnabled.value && criticalEnabled.value ? 2 : 1), null, ()=>{
      Stop();
    });
  }

  icon.classList.add("playing");

}

function Stop(){
  const button = document.getElementById("play-button");
  const icon = document.getElementById("icon");

  isPlaying.value = false;

  player.StopMusic(StartTime);

  icon.classList.remove("playing");

  if (infiniteEnabled.value && criticalEnabled.value)
    criticalPlayed.value += 1;
}

function getUnlockedBarWidth() : number{
  if(currentGameState.value.isFinished) return 100;
  return settings.separator[currentGameState.value.guess];
}

function changeVolume(e: InputEvent){
  player.SetVolume(e.target.value);
  muted.value = false;

  if(e.target.value <= 0){
    muted.value = true;
  }

  volume.value = e.target.value;
}

function setInitialVolume(targetVolume){
  player.SetVolume(targetVolume);
  muted.value = false;

  if(targetVolume <= 0){
    muted.value = true;
  }

  volume.value = targetVolume;
}

function mute(){
  if(muted.value){
    muted.value = false;
    player.SetVolume(volume.value);
    document.getElementById("slider").value = volume.value;
  } else {
    muted.value = true;
    player.SetVolume(0);
    document.getElementById("slider").value = 0;
  }
}

</script>

<template>
  <!-- PlayBar -->
  <div class="playbar">
    <div class="max-w-screen-sm bar-grid-container">
      <div class="bar-grid">
        <div id="unlocked-bar" :style="'width: ' + getUnlockedBarWidth() + '%'">
          <div id="seekbar"></div>
        </div>
        <div id="bar">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Button -->
  <div class="transport">
    <div class="max-w-screen-sm">
      <div class="transport-container">
        <div class="container with-volume">
          <div class="item1" v-if="!isPlaying">0:00</div>
          <div class="item1" v-else> </div>
          <div class="item2">
            <button @click="mute">
              <IconVolume :muted="muted"/>
            </button>
            <div class="volume-control">
              <input id="slider" type="range" min="0" max="100" :value="volume" name="volume" @input="changeVolume">
            </div>
          </div>
          <div class="item3">
            <button id="play-button" @click="ButtonClick" :class="{ 'not-allowed': criticalPlayed > currentGameState.guess }">
              <div class="border">
                <div id="icon">
                  <IconPlay v-if="!isPlaying"/>
                  <IconPlaying v-else/>
                </div>
              </div>
            </button>
          </div>
          <div class="item4" v-if="!isFinished">{{ Math.floor((settings["times"][settings["guess-number"]-1] / (infiniteEnabled && criticalEnabled ? 2 : 1))/60).toString() + ':' + ((settings["times"][settings["guess-number"]-1] / (infiniteEnabled && criticalEnabled ? 2 : 1))%60).toString().padStart(2, "0") }}</div>
          <!-- <div class="item4" v-else>{{ Math.floor(lengthInSecond / 60).toString()  + ':' + (lengthInSecond%60).toString().padStart(2, "0") }}</div> -->
          <div class="item4" v-else>{{ Math.floor(SelectedMusic.duration / 60).toString()  + ':' + (SelectedMusic.duration%60).toString().padStart(2, "0") }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.playbar {
  border-color: var(--color-line);
  border-top-width: 1px;
}

#seekbar {
  background-color: var(--color-positive);
  height: 100%;
  position: absolute;
}

.bar-grid-container {
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  width: 100%;
  margin-left: auto;
  margin-right: auto;

  .bar-grid{
    overflow: hidden;
    width: 100%;
    height: 0.75rem;
    position: relative;

    #unlocked-bar{
      background-color: var(--color-mg);
      overflow: hidden;
      height: 100%;
      position: absolute;
    }

    #bar {
      width: 100%;
      height: 100%;
      position: absolute;

      :first-child {
        background-color: var(--color-line);
        width: 1px;
        height: 100%;
        right: 0px;

        position: absolute;
      }

      :last-child{
        background-color: var(--color-mg);
        width: 1px;
        height: 100%;
        right: 0px;

        position: absolute;
      }
    }
  }
}

.transport{
  border-color: var(--color-line);
  border-top-width: 1px;

  width: 100%;

  .max-w-screen-sm{
    margin-left: auto;
    margin-right: auto;
  }

  .transport-container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

.container.with-volume {
  grid-template-columns: 3fr 4fr 7fr 7fr;
}

.container {
  display: grid;
  grid-template-columns: 3fr 4fr 7fr 7fr;
  gap: 10px;
  align-items: center;
}

.item1 {
  align-items: center;
  display: flex;
}
.item2 {
  display: flex;
  align-items: center;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    border: none;

    padding: 0;
    margin-bottom: 0;
  }

  .volume-control{
    width: 100px;
    position: relative;


    #slider{
      height: 10px;
      background-color: grey;
      border-radius: 2px;
      border: none;
      width: 100px;

      accent-color: var(--color-fg);

      padding: 0;
      margin: 0;

      &::-moz-range-thumb, &::-webkit-slider-thumb/*, &::-ms-thumb*/ {
        padding: 0;
        margin: 0;

        background-color: var(--color-fg);
      }

      &::-moz-range-progress/*, &::-ms-fill*/{
        background-color: var(--color-fg);
        padding: 0;
        margin: 0;

        height: 100%;
      }


    }
  }
}
.item3 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  justify-self: center;
}
.item4{
  justify-self: right;
}

#play-button{
  padding: 0.5rem;
  text-transform: uppercase;

  text-indent: 0.25em;
  letter-spacing: 0.2em;

  font-weight: 10;

  font-size: 1.75rem;
  line-height: 1.3rem;

  border-style: none;

  align-items: center;
  display: flex;

  cursor: pointer;

  .border {
    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--color-fg);

    height: 3.5rem;
    width: 3.5rem;

    border-width: 2px;

    border-radius: 9999px;

    position: relative;

    overflow: hidden;

    #icon{
      margin-right: 0.65rem;
      z-index: 10;
      position: relative;

      &.playing{
        transform: scale(1.5);
        margin-right: 0rem !important;
      }
      &:not(.playing){
        width: 24px;
        height: 24px;
      }
    }
  }
}

#play-button.not-allowed:active {
  background-color: var(--color-negative);
}

</style>

<style>
.separator {
  background-color: var(--color-mg);
  width: 1px;
  height: 100%;
  position: absolute;
}

.sep-selected{
  background-color: var(--color-line);
}
</style>