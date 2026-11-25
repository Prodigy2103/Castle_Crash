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
    isAttacking = false;
    lastAttackTime = 0;
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
        this.loadImages(enemySprites.attack);
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
            if (this.isAttacking || this.isDead) {
                return;
            }
            this.moveLeft();
        }, 1000 / 60);
    }

    startWalkAnimation() {
        const enemySprites = ImgHelper.enemies[this.enemyKey];
        this.animationIntervalId = IntervalHub.startInterval(() => {
            const activeFrames = this.isAttacking
                ? enemySprites.attack
                : enemySprites.walk;
            this.playAnimation(activeFrames);
        }, 50);
    }

    /**
    * Attacks the barricade while intact, or the character after breakthrough.
    * @param {boolean} isWallBroken
    * @param {number} barricadeX
    * @param {import("./character.class.js").Character} character
    * @param {(damage: number) => void} onWallDamage
    * @param {(damage: number) => void} onCharacterDamage
    */
    updateAttackState(isWallBroken, barricadeX, character, onWallDamage, onCharacterDamage) {
        if (this.isDead) {
            return;
        }
        if (!isWallBroken && this.x + this.offset.left <= barricadeX) {
            this.isAttacking = true;
            this.dealPeriodicDamage(onWallDamage, 5);
            return;
        }
        this.isAttacking = isWallBroken && this.isColliding(character);
        if (this.isAttacking) {
            this.dealPeriodicDamage(onCharacterDamage, 10);
        }
    }

    dealPeriodicDamage(onDamage, damage) {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime >= 1000) {
            this.lastAttackTime = currentTime;
            onDamage(damage);
        }
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
