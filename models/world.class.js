import { Character } from "./character.class.js";
import { Enemy } from "./enemy.class.js";
import { Effect } from "./effects.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";
import { Background } from "./background.class.js";
import { StatusBar } from "./status_bar.class.js";

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
    statusBar = new StatusBar();
    maxWallHealth = 100;
    wallHealth = 100;
    barricadeX = 415;
    isWallBroken = false
    isGameOver = false;
    maxWaves = 5;
    enemiesPerWave = 10;
    onGameEnd;
    coins = 0;
    defeatedEnemies = 0;
    wave = 1;

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {import("./level.class.js").Level} level
     * @param {import("./keyboard.class.js").Keyboard} keyboard
     * @param {string} characterKey
     */
    constructor(canvas, level, keyboard, characterKey = "character1", onGameEnd = null) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.level = level;
        this.keyboard = keyboard;
        this.onGameEnd = onGameEnd;
        this.character = new Character(characterKey, 120, 265);
        this.startInputLoop();
        this.startEnemySpawner();
        this.level.backgroundObjects[0]?.loadImages(ImgHelper.background.brokenAreas);
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cleanupProjectiles();
        this.cleanupEnemies();
        this.cleanupEffects();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.drawWallHealthBar();
        this.addToMap(this.character);
        this.statusBar.draw(this.context);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.projectiles);
        this.addObjectsToMap(this.effects);
        this.level.backgroundObjects[0]?.loadImages(ImgHelper.background.brokenAreas);
        if (this.isGameOver) {
            return;
        }
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
            this.handleEnemyAttacks();
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

    handleEnemyAttacks() {
        this.enemies.forEach((enemy) => {
            enemy.updateAttackState(
                this.isWallBroken,
                this.barricadeX,
                this.character,
                (damage) => this.damageWall(damage),
                (damage) => this.damageCharacter(damage)
            );
        });
    }

    damageWall(damage) {
        this.wallHealth = Math.max(0, this.wallHealth - damage);
        if (this.wallHealth === 0 && !this.isWallBroken) {
            this.isWallBroken = true;
            this.switchToBrokenBackground();
        }
    }

    switchToBrokenBackground() {
        const background = this.level.backgroundObjects[0];
        const brokenPath = ImgHelper.background.brokenAreas[0];
        if (background?.imageCache[brokenPath]) {
            background.img = background.imageCache[brokenPath];
        }
    }

    drawWallHealthBar() {
        if (this.isWallBroken) {
            return;
        }
        const barX = 402;
        const barY = 178;
        const barWidth = 10;
        const barHeight = 226;
        const healthRatio = this.wallHealth / this.maxWallHealth;
        const filledHeight = barHeight * healthRatio;
        this.context.fillStyle = "#1e293b";
        this.context.fillRect(barX, barY, barWidth, barHeight);
        this.context.fillStyle = healthRatio > 0.3 ? "#84cc16" : "#ef4444";
        this.context.fillRect(barX, barY + barHeight - filledHeight, barWidth, filledHeight);
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
        this.addEnemyReward();
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

    addEnemyReward() {
        this.coins += 10;
        this.defeatedEnemies++;
        this.wave = Math.min(
            this.maxWaves,
            Math.floor(this.defeatedEnemies / this.enemiesPerWave) + 1
        );
        this.updateHud();
        if (this.defeatedEnemies >= this.maxWaves * this.enemiesPerWave) {
            this.endGame("win");
        }
    }

    damageCharacter(damage) {
        this.character.takeDamage(damage);
        this.statusBar.setPercentage(this.character.health);
        if (this.character.health === 0) {
            this.endGame("lose");
        }
    }

    endGame(result) {
        if (this.isGameOver) {
            return;
        }
        this.isGameOver = true;
        IntervalHub.stopAllIntervals();
        this.onGameEnd?.(result, this.coins);
    }

    destroy() {
        this.isGameOver = true;
        IntervalHub.stopAllIntervals();
    }

    updateHud() {
        const coinElement = document.getElementById("coinCount");
        const waveElement = document.getElementById("waveLabel");
        if (coinElement) {
            coinElement.textContent = String(this.coins);
        }
        if (waveElement) {
            waveElement.textContent = `Wave ${this.wave}`;
        }
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
