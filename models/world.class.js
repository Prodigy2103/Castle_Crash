import { Character } from "./character.class.js";
import { Enemy } from "./enemy.class.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class World {
    characters = [
        new Character("character1", 120, 155),
        new Character("character2", 120, 265),
        new Character("character3", 120, 370)
    ];
    enemies = [
        new Enemy("regular1", 1050, 55, 0.8),
        new Enemy("regular2", 1200, 155, 0.8),
        new Enemy("regular3", 1350, 270, 0.8)
    ];
    projectiles = [];
    canvas;
    context;
    level;
    keyboard;
    lastSalvoTime = 0;
    selectedCharacterIndex = 0;

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {import("./level.class.js").Level} level
     */
    constructor(canvas, level, keyboard) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = level;
        this.keyboard = keyboard;
        this.startInputLoop();
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cleanupProjectiles();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.characters);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.projectiles);
        requestAnimationFrame(() => this.draw());
    }
    /**
     * Draws a list of drawable objects onto the canvas.
     * @param {import("./drawable_object.class.js").DrawableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach((drawableObject) => drawableObject.draw(this.context));
    }
    /**
    * Draws a single object onto the canvas.
    * @param {import("./drawable_object.class.js").DrawableObject} drawableObject
    */
    addToMap(drawableObject) {
        drawableObject.draw(this.context);
    }

    startInputLoop() {
        IntervalHub.startInterval(() => {
            this.handleShootingInput();
            this.handleMovementInput();
        }, 1000 / 60);
    }

    handleShootingInput() {
        if (this.keyboard.SPACE) {
            this.fireAllCharacters();
        }
        const laneKeys = [
            [this.keyboard.DIGIT_1, 0],
            [this.keyboard.DIGIT_2, 1],
            [this.keyboard.DIGIT_3, 2]
        ];
        laneKeys.forEach(([isPressed, characterIndex]) => {
            if (isPressed) {
                this.fireCharacter(characterIndex);
            }
        });
    }

    handleMovementInput() {
        const minRoadY = 135;
        const maxRoadY = 485;
        if (this.keyboard.UP) {
            this.moveCharactersUp(minRoadY);
        }
        if (this.keyboard.DOWN) {
            this.moveCharactersDown(maxRoadY);
        }
    }

    moveCharactersUp(minRoadY) {
        const character = this.characters[this.selectedCharacterIndex];
        if (character && character.y - character.speed >= minRoadY) {
            character.moveUp();
        }
    }

    moveCharactersDown(maxRoadY) {
        const character = this.characters[this.selectedCharacterIndex];
        if (character && character.y + character.height + character.speed <= maxRoadY) {
            character.moveDown();
        }
    }

    fireCharacter(characterIndex) {
        this.selectedCharacterIndex = characterIndex;
        const character = this.characters[characterIndex];
        character?.shoot((projectile) => {
            this.projectiles.push(projectile);
        }, 400);
    }

    fireAllCharacters() {
        const currentTime = Date.now();
        if (currentTime - this.lastSalvoTime < 2000) {
            return;
        }
        this.lastSalvoTime = currentTime;
        this.characters.forEach((character) => {
            character.triggerShot((projectile) => {
                this.projectiles.push(projectile);
            });
        });
    }

    cleanupProjectiles() {
        this.projectiles = this.projectiles.filter((projectile) => {
            const isInsideCanvas = projectile.x <= this.canvas.width;
            if (!isInsideCanvas) {
                projectile.destroy();
            }
            return isInsideCanvas;
        });
    }
}
