import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Projectile extends MoveableObject {
    width = 45;
    height = 34;
    movementIntervalId;
    isHit = false;
    offset = {
        top: 10,
        left: 12,
        right: 12,
        bottom: 10
    };


    constructor(offsetX, offsetY, speed = 8) {
        super();
        this.x = offsetX;
        this.y = offsetY;
        this.speed = speed;
        this.loadImage(ImgHelper.bullets[0]);
        this.startMovement();
    }

    startMovement() {
        this.movementIntervalId = IntervalHub.startInterval(() => {
            this.moveRight();
        }, 1000 / 60);
    }

    destroy() {
        IntervalHub.stopInterval(this.movementIntervalId);
    }
}