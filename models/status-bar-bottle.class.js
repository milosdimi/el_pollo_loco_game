class StatusBarBottles extends DrawableObject {
    IMAGES_STATUSBAR_BOTTLES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    collectedBottles = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_BOTTLES);
        this.x = 40; // X-Koordinate der Anzeige der Statusbar
        this.y = 45;
        this.width = 180;
        this.height = 45;
        this.setBottleNumber(0);
    }

    setBottleNumber(collectedBottles) {
        this.collectedBottles = collectedBottles;
        let path = this.IMAGES_STATUSBAR_BOTTLES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.collectedBottles < 1) {
            return 0;  // zeigt das 0. Bild aus dem Array IMAGES_STATUSBAR_BOTTLES an. 
        } else if (this.collectedBottles > 0 && this.collectedBottles <= 3) {
            return 1;
        } else if (this.collectedBottles > 3 && this.collectedBottles <= 6) {
            return 2;
        } else if (this.collectedBottles > 6 && this.collectedBottles <= 9) {
            return 3;
        } else if (this.collectedBottles > 9 && this.collectedBottles <= 12) {
            return 4;
        } else {
            return 5;
        }
    }
}