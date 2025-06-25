class StatusBarCoins extends DrawableObject {
    IMAGES_STATUSBAR_COINS = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    collectedCoins = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES_STATUSBAR_COINS);
        this.x = 40; // X-Koordinate der Anzeige der Statusbar
        this.y = 90;
        this.width = 180;
        this.height = 45;
        this.setCoinNumber(0);
    }

    setCoinNumber(collectedCoins) {
        this.collectedCoins = collectedCoins;
        let path = this.IMAGES_STATUSBAR_COINS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.collectedCoins < 1) {
            return 0;  // zeigt das 0. Bild aus dem Array IMAGES_STATUSBAR_COINS an. 
        } else if (this.collectedCoins > 0 && this.collectedCoins <= 3) {
            return 1;
        } else if (this.collectedCoins > 3 && this.collectedCoins <= 6) {
            return 2;
        } else if (this.collectedCoins > 6 && this.collectedCoins <= 9) {
            return 3;
        } else if (this.collectedCoins > 9 && this.collecteCoins <= 12) {
            return 4;
        } else {
            return 5;
        }
    }
}