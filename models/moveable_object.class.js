import { DrawableObject } from "./drawable_object.class.js";

export class MoveableObject extends DrawableObject {

    speed = 1;

    /**
     * Moves the object to the left by its current speed
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Moves the object to the right by its current speed
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
   * Moves the object upwards by its current speed.
   */
    moveUp() {
        this.y -= this.speed;
    }

    /**
     * Moves the object downwards by its current speed.
     */
    moveDown() {
        this.y += this.speed;
    }

    /**
    * Advances the sprite animation by one frame from the image cache.
    * @param {string[]} images
    */
    playAnimation(images) {
        const frameIndex = this.currentImage % images.length;
        const imagePath = images[frameIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    /**
     * Checks collision using each object's hitbox offsets.
     * @param {MoveableObject} otherObject
     * @returns {boolean}
     */
    isColliding(otherObject) {
        return (
            this.x + this.width - this.offset.right > otherObject.x + otherObject.offset.left &&
            this.y + this.height - this.offset.bottom > otherObject.y + otherObject.offset.top &&
            this.x + this.offset.left < otherObject.x + otherObject.width - otherObject.offset.right &&
            this.y + this.offset.top < otherObject.y + otherObject.height - otherObject.offset.bottom
        );
    }
}
