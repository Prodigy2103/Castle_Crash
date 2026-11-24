import { Level } from "../models/level.class.js";
import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";

const KEY_MAP = {
    Space: "SPACE",
    Digit1: "DIGIT_1",
    Digit2: "DIGIT_2",
    Digit3: "DIGIT_3",
    ArrowUp: "UP",
    ArrowDown: "DOWN"
};

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

function initGame() {
    const canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        return;
    }
    const keyboard = new Keyboard();
    bindKeyboardEvents(keyboard);
    const level = new Level(Level.createBackgrounds());
    new World(canvas, level, keyboard);
}

window.addEventListener("DOMContentLoaded", initGame);
