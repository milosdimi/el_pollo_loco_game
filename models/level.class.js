class Level {
    enemies;
    clouds;
    backgroundObject;
    bottleOnFloor;
    coins;
    collectedBottles;

    level_end_x = 5200; // The x position where the level ends

    constructor(enemies, clouds, backgroundObject, bottleOnFloor, coins, collectedBottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObject = backgroundObject;
        this.bottleOnFloor = bottleOnFloor;
        this.coins = coins;
        this.collectedBottles = collectedBottles;
    }
}