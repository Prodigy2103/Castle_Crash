import { Level } from "../models/level.class.js";
import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { IntervalHub } from "./intervalhub.class.js";
import { ImgHelper } from "./imghelper.js";

const KEY_MAP = {
    Space: "SPACE",
    ArrowUp: "UP",
    ArrowDown: "DOWN"
};

let activeWorld = null;
const keyboard = new Keyboard();
let selectedCharacterKey = "character1";
let selectedAreaIndex = 0;

function updateKeyState(keyboard, event, isPressed) {
    const mappedKey = KEY_MAP[event.code];
    if (!mappedKey) {
        return;
    }
    if (["Space", "ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
    }
    keyboard[mappedKey] = isPressed;
}

function bindKeyboardEvents(keyboard) {
    window.addEventListener("keydown", (event) => {
        updateKeyState(keyboard, event, true);
    });
    window.addEventListener("keyup", (event) => {
        updateKeyState(keyboard, event, false);
    });
}

function startGame() {
    const canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        return;
    }
    activeWorld?.destroy();
    IntervalHub.isPaused = false;
    resetHud();
    document.getElementById("hudBar")?.classList.remove("hidden");
    document.getElementById("endOverlay")?.classList.add("hidden");
    const level = new Level(Level.createBackgrounds(selectedAreaIndex));
    activeWorld = new World(canvas, level, keyboard, selectedCharacterKey, showEndScreen);
}

function initMenu() {
    bindKeyboardEvents(keyboard);
    bindPauseControls();
    const startButton = document.getElementById("startButton");
    const startScreen = document.getElementById("startScreen");
    const restartButton = document.getElementById("restartButton");
    startButton?.addEventListener("click", () => {
        startScreen?.classList.add("hidden");
        startGame();
    });
    restartButton?.addEventListener("click", startGame);
    renderCharacterSelector();
    renderLevelSelector();
    document.getElementById("menuButton")?.addEventListener("click", returnToMenu);
}

function returnToMenu() {
    activeWorld?.destroy();
    document.getElementById("endOverlay")?.classList.add("hidden");
    document.getElementById("hudBar")?.classList.add("hidden");
    document.getElementById("startScreen")?.classList.remove("hidden");
}

function bindPauseControls() {
    const pauseButton = document.getElementById("pauseButton");
    const resumeButton = document.getElementById("resumeButton");
    const pauseOverlay = document.getElementById("pauseOverlay");
    pauseButton?.addEventListener("click", () => {
        IntervalHub.isPaused = true;
        pauseOverlay?.classList.remove("hidden");
    });
    resumeButton?.addEventListener("click", () => {
        IntervalHub.isPaused = false;
        pauseOverlay?.classList.add("hidden");
    });
}

function resetHud() {
    const coinElement = document.getElementById("coinCount");
    const waveElement = document.getElementById("waveLabel");
    if (coinElement) coinElement.textContent = "0";
    if (waveElement) waveElement.textContent = "Wave 1";
}

function showEndScreen(result, coins) {
    const endOverlay = document.getElementById("endOverlay");
    const popupImage = document.getElementById("endPopupImage");
    const coinsText = document.getElementById("endCoinsText");
    if (popupImage instanceof HTMLImageElement) {
        popupImage.src = result === "win" ? ImgHelper.ui.WinPopUp : ImgHelper.ui.LosePopUp;
    }
    if (coinsText) coinsText.textContent = `Coins: ${coins}`;
    endOverlay?.classList.remove("hidden");
}

function renderCharacterSelector() {
    const container = document.getElementById("characterSelector");
    if (!container) return;
    container.replaceChildren();
    for (let index = 1; index <= 5; index++) {
        container.appendChild(createCharacterCard(`character${index}`));
    }
}

function createCharacterCard(characterKey) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-card";
    button.classList.toggle("selected", characterKey === selectedCharacterKey);
    button.innerHTML = `<img src="${ImgHelper.characters[characterKey].idle[0]}" alt="${characterKey}">`;
    button.addEventListener("click", () => {
        selectedCharacterKey = characterKey;
        renderCharacterSelector();
    });
    return button;
}

function renderLevelSelector() {
    const container = document.getElementById("levelSelector");
    if (!container) return;
    container.replaceChildren();
    ImgHelper.background.areas.forEach((_, areaIndex) => {
        container.appendChild(createLevelButton(areaIndex));
    });
}

function createLevelButton(areaIndex) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-button";
    button.textContent = String(areaIndex + 1);
    button.classList.toggle("selected", areaIndex === selectedAreaIndex);
    button.addEventListener("click", () => {
        selectedAreaIndex = areaIndex;
        renderLevelSelector();
    });
    return button;
}

window.addEventListener("DOMContentLoaded", initMenu);