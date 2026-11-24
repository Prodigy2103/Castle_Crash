import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Projectile extends MoveableObject {
    width = 80;
    height = 50;
    movementIntervalId;
    animationIntervalId;

    /**
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} speed
     */
    constructor(offsetX, offsetY, speed = 6) {
        super();
        const shootFrames = ImgHelper.effects.shoot;
        this.x = offsetX;
        this.y = offsetY;
        this.speed = speed;
        this.loadImage(shootFrames[0]);
        this.loadImages(shootFrames);
        this.animate();
    }

    animate() {
        this.startMovement();
        this.startEffectAnimation();
    }

    startMovement() {
        this.movementIntervalId = IntervalHub.startInterval(() => {
            this.moveRight();
        }, 1000 / 60);
    }

    startEffectAnimation() {
        const shootFrames = ImgHelper.effects.shoot;
        this.animationIntervalId = IntervalHub.startInterval(() => {
            this.playAnimation(shootFrames);
        }, 40);
    }

    destroy() {
        IntervalHub.stopInterval(this.movementIntervalId);
        IntervalHub.stopInterval(this.animationIntervalId);
    }

}