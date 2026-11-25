import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";
import { Projectile } from "./projectile.class.js";

export class Character extends MoveableObject {
    width = 120;
    height = 120;
    speed = 4;
    maxHealth = 100;
    health = 100;
    offset = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 15
    }
    x = 120;
    y = 260;
    characterKey;

    constructor(characterKey = "character1", offsetX = 120, offsetY = 260) {
        super();
        const characterSprites = ImgHelper.characters[characterKey];
        if (!characterSprites) {
            throw new Error(`Unknown characterKey: ${characterKey}`);
        }
        this.characterKey = characterKey;
        this.isShooting = false;
        this.lastShotTime = 0;
        this.x = offsetX;
        this.y = offsetY;
        this.loadImage(characterSprites.idle[0]);
        this.loadImages(characterSprites.idle);
        this.loadImages(characterSprites.shoot);
        this.animate();
    }

    animate() {
        const characterSprites = ImgHelper.characters[this.characterKey];
        IntervalHub.startInterval(() => {
            const activeFrames = this.isShooting
                ? characterSprites.shoot
                : characterSprites.idle;
            this.playAnimation(activeFrames);
        }, 50);
    }

    /**
    * Fires a projectile if the cooldown has elapsed.
    * @param {(projectile: Projectile) => void} onShoot
    * @param {number} cooldownMs
    */
    shoot(onShoot, cooldownMs = 400) {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < cooldownMs) {
            return;
        }
        this.lastShotTime = currentTime;
        this.triggerShot(onShoot);
    }

    triggerShot(onShoot) {
        this.isShooting = true;
        onShoot(new Projectile(this.x + 92, this.y + 58));
        setTimeout(() => {
            this.isShooting = false;
        }, 500);
    }

    /**
     * Reduces character health without dropping below zero.
     * @param {number} damage
     */
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }
}