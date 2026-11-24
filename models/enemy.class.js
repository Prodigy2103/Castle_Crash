import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Enemy extends MoveableObject {
    width = 200;
    height = 210;
    enemyKey;

    /**
     * @param {string} enemyKey
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} speed
     */

    constructor(enemyKey = "regular1", offsetX = 1280, offsetY = 265, speed = 1) {
        super();
        const enemySprites = ImgHelper.enemies[enemyKey];
        if (!enemySprites) {
            throw new Error(`Unknown enemyKey: ${enemyKey}`);
        }
        this.enemyKey = enemyKey;
        this.x = offsetX;
        this.y = offsetY;
        this.speed = speed;
        this.loadImage(enemySprites.walk[0]);
        this.loadImages(enemySprites.walk);
        this.animate();
    }

    /**
     * Starts movement and walk animation loops
     */
    animate() {
        this.startMovement();
        this.startWalkAnimation();
    }

    startMovement() {
        IntervalHub.startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    startWalkAnimation() {
        const walkFrames = ImgHelper.enemies[this.enemyKey].walk;
        IntervalHub.startInterval(() => {
            this.playAnimation(walkFrames);
        }, 50);
    }
}
