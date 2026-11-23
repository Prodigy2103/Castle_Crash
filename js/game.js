import { Level } from "../models/level.class.js";
import { World } from "../models/world.class.js";

function initGame() {
    const canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        return;
    }
    const level = new Level(Level.createBackgrounds());
    new World(canvas, level);
}

window.addEventListener("DOMContentLoaded", initGame);
