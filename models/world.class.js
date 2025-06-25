class World {
    character = new Character();
    gameStarted = false;
    checkIfLevel2 = checkIfLevel2;
    level = level1;
    canvas;
    ctx;
    keyboard;
    gamePaused = false;
    camera_x = 0;
    statusBar = new StatusBar();

    throwableObjects = [];

    bottleOnFloor = [];
    collectedThrowableObjects = [];
    bottless = [];
    statusBarBottles = new StatusBarBottles();
    statusBarCoins = new StatusBarCoins();
    statusKilledEnemies = new StatusKilledEnemies();
    bottleInAir = false;   // diese Variable gibt an, ob sich gerade eine Flasche in der Luft befindet. Diese Variable wird gebraucht, um in der Funktion "checkThrowObjects()" zu überprüfen, ob sich bereits eine Flasche in der Luft befindet, damit nicht mehrere Flaschen auf einmal geworfen werden können
    screens = new Screens();
    indexOfCurrentEnemy;   // der Wert von 'movingObject' muss der Variablen 'indexOfCurrentEnemy' zugeordnet werden, damit wenn in der Klasse Character() abgefragt wird, ob es sich um eine Kollision handelt oder ob der Character von oben auf den Enemay springt, Werte für einen Enemy vorhanden sind, da es sonst zu einem Fehler kommt, wenn die Funktion ' isJumpingOnEnemy()' ausgeführt wird. 
    canCheckJumpingOnEnemy = true;
    canExecuteCollisionCheck = false;
    coin = [];
    killedEnemies = 0;
    gameOver = false;
    isMuted = false;
    background_sound = new Audio('audio/background-music.mp3');

    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
        this.setWorld();

        this.runIntervals();
        level.enemies[0].correctSpeedOfEachChicken();   //-- ruft diese Funktion hier beim Erzeugen des ersten Huhns auf, da man sie nicht in der Klasse "Chicken" aufrufen sollte, da sie hier über den Konstruktor aufgerufen werden würde, sodass sie bei jedem neu erzeugten Huhn aufgerufen werden würde und dies zu viel rechenarbeit führen würde
        level.coins[0].correctPositionOfEachCoin();    //-- ruft diese Funktion hier beim Erzeugen des ersten Coins auf, da man sie nicht in der Klasse "Coin" aufrufen sollte, da sie hier über den Konstruktor aufgerufen werden würde, sodass sie bei jedem neu erzeugten Coin aufgerufen werden würde und dies zu viel rechenarbeit führen würde
        level.bottleOnFloor[0].correctPositionOfEachBottle();
        this.adjustLevelEnd();
    }

    adjustLevelEnd() {
        if (this.checkIfLevel2 === false) {
            level.level_end_x = 5100
        } if (this.checkIfLevel2 === true) {
            level.level_end_x = 8100
        }
    }

    setWorld() {
        this.character.world = this;
    }

    runIntervals() {
        this.checkCollisions();
        this.checkThrowObjects();
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.checkForCollisionsWhithEnemies();
        this.checkIfCharacterJumpsOnEnemy();
        this.checkForCollisionsWhithThrowableObjects();
        this.checkForCollisionsWhithCoins();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // cleared bzw. löscht den Inhalt des Canvas vor jedem neuen Zeichnen
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(level.backgroundObjects);  // Background
        this.ctx.translate(-this.camera_x, 0); // verschiebt die Kamera vor den Zeichnen der StatusBar zurück
        this.addObjectsToMap(level.clouds);  // Clouds
        this.addToMap(this.statusBar); // Status-Bar
        this.addToMap(this.statusBarBottles); // Status-Bar-Bottles
        this.addToMap(this.statusBarCoins); // Status-Bar-Coins
        this.addToMap(this.statusKilledEnemies); // Status Killed Enemies
        this.setTextStyle();  // diese Funktion stylt die Anzeige der Ziffer der gekillten Enemies
        this.ctx.fillText(`${this.killedEnemies}`, this.statusKilledEnemies.x + 15, this.statusKilledEnemies.y + 52);   // diese Zeile zeichnet die Zahl der getöteten Enemies in das Canvas
        this.resetTextStyle();  // diese Funktion setzt das Styling der Anzeige der gekillten Enemies zurück
        this.addToMap(this.screens);
        this.ctx.translate(this.camera_x, 0); // schiebt die Kamera nach den Zeichnen der StatusBar wieder nach vorne -> durch diese beiden Schritte läuft die StatusBar nicht aus den Bild, wenn der Character bewegt wird
        this.addToMap(this.character);  // Character
        this.addObjectsToMap(level.enemies);  // Enemies
        this.addObjectsToMap(level.bottleOnFloor);  // Bottle on Floor ready to collect
        this.addObjectsToMap(level.coins);  // Coins
        this.addObjectsToMap(this.collectedThrowableObjects);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {   // damit wird die draw()-Methode so oft aufgerufen, wie die Grafikkarte es hergibt
            self.draw();
        });
    }

    checkForCollisionsWhithEnemies() {
        setInterval(() => {   // Checking for Collisions whith Enemies
            level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.character.isAboveGround() && !enemy.isDead) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);  // weist dem Prozentwert 'percentage' den aktuellen Wert zu in der Klasse Status-bar
                }
            });
        }, 20);
    }

    checkIfCharacterJumpsOnEnemy() {
        setInterval(() => {   // Checking if Character jumps on Enemy
            level.enemies.forEach((enemy, indexOfEnemy) => {
                if (this.character.isJumpingOnEnemy(enemy)) {   // der erste Teil der Condition prüft, ob überhaupt eine Kollision mit einem Enemy vorliegt, und der zweite Teil der Condition prüft, ob der Character dabei von oben kommend mit dem Enemy kolliediert. 
                    this.playDeadChickenAnimation(enemy);  // hier wird das ganze getroffene Objekt (enemy) übergeben und nicht nur dessen index, da sich dieser rasch ändern kann, z.B. wennn ein enemy gelöscht wurde, sodass es zu fehlern kommen kann
                    enemy.isDead = true;
                    this.character.enemyDeleted_sound.play();  // spielt den Sound ab, dass ein enemy getötet wurde
                }
            });
        }, 200);
    }

    checkForCollisionsWhithThrowableObjects() {
        setInterval(() => {   // Checking for Collisions whith Bottles/ThrowableObjects
            level.bottleOnFloor.forEach((bottleOnFloor, indexOfBottle) => {
                if (this.character.isColliding(bottleOnFloor)) {
                    level.collectedBottle = new ThrowableObject(-5000);
                    this.collectedThrowableObjects.push(level.collectedBottle);
                    level.bottleOnFloor.splice(indexOfBottle, 1);  // löscht die Flasche, mit der der Character kollidiert ist anhand ihres index
                    this.statusBarBottles.collectedBottles++;  // erhöht den Wert der gesammelten Flaschen für die Bottle-Status-Bar
                    this.statusBarBottles.setBottleNumber(this.statusBarBottles.collectedBottles);  // aktualisiert die Anzeige der Bottle-Status-Bar
                    this.character.bottleCollected_sound.play();
                }
            });
        }, 200);
    }

    checkForCollisionsWhithCoins() {
        setInterval(() => {   // Checking for Collisions whith Coins
            level.coins.forEach((coin, indexOfCoin) => {
                if (this.character.isColliding(coin)) {
                    level.coins.splice(indexOfCoin, 1);  // löscht die Flasche, mit der der Character kollidiert ist anhand ihres index
                    this.statusBarCoins.collectedCoins++;  // erhöht den Wert der gesammelten Coins für die Coin-Status-Bar
                    this.statusBarCoins.setCoinNumber(this.statusBarCoins.collectedCoins);  // aktualisiert die Anzeige der Bottle-Status-Bar
                    this.character.coinCollected_sound.play();
                }
            });
        }, 200);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.letterD && this.collectedThrowableObjects.length > 0 && this.bottleInAir == false && this.gamePaused == false) {
                this.collectedThrowableObjects[0].throw();
            }
            else if (this.collectedThrowableObjects.length < 1) {

            }
        }, 200);
    }

    playDeadChickenAnimation(enemy) {
        const deadChickenIntervalID = setInterval(() => {
            if (enemy.chickenBig == true) {   // diese Abfrage prüft, ob es sich um ein großes oder ein kleines Ckicken handelt, damit im Folgenden das richtige Bild des toten Chicken geladen werden kann
                enemy.loadImage(enemy.IMAGE_DEAD);
            } else {
                enemy.loadImage(enemy.IMAGE_DEAD_SMALL);
            }
            enemy.speed = 0;
        }, 200);

        setTimeout(() => {
            clearInterval(deadChickenIntervalID);
            this.deleteHitEnemy(enemy);
        }, 1500);
    }

    deleteHitEnemy(enemy) {  // deletes the hit enemy
        const indexOfEnemy = level.enemies.indexOf(enemy);
        if (indexOfEnemy !== -1) {
            level.enemies.splice(indexOfEnemy, 1);
            this.killedEnemies++;
        }
    }

    deleteThrownBottleFromArray() {
        this.collectedThrowableObjects.splice(1, 1);
    }

    deleteAllEnemies() {
        level.enemies.length = 0  //-- .length = 0 leert das Array
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(movingObject) {
        if (!movingObject) {
            console.error('movingObject is undefined');
            return;  // beendet die Funktion, falls das zuvor Geprüfte zutrifft.
        }
        if (movingObject.otherdirection) {  // diese Methode spiegelt das Bild auf dem Canvas -> Junus hat die Methode ergoogelt; kommt im Video Bild spiegeln
            this.flipImage(movingObject);
            this.otherdirection = true;
        }
        movingObject.draw(movingObject, this.ctx);
        movingObject.drawFrame(movingObject, this.ctx);

        if (movingObject.otherdirection) {  // diese Methode sorgt dafür, dass künftige Bilder nicht mehr gespiegelt werden.
            this.flipImageBack(movingObject);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}