const ASSETS_ROOT = "./assets/Png";

const UI_FILENAMES = [
    "0Bar.png", "1Bar.png", "2Bar.png", "3Bar.png", "4Bar.png", "5Bar.png",
    "AddBtn.png", "AddBtn_Pressed.png", "AddonBoxGrey.png", "AddonBoxNumber.png",
    "AddonBtnyellow.png", "AddonIcon1.png", "AddonIcon2.png", "AddonIcon3.png",
    "AddonIcon4.png", "AddonIcon5.png", "AddonIcon6.png", "AddonIcon7.png",
    "AddonIcon8.png", "AddonScreen.png", "AddOnSlotBtn.png", "BgPaused.png",
    "BlueShopBox.png", "BtnGreen.png", "BtnGreenAdd Pressed.png",
    "BtnGreenAdd.png", "BtnGreenPressed.png", "BtnHelp.png", "BtnHelpOff.png",
    "BtnMusic.png", "BtnMusicOff.png", "BtnOrange.png", "BtnOrangePressed.png",
    "BtnShopDisable.png", "BtnShopYellow.png", "BtnSound Off.png",
    "BtnSound.png", "BtnTab_Active.png", "BtnTab_on.png", "BtnVibra Off.png",
    "BtnVibra.png", "CatUpgradeScreen.png", "CoinBar.png", "CoinIcon.png",
    "DaillyIcon.png", "GemsBarBg.png", "GemsIcon.png", "GreenLevel.png",
    "Icon_Addon.png", "Icon_Cat.png", "Icon_home.png", "Icon_Shop.png",
    "LandingScreen.png", "LevelMap.png", "LevelMap_Bg_Screen.png",
    "LockedBoxHelp.png", "LockedCatBox.png", "LockedLevel.png", "Logo.png",
    "LosePopUp.png", "OrangeBTNAds.png", "OrangeBTNAdsLoad.png", "OrangeLvl.png",
    "OrangeShopBox.png", "ScrollBarBg.png", "ScrollBarBtn.png",
    "ScrollBarPlus.png", "SelectedBorder.png", "SettingBtn.png",
    "ShopBoxGreen.png", "ShopIcon1.png", "ShopIcon2.png", "ShopIcon3.png",
    "ShopIcon4.png", "ShopIcon5.png", "ShopIcon6.png", "ShopIcon7.png",
    "ShopScreen.png", "TitleRibbon.png", "Up0.png", "Up1.png", "Up2.png",
    "Up3.png", "Uplogo1.png", "Uplogo2.png", "Uplogo3.png", "Uplogo4.png",
    "Uplogo5.png", "Uplogo6.png", "Uplogo7.png", "Uplogo8.png", "Uplogo9.png",
    "Uplogo10.png", "Uplogo11.png", "Uplogo12.png", "Uplogo13.png",
    "Uplogo14.png", "Uplogo15.png", "WallIcon.png", "WaveBar.png",
    "WinBonus.png", "WinPopUp.png", "YellowBorderAddon.png", "YellowBox.png"
];

const BOSS_FRAME_COUNTS = [
    [40, 50, 20, 35],
    [40, 50, 20, 35],
    [40, 50, 20, 35],
    [40, 55, 20, 25],
    [30, 50, 20, 30],
    [30, 50, 20, 30],
    [30, 50, 20, 30]
];

const REGULAR_EXTRAS = {
    1: { head: `${ASSETS_ROOT}/Enemies/Enemy Reg 1/Head.png` },
    2: { hat: `${ASSETS_ROOT}/Enemies/Enemy Reg 2/Hat.png` },
    3: { hat: `${ASSETS_ROOT}/Enemies/Enemy Reg 3/Hat.png` }
};

/**
 * Generates an ordered list of zero-padded frame paths.
 * @param {string} prefix
 * @param {number} frameCount
 * @returns {string[]}
 */
function buildFrames(prefix, frameCount) {
    const frames = [];
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
        const paddedIndex = String(frameIndex).padStart(2, "0");
        frames.push(`${prefix}${paddedIndex}.png`);
    }
    return frames;
}

/**
 * Builds the path map for playable cat characters C1 through C15.
 * @returns {Record<string, {idle: string[], shoot: string[]}>}
 */
function buildCharacterMap() {
    const characters = {};
    for (let charIndex = 1; charIndex <= 15; charIndex++) {
        const base = `${ASSETS_ROOT}/Characters/C${charIndex}`;
        characters[`c${charIndex}`] = {
            idle: buildFrames(`${base}/Idle/Character${charIndex}-Idle_`, 20),
            shoot: buildFrames(`${base}/Shoot/Character${charIndex}-Shoot_`, 10)
        };
    }
    return characters;
}

/**
 * Builds the path map for regular enemies 1 through 8.
 * @returns {Record<string, object>}
 */
function buildRegularEnemyMap() {
    const regularEnemies = {};
    for (let enemyIndex = 1; enemyIndex <= 8; enemyIndex++) {
        const base = `${ASSETS_ROOT}/Enemies/Enemy Reg ${enemyIndex}`;
        regularEnemies[`reg${enemyIndex}`] = {
            attack: buildFrames(`${base}/Attack/Enemy-Attack_`, 25),
            dead: buildFrames(`${base}/Dead/Enemy-Dead_`, 60),
            idle: buildFrames(`${base}/Idle/Enemy-Idle_`, 20),
            walk: buildFrames(`${base}/Walk/Enemy-Walking_`, 35),
            ...(REGULAR_EXTRAS[enemyIndex] ?? {})
        };
    }
    return regularEnemies;
}

/**
 * Builds the path map for boss enemies 1 through 7.
 * @returns {Record<string, object>}
 */
function buildBossEnemyMap() {
    const bossEnemies = {};
    BOSS_FRAME_COUNTS.forEach(([attack, dead, idle, walk], arrayIndex) => {
        const bossIndex = arrayIndex + 1;
        const base = `${ASSETS_ROOT}/Enemies/Enemy Boss ${bossIndex}`;
        bossEnemies[`boss${bossIndex}`] = {
            attack: buildFrames(`${base}/Attack/Enemy-Attack_`, attack),
            dead: buildFrames(`${base}/Dead/Enemy-Dead_`, dead),
            idle: buildFrames(`${base}/Idle/Enemy-Idle_`, idle),
            walk: buildFrames(`${base}/Walk/Enemy-Walk_`, walk)
        };
    });
    return bossEnemies;
}

/**
 * Maps UI filenames to clean property keys.
 * @returns {Record<string, string>}
 */
function buildUiMap() {
    const uiAssets = {};
    UI_FILENAMES.forEach((fileName) => {
        const key = fileName.replace(".png", "").replaceAll(" ", "_");
        uiAssets[key] = `${ASSETS_ROOT}/Ui/${fileName}`;
    });
    return uiAssets;
}

export class ImgHelper {
    static background = {
        areas: [
            `${ASSETS_ROOT}/Area/Area1.png`,
            `${ASSETS_ROOT}/Area/Area2.png`,
            `${ASSETS_ROOT}/Area/Area3.png`,
            `${ASSETS_ROOT}/Area/Area4.png`,
            `${ASSETS_ROOT}/Area/Area5.png`
        ]
    };

    static bullets = [
        `${ASSETS_ROOT}/Bullets/Artboard 1.png`,
        `${ASSETS_ROOT}/Bullets/Artboard 1 copy.png`,
        `${ASSETS_ROOT}/Bullets/Artboard 1 copy 2.png`
    ];

    static catGuardian = {
        attack: buildFrames(`${ASSETS_ROOT}/Cat Guardian/Attack/Enemy-Attack_`, 25),
        idle: buildFrames(`${ASSETS_ROOT}/Cat Guardian/Idle/Enemy-Idle_`, 20)
    };

    static catBoxing = {
        attack: buildFrames(`${ASSETS_ROOT}/CatBoxing/Attack/CatBoxing-Fight_`, 20),
        idle: buildFrames(`${ASSETS_ROOT}/CatBoxing/Idle/CatBoxing-Idle_`, 20)
    };

    static characters = buildCharacterMap();

    static enemies = {
        ...buildRegularEnemyMap(),
        ...buildBossEnemyMap()
    };

    static fx = {
        explosion: buildFrames(`${ASSETS_ROOT}/Explosion/ExplosionFx-Explossion_`, 20),
        shoot: buildFrames(`${ASSETS_ROOT}/ShootFx/Fx2-animation_`, 15)
    };

    static ui = buildUiMap();
}
