import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Enemy extends MoveableObject {
    width = 200;
    height = 210;
    enemyKey;
    movementIntervalId;
    animationIntervalId;
    deadIntervalId;
    isDead = false;
    isFinished = false;
    offset = {
        top: 83,
        left: 55,
        right: 67,
        bottom: 39
    };

    /**
     * @param {string} enemyKey
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} speed
     */

    constructor(enemyKey = "regular1", offsetX = 1180, offsetY = 265, speed = 1) {
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
        this.loadImages(enemySprites.dead);
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
        this.movementIntervalId = IntervalHub.startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    startWalkAnimation() {
        const walkFrames = ImgHelper.enemies[this.enemyKey].walk;
        this.animationIntervalId = IntervalHub.startInterval(() => {
            this.playAnimation(walkFrames);
        }, 50);
    }

    die() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.currentImage = 0;
        this.destroy();
        this.playDeadAnimation();
    }

    playDeadAnimation() {
        const deadFrames = ImgHelper.enemies[this.enemyKey].dead;
        this.deadIntervalId = IntervalHub.startInterval(() => {
            if (this.currentImage >= deadFrames.length) {
                this.isFinished = true;
                IntervalHub.stopInterval(this.deadIntervalId);
                return;
            }
            this.img = this.imageCache[deadFrames[this.currentImage]];
            this.currentImage++;
        }, 25);
    }

    destroy() {
        IntervalHub.stopInterval(this.movementIntervalId);
        IntervalHub.stopInterval(this.animationIntervalId);
    }
}
