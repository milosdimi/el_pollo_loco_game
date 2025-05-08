class Level {
    enemies;
    clouds;
    backgroundObject;
    level_end_x = 2200; // The x position where the level ends

    constructor(enemies, clouds, backgroundObject) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObject = backgroundObject;
    }
}