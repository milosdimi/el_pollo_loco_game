class StatusKilledEnemies extends DrawableObject {
    IMAGE_SCORE = [
        'img/icons/grilled-chicken-650693_640.png',
    ];


    constructor() {
        super();
        this.loadImage(this.IMAGE_SCORE);
        this.x = 660; // X-Koordinate der Anzeige des StatusIcons
        this.y = 20;
        this.width = 30;
        this.height = 30;

    }


}