import './assets/main.css'

import { createApp, ref, watchEffect } from 'vue'
import App from './App.vue'

import settings from '@/settings/settings.json'
import music from '@/settings/music.json'

import sudoku_music from '@/settings/sudoku_music.json'
import sudoku_tags from '@/settings/sudoku_tags.json'


// Create audio players

// Choose music

export function ParseStringWithVariable(string) {
    let nString = "";
    for (let i = 0; i < string.length; i++) {
        if(string[i] === '{'){
            let testStr = string.slice(i, string.length);

            let key = "";
            key = string.slice(i, i+testStr.indexOf("}")).replace("{", "").replace("}", "");

            switch(key) {
                case "heardle-name":
                    nString += settings["heardle-name"];
                    break;
                case "unlocked-time":
                    nString += settings["times"][currentGameState.value.guessed.length-1];
                    break;
                default:
                    nString += key;
                    break;
            }

            i += testStr.indexOf("}");
        }
        else {
            nString += string[i];
        }
    }

    return nString;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000; 
  return x - Math.floor(x);
}

function shuffle(array, seed) {                // <-- ADDED ARGUMENT
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);        // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed                                     // <-- ADDED LINE
  }

  return array;
}

const savedInfinite = sessionStorage.getItem('infinite');
export const infiniteEnabled = ref(savedInfinite !== null ? savedInfinite === 'true' : settings["defaults"]["infinite"]);

const savedCritical = localStorage.getItem('critical');
export const criticalEnabled = ref(savedCritical !== null ? savedCritical === 'true' : settings["defaults"]["critical"]);

// Load random start setting from localStorage, defaults to settings.json
const savedRandomStart = localStorage.getItem('random-start');
export const randomStartEnabled = ref(savedRandomStart !== null ? savedRandomStart === 'true' : settings["defaults"]["random-start"]);

// Watch for changes to random start and save to localStorage
watchEffect(() => {
    localStorage.setItem('random-start', randomStartEnabled.value);
});

export const _currentGameState = ref({
    guess: 0,
    guessed: [],
    isFinished: false,
});

let listIndex = 0;
let id = 0;

// Make shuffledMusic mutable
let shuffledMusic = music.slice();

if (infiniteEnabled.value) {
    // Load filters from localStorage (or use defaults)
    let allowedStatuses = [];
    let allowedGames = [];
    try {
        const savedStatuses = localStorage.getItem('allowed-statuses');
        const savedGames = localStorage.getItem('allowed-games');
        allowedStatuses = savedStatuses !== null ? JSON.parse(savedStatuses) : (settings.defaults && settings.defaults["allowed-statuses"]) || [];
        allowedGames = savedGames !== null ? JSON.parse(savedGames) : (settings.defaults && settings.defaults["allowed-games:"]) || [];
    } catch (e) {
        // localStorage may be unavailable in some environments
        allowedStatuses = (settings.defaults && settings.defaults["allowed-statuses"]) || [];
        allowedGames = (settings.defaults && settings.defaults["allowed-games:"]) || [];
    }

    // Filter music by both status and game
    const filtered = music.filter((m) => {
        const statusOk = m && m.status && allowedStatuses.includes(m.status);
        const gameOk = m && m.tags && m.tags.game && allowedGames.includes(m.tags.game);
        return statusOk && gameOk;
    });

    if (filtered.length === 0) {
        console.warn('Status/game filters returned no tracks; falling back to full music list');
        shuffledMusic = music.slice();
        listIndex = Math.floor(Math.random() * shuffledMusic.length);
    } else {
        shuffledMusic = filtered;
        listIndex = Math.floor(Math.random() * shuffledMusic.length);
    }

} else {
    const filtered = music.filter((m) => {
        const dailyOk = m && m.daily;
        return dailyOk;
    });
    shuffledMusic = filtered;

    const oldestDate = new Date(null);
    const currentDate = new Date();

    id = Math.floor((currentDate.getTime() - oldestDate.getTime()) / 86400000);

    listIndex = id % shuffledMusic.length;

    const usString = localStorage.getItem("userStats");
    if(usString !== null && usString !== ""){
        let stats = JSON.parse(usString);
        let item = stats.find((item)=>{
            return item.id === id;
        })

        if(item !== undefined){
            _currentGameState.value.guess = item.guess;
            _currentGameState.value.guessed = item.guessed;
            _currentGameState.value.isFinished = item.isFinished;
        }
    }

    shuffle(shuffledMusic, Math.floor(id / filtered.length))
}

export const SelectedMusic = shuffledMusic[listIndex];

let startTime = 0
let startTimeFull = SelectedMusic.start ? SelectedMusic.start : 0;

if (!infiniteEnabled.value) {
    startTime = Math.min(13, SelectedMusic.duration - settings["times"][settings["times"].length - 1]);
    startTime = Math.max(0, startTime);

}
else if(randomStartEnabled.value){
    startTime = Math.floor(Math.random() * (SelectedMusic.duration - settings["times"][settings["times"].length - 1]));
    startTime = Math.max(0, startTime);
}

export const StartTime = startTime + startTimeFull;
export const StartTimeFull = startTimeFull;

function save(){
    if(!infiniteEnabled.value){
        const usString = localStorage.getItem("userStats");
        let stats;

        console.log("Set used");
        if(usString === null || usString === ""){
            stats = [];
        } else {
            stats = JSON.parse(usString);
        }

        let item = stats.find((item)=>{
            return item.id === id;
        })

        if(item === undefined){
            stats.push({
                id: id,
                guess: _currentGameState.value.guess,
                guessed: _currentGameState.value.guessed,
                isFinished: _currentGameState.value.isFinished,
            });
        }
        else {
            stats[stats.indexOf(item)] = {
                id: id,
                guess: _currentGameState.value.guess,
                guessed: _currentGameState.value.guessed,
                isFinished: _currentGameState.value.isFinished,
            };
        }

        localStorage.setItem("userStats", JSON.stringify(stats));
    }
}

export function saveInfinite(won){
    if(infiniteEnabled.value){
        const usString = localStorage.getItem("userStatsInfinite");
        let stats;

        if(usString === null || usString === ""){
            stats = {
                gamesPlayed: 0,
                gamesWon: 0,
            };
        } else {
            stats = JSON.parse(usString);
        }

        if(won){
            stats.gamesWon += 1;
        }
        stats.gamesPlayed += 1;

        localStorage.setItem("userStatsInfinite", JSON.stringify(stats));
    }}

export const currentGameState = new Proxy(_currentGameState, {
    get(target, prop, receiver) {
        save();
        return Reflect.get(...arguments);
    },

    set(target, key, value) {
        Object.set(target, key, value);
        save();
    },

    defineProperty(target, key, descriptor) {
        Object.defineProperty(target, key, descriptor);
        save();
    }
})

const savedSudokuMode = sessionStorage.getItem('sudoku-mode');
export const sudokuMode = ref(savedSudokuMode !== null ? savedSudokuMode === 'true' : false);

let seed = 0.0;

// Seeded random
function splitmix32(a) {
    return function() {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}

function weightedShuffle(tags, seed) {
    const rand = splitmix32(seed);

    const itemsWithKeys = tags.map(item => {
        const key = -Math.log(rand()) / item.rarity;
        return { item, key };
    });

    itemsWithKeys.sort((a, b) => a.key - b.key);

    return itemsWithKeys.map(x => x.item);
}

function canFormUnique9(colTags, rowTags) {
    const overlapGrid = [];

    for (let r = 0; r < 3; r++) {
        overlapGrid[r] = [];
        for (let c = 0; c < 3; c++) {
            const songsR = new Set(sudoku_music[rowTags[r].tag]);
            const songsC = new Set(sudoku_music[colTags[c].tag]);
            const overlap = [...songsR].filter(s => songsC.has(s));
            if (overlap.length < 2) return false; // Minimum options per cell
            overlapGrid[r][c] = overlap;
        }
    }

    // Recursion (yay) to test for unique solutions
    function assignUniqueSongs(r, c, used) {
        if (r === 3) return true;
            const nextR = c===2 ? r+1 : r;
            const nextC = c===2 ? 0 : c+1;

        for (const song of overlapGrid[r][c]) {
            if (!used.has(song)) {
                used.add(song);
                if (assignUniqueSongs(nextR, nextC, used)) return true;
                used.delete(song);
            }
        }
        return false;
    }

    return assignUniqueSongs(0,0,new Set());
}

function generateBoard() {
    // Seed based on current date
    if (!infiniteEnabled.value) { //!infiniteEnabled.value
        const oldestDate = new Date(null);
        const currentDate = new Date();
        seed = Math.floor((currentDate.getTime() - oldestDate.getTime()) / 86400000);
    }
    else {
        seed = Math.floor(Math.random() * 1000000000);
    }
    const shuffledTags = weightedShuffle(sudoku_tags, seed);

    // Try first 3 as columns
    for (let cStart=0; cStart<=shuffledTags.length-3; cStart++) {
        const colTags = shuffledTags.slice(cStart, cStart+3);

        // Remaining tags for rows, in weighted order
        const remaining = shuffledTags.filter(t => !colTags.includes(t));

        for (let rStart=0; rStart<=remaining.length-3; rStart++) {
            const rowTags = remaining.slice(rStart, rStart+3);

            if (canFormUnique9(colTags,rowTags)) {
                return [...colTags, ...rowTags];
            }
        }
    }

    return null;
}

export const sudokuBoard = generateBoard();

export const _sudokuGameState = ref({
    guess: 1,
    guessed: [],
    correct: [null, true, true, true, true, true, true, true, true, true],
    activeCell: -1,
    isFinished: false,
    isWon: false,
});

export const sudokuGameState = new Proxy(_sudokuGameState, {
    get(target, prop, receiver) {
        sudokuSave();
        return Reflect.get(...arguments);
    },

    set(target, key, value) {
        Object.set(target, key, value);
        sudokuSave();
    },

    defineProperty(target, key, descriptor) {
        Object.defineProperty(target, key, descriptor);
        sudokuSave();
    }
})

function sudokuSave(){
    const ssString = localStorage.getItem("sudokuStats");
    let stats;

    if(ssString === null || ssString === ""){
        stats = [];
    } else {
        stats = JSON.parse(ssString);
    }

    let item = stats.find((item)=>{
        return item.seed === seed;
    })

    if(item === undefined){
        stats.push({
            seed: seed,
            guess: _sudokuGameState.value.guess,
            guessed: _sudokuGameState.value.guessed,
            correct: _sudokuGameState.value.correct,
            isFinished: _sudokuGameState.value.isFinished,
            isWon: _sudokuGameState.value.isWon,
        });
    }
    else {
        stats[stats.indexOf(item)] = {
            seed: seed,
            guess: _sudokuGameState.value.guess,
            guessed: _sudokuGameState.value.guessed,
            correct: _sudokuGameState.value.correct,
            isFinished: _sudokuGameState.value.isFinished,
            isWon: _sudokuGameState.value.isWon,
        };
    }

    localStorage.setItem("sudokuStats", JSON.stringify(stats));
}

const ssString = localStorage.getItem("sudokuStats");
if(ssString !== null && ssString !== ""){
    let stats = JSON.parse(ssString);
    let item = stats.find((item)=>{
        return item.seed === seed;
    })

    if(item !== undefined){
        _sudokuGameState.value.guess = item.guess;
        _sudokuGameState.value.guessed = item.guessed;
        _sudokuGameState.value.correct = item.correct;
        _sudokuGameState.value.isFinished = item.isFinished;
        _sudokuGameState.value.isWon = item.isWon;
    }
}

const app = createApp(App);
app.mount('#app')

