class BottleOnFloor extends MovableObject {
    static i = 0;
    id;
    IMAGES_BOTTLE_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    constructor() {
        let randomNumber = Math.round(Math.random());
        if (randomNumber == 0) {
            super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        } else {
            super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        }

        this.height = 75;
        this.width = 60;
        this.x = 300 + Math.random() * 5000;
        this.y = 360;
        this.id = BottleOnFloor.i;
        BottleOnFloor.i++;
    }

    correctPositionOfEachBottle() {
        const interval = setInterval(() => {
            level.bottleOnFloor.forEach(bottle => {
                // Level 1
                if (world?.testIfLevel2 === false) {
                    bottle.x = 300 + Math.random() * 4900;
                    clearInterval(interval);

                    // Level 2
                } if (world?.testIfLevel2 === true) {
                    bottle.x = 300 + Math.random() * 7900;
                    clearInterval(interval);
                }
            });
        }, 200);
    }


    createIndex() {
        world.bottless.push(BottleOnFloor, { 'index': BottleOnFloor.i });
        BottleOnFloor.i++;
    }




}