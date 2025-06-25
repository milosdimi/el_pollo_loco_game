class Coin extends MovableObject {

    id;

    IMAGES_COIN = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png",
    ];

    constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.loadImages(this.IMAGES_COIN);
        this.height = 70;
        this.width = 65;
        this.x = 300 + Math.random() * 6000;
        this.y = 50 + Math.random() * 300;
        this.animate();
        this.id = Coin.i;
        Coin.i++;
    }

    correctCoinPosition() {
        const interval = setInterval(() => {
            level.coins.forEach(coin => {
                // Level 1
                if (world?.testIfLevel2 === false) {
                    coin.x = 300 + Math.random() * 5000;
                    clearInterval(interval);

                    // Level 2
                } else if (world?.testIfLevel2 === true) {
                    coin.x = 300 + Math.random() * 8000;
                    clearInterval(interval);
                }
            });
        }, 200);
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 700);
    }


}