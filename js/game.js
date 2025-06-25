let level;
let canvas;
let world;
let keyboard = new Keyboard();
let pauseGameBtn = document.getElementById('pauseGameBtn');
let gameStarted = false;  // diese Variable wird benötigt, um, wenn die "pause-game-btns" wieder angezeigt werden sollen, um zu überprüfen, ob das Spiel bereits gestartet wurde, da sie sonst direkt zum Start des Spiels angezeigt werden würden. 
let gamePaused = false;
let mobileWindow;
let deviceVertical;
let showMobileAboutMenuVar = false;  // diese Variable wird benötigt, um den Toggle-Button des Hamburger-Menus bzw. das "X" zum Schließen in der Funktion "showMobileAboutMenu()" zu regeln
let checkIfLevel2 = false;
let deviceWasTurned = false;
let buttonBoardShown = true;

function init() {
    shrinkStartImage();
    bindBtnsPressEvents();
    fullScreenMobile();

    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level') || '1'; // Standardmäßig Level 1

    if (level === '2') {
        startLevel2();
    } else {
        startLevel1();
    }
}

function startLevel1() {
    level = level1;
}

function startLevel2() {
    level = level2;
    testIfLevel2 = true;
}

function showLevelSelection() {
    setTimeout(() => {
        document.getElementById('outerMobileLevelSelectionDiv').classList.remove('d-none');
        document.getElementById('mobileLevelSelectionDiv').classList.remove('d-none');
    }, 10000);
}

function showLevelSelectionFast() {
    document.getElementById('outerMobileLevelSelectionDiv').classList.remove('d-none');
    document.getElementById('mobileLevelSelectionDiv').classList.remove('d-none');
}

function hideMobileLevelSelectionDiv() {
    document.getElementById('outerMobileLevelSelectionDiv').classList.add('d-none');
    document.getElementById('mobileLevelSelectionDiv').classList.add('d-none');
}

function shrinkStartImage() {
    setTimeout(() => {
        document.getElementById('startGameBtn').classList.remove('d-none');
    }, 2400);
}

function startGame() {
    document.getElementById('startImg').classList.add('d-none');
    document.getElementById('startGameBtn').classList.add('d-none');
    document.getElementById('pauseEndGameBtns').classList.remove('d-none');
    document.getElementById('pauseEndGameBtns').classList.add('pause-end-game-btns');
    document.getElementById('soundBtn').classList.remove('d-none');
    document.getElementById('soundBtn').classList.add('soundBtn');
    startCanvas();
    loadSoundSettings();
    playBackgroundMusic();
    gameStarted = true;
}

function playBackgroundMusic() {
    setInterval(() => {
        const mutedSetting = localStorage.getItem('isMuted');  //-- testen, ob der Sound an oder aus sein sollte
        if (mutedSetting === 'false') {
            world.background_sound.play();
            world.background_sound.loop = true;
            world.background_sound.volume = 0.18;
            world.background_sound.playbackRate = 1;
        }
    }, 200);
}

function changeSondSettings() {
    if (world.isMuted == false) {
        world.isMuted = true;
        showMutedImg();
        muteSound();
        localStorage.setItem('isMuted', 'true'); // speichern
    } else if (world.isMuted == true) {
        world.isMuted = false;
        showSoundImg();
        amplifySound();
        localStorage.setItem('isMuted', 'false'); // speichern
    }
}

function loadSoundSettings() {
    const mutedSetting = localStorage.getItem('isMuted');
    if (mutedSetting === 'true') {
        world.isMuted = true;
        showMutedImg();
        muteSound();
    } else {
        world.isMuted = false;
        showSoundImg();
        amplifySound();
    }
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }

});