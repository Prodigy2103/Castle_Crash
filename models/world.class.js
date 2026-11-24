import { Character } from "./character.class.js";
import { Enemy } from "./enemy.class.js";
import { Effect } from "./effects.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";
import { Background } from "./background.class.js";

export class World {
    showHitboxes = true;
    character;
    enemies = [];
    projectiles = [];
    effects = [];
    canvas;
    context;
    level;
    keyboard;

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {import("./level.class.js").Level} level
     * @param {import("./keyboard.class.js").Keyboard} keyboard
     * @param {string} characterKey
     */
    constructor(canvas, level, keyboard, characterKey = "character1") {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = level;
        this.keyboard = keyboard;
        this.character = new Character(characterKey, 120, 265);
        this.startInputLoop();
        this.startEnemySpawner();
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cleanupProjectiles();
        this.cleanupEnemies();
        this.cleanupEffects();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.projectiles);
        this.addObjectsToMap(this.effects);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws a list of drawable objects onto the canvas.
     * @param {import("./drawable_object.class.js").DrawableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach((drawableObject) => this.addToMap(drawableObject));
    }

    /**
     * Draws a single object onto the canvas.
     * @param {import("./drawable_object.class.js").DrawableObject} drawableObject
     */
    addToMap(drawableObject) {
        drawableObject.draw(this.context);
        if (this.showHitboxes && !(drawableObject instanceof Background)) {
            drawableObject.drawFrame(this.context);
        }
    }

    startInputLoop() {
        IntervalHub.startInterval(() => {
            this.handleShootingInput();
            this.handleMovementInput();
            this.checkProjectileHits();
        }, 1000 / 60);
    }

    handleShootingInput() {
        if (!this.keyboard.SPACE) {
            return;
        }
        this.character.shoot((projectile) => {
            this.spawnProjectile(projectile);
        }, 400);
    }

    handleMovementInput() {
        const minRoadY = 135;
        const maxRoadY = 485;
        if (this.keyboard.UP) {
            this.moveCharacterUp(minRoadY);
        }
        if (this.keyboard.DOWN) {
            this.moveCharacterDown(maxRoadY);
        }
    }

    moveCharacterUp(minRoadY) {
        if (this.character.y - this.character.speed >= minRoadY) {
            this.character.moveUp();
        }
    }

    moveCharacterDown(maxRoadY) {
        if (this.character.y + this.character.height + this.character.speed <= maxRoadY) {
            this.character.moveDown();
        }
    }

    spawnProjectile(projectile) {
        this.projectiles.push(projectile);
        this.effects.push(
            new Effect(ImgHelper.effects.shoot, projectile.x - 1, projectile.y - 8, 80, 50)
        );
    }

    checkProjectileHits() {
        this.projectiles.forEach((projectile) => {
            const hitEnemy = this.enemies.find(
                (enemy) => !enemy.isDead && projectile.isColliding(enemy));
            if (hitEnemy) {
                this.handleHit(projectile, hitEnemy);
            }
        });
    }

    handleHit(projectile, hitEnemy) {
        projectile.isHit = true;
        projectile.destroy();
        hitEnemy.die();
        this.effects.push(
            new Effect(ImgHelper.effects.explosion, hitEnemy.x + 35, hitEnemy.y + 70, 120, 120)
        );
    }

    startEnemySpawner() {
        IntervalHub.startInterval(() => {
            if (this.enemies.length < 8) {
                this.spawnRandomEnemy();
            }
        }, 2000);
    }

    spawnRandomEnemy() {
        const regularIndex = Math.floor(Math.random() * 8) + 1;
        const enemyKey = `regular${regularIndex}`;
        const randomY = 55 + Math.random() * 215;
        const randomSpeed = 0.7 + Math.random() * 0.7;
        this.enemies.push(
            new Enemy(enemyKey, this.canvas.width, randomY, randomSpeed)
        );
    }

    cleanupEnemies() {
        this.enemies = this.enemies.filter((enemy) => {
            const isOutOfBounds = enemy.x + enemy.width < 0;
            if (isOutOfBounds) {
                enemy.destroy();
            }
            return !enemy.isFinished && !isOutOfBounds;
        });
    }

    cleanupProjectiles() {
        this.projectiles = this.projectiles.filter((projectile) => {
            const isActive = !projectile.isHit && projectile.x <= this.canvas.width;
            if (!isActive) {
                projectile.destroy();
            }
            return isActive;
        });
    }

    cleanupEffects() {
        this.effects = this.effects.filter((effect) => !effect.isFinished);
    }
}
