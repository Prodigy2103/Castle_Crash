import { MoveableObject } from "./moveable_object.class.js";

export class Background extends MoveableObject {
    width = 1280;
    height = 640;

    /**
     * @param {string} imagePath
     * @param {number} offsetX
     */
    constructor(imagePath, offsetX) {
        super();
        this.loadImage(imagePath);
        this.x = offsetX;
        this.y = 640 - this.height;
    }
}
