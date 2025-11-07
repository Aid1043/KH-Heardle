<script setup lang="ts">
import {onMounted, ref} from "vue";
import settings from "@/settings/settings.json"
import IconInfinite from "@/components/icons/IconInfinite.vue";
import InfiniteButton from "@/components/InfiniteButton.vue";
import { randomStartEnabled, infiniteEnabled } from '@/main';

// Load settings from localStorage or fall back to defaults
const savedAllowed = localStorage.getItem('allowed-statuses');
const allowedStatuses = savedAllowed !== null ? JSON.parse(savedAllowed) : settings.defaults["allowed-statuses"] || [];

const savedGames = localStorage.getItem('allowed-games');
const allowedGames = savedGames !== null ? JSON.parse(savedGames) : settings.defaults["allowed-games:"] || [];

// Status toggles
const allowOst = ref(allowedStatuses.includes('ost'));
const allowIngame = ref(allowedStatuses.includes('ingame'));
const allowUnreleased = ref(allowedStatuses.includes('unreleased'));
const allowUnnamed = ref(allowedStatuses.includes('unnamed'));
const allowUnused = ref(allowedStatuses.includes('unused'));

// Game toggles - including additional ones
const gameToggles = ref({
  KH: allowedGames.includes('KH'),
  KHCOM: allowedGames.includes('KHCOM'),
  KHRECOM: allowedGames.includes('KHRECOM'),
  KHII: allowedGames.includes('KHII'),
  KHD: allowedGames.includes('KHD'),
  KHM: allowedGames.includes('KHM'),
  KHC: allowedGames.includes('KHC'),
  KHREC: allowedGames.includes('KHREC'),
  KHBBS: allowedGames.includes('KHBBS'),
  KH3D: allowedGames.includes('KH3D'),
  KHX: allowedGames.includes('KHX'),
  KHUX: allowedGames.includes('KHUX'),
  KHXBC: allowedGames.includes('KHXBC'),
  'KH0.2': allowedGames.includes('KH0.2'),
  KHIII: allowedGames.includes('KHIII'),
  KHMOM: allowedGames.includes('KHMOM'),
  KHIV: allowedGames.includes('KHIV'),
  KHML: allowedGames.includes('KHML'),
  'KHHD1.5': allowedGames.includes('KHHD1.5'),
  'KHHD2.5': allowedGames.includes('KHHD2.5'),
  KHVC: allowedGames.includes('KHVC'),
  'Concerts/Albums': allowedGames.includes('Concerts/Albums'),
  Other: allowedGames.includes('Other'),
});

const checkAll = ref(false);

function toggleAllGames() {
  Object.keys(gameToggles.value).forEach(key => {
    gameToggles.value[key] = checkAll.value;
  });
}

function applySettings() {
  // Collect allowed statuses
  const newAllowed = [] as string[];
  if (allowOst.value) newAllowed.push('ost');
  if (allowIngame.value) newAllowed.push('ingame');
  if (allowUnreleased.value) newAllowed.push('unreleased');
  if (allowUnnamed.value) newAllowed.push('unnamed');
  if (allowUnused.value) newAllowed.push('unused');
  localStorage.setItem('allowed-statuses', JSON.stringify(newAllowed));

  // Collect allowed games
  const newGames = Object.entries(gameToggles.value)
    .filter(([_, enabled]) => enabled)
    .map(([game]) => game);
  localStorage.setItem('allowed-games', JSON.stringify(newGames));

  // Reload so the new settings take effect across the app
  window.location.reload();
}

onMounted(()=>{
  document.getElementById("modal-title").innerHTML = "Settings";
})
</script>

<template>
  <div v-if="infiniteEnabled">
    <div class="settings-container">
      <div class="settings-content">
        <div class="setting-item">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <label><input type="checkbox" v-model="randomStartEnabled"/> {{ settings.phrases["random-start"] }}</label>
          </div>
        </div>
        <div class="setting-item">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <div class="difficulty-container">
              <!-- <label><input type="checkbox" v-model="allowOst" /> {{ settings.phrases["allow-ost"] }}</label> -->
              <label><input type="checkbox" v-model="allowIngame" /> {{ settings.phrases["allow-ingame"] }}</label>
              <label><input type="checkbox" v-model="allowUnreleased" /> {{ settings.phrases["allow-unreleased"] }}</label>
              <label><input type="checkbox" v-model="allowUnnamed" /> {{ settings.phrases["allow-unnamed"] }}</label>
              <label><input type="checkbox" v-model="allowUnused" /> {{ settings.phrases["allow-unused"] }}</label>
            </div> 
          </div>
        </div>
        <div class="setting-item:last-child">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <div class="games-grid">
              <!-- Column 1 -->
              <label><input type="checkbox" v-model="gameToggles.KH" /> KH</label>
              <label><input type="checkbox" v-model="gameToggles.KHCOM" /> CoM</label>
              <label><input type="checkbox" v-model="gameToggles.KHRECOM" /> Re:CoM</label>
              <label><input type="checkbox" v-model="gameToggles.KHII" /> KHII</label>
              <label><input type="checkbox" v-model="gameToggles.KHD" /> Days</label>
              <!-- Column 2 -->
              <label><input type="checkbox" v-model="gameToggles.KHM" /> Mobile</label>
              <label><input type="checkbox" v-model="gameToggles.KHC" /> coded</label>
              <label><input type="checkbox" v-model="gameToggles.KHREC" /> Re:coded</label>
              <label><input type="checkbox" v-model="gameToggles.KHBBS" /> BBS</label>
              <label><input type="checkbox" v-model="gameToggles.KH3D" /> DDD</label>
              <!-- Column 3 -->
              <label><input type="checkbox" v-model="gameToggles['KH0.2']" /> 0.2</label>
              <label><input type="checkbox" v-model="gameToggles.KHX" /> KHX</label>
              <label><input type="checkbox" v-model="gameToggles.KHUX" /> KHUX</label>
              <label><input type="checkbox" v-model="gameToggles.KHXBC" /> Back Cover</label>
              <label><input type="checkbox" v-model="gameToggles.KHIII" /> KHIII</label>
              <!-- Column 4 -->
              <label><input type="checkbox" v-model="gameToggles.KHMOM" /> MelMem</label>
              <label><input type="checkbox" v-model="gameToggles.KHML" /> Missing-Link</label>
              <label><input type="checkbox" v-model="gameToggles.KHIV" /> KHIV</label>
              <label><input type="checkbox" v-model="gameToggles['KHHD1.5']" /> HD 1.5</label>
              <label><input type="checkbox" v-model="gameToggles['KHHD2.5']" /> HD 2.5</label>
              <!-- Column 5 -->
              <label><input type="checkbox" v-model="gameToggles.KHVC" /> V CAST</label>
              <label><input type="checkbox" v-model="gameToggles['Concerts/Albums']" /> Concerts/Albums</label>
              <label><input type="checkbox" v-model="gameToggles.Other" /> Other</label>
               <p></p>
               <label><input type="checkbox" v-model="checkAll" @change="toggleAllGames" /> Select All</label>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-footer">
        <button class="apply-button" @click="applySettings">
          Apply
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="settings-container">
      <div class="settings-content">
        <div class="setting-item">
          <strong>Settings are disabled for the Daily Challenge.</strong>
          <p><br></br>The Daily Challenge plays from the 13 second mark. It uses a curated list of tracks that includes every game and concert but excludes the HD ReMIX albums and most unreleased or unnamed arrangements.</p>
          <p><br></br>In Infinite Mode, you can change the start time and filter by game and release status.</p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.settings-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-content {
  flex-grow: 1;
}

.setting-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-line);
}

.setting-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.settings-footer {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.apply-button {
  background: var(--color-submit);
  color: var(--color-fg);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.apply-button:hover {
  opacity: 0.9;
}

.infinite-container {
  padding: 1.5rem;
}

.difficulty-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.games-grid {
  font-size: 0.875rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: column;
  grid-auto-rows: min-content;
  grid-template-rows: repeat(5, min-content);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(12, min-content);
  }
}
</style>