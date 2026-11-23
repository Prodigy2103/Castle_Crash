import { Character } from "./character.class.js";

export class World {
    characters = [
        new Character("c1", 120, 160),
        new Character("c2", 120, 280),
        new Character("c3", 120, 400)
    ];
    canvas;
    context;
    level;

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {import("./level.class.js").Level} level
     */
    constructor(canvas, level) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = level;
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.characters);
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
}
