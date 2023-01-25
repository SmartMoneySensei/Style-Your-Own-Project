// query selectors
let info = document.querySelector(".info");
const grid = document.querySelector(".grid");
let play = document.querySelector("#play");
let timer = document.querySelector("#timer");

// time variables
var seconds;
var minutes;

// object variables
const player = document.createElement("div");
let playerLeftSpace = 60;
let playerBottomSpace = 60;
let obstacleCount = 1;
let obstacles = [];
let firstObstacle;
let randomNumber;

// control state variables
let isJumping = false;
let isFalling = false;
let isDucking = false;

// timer id variables
let upTimerId;
let downTimerId;
let obstacleTimerId;

// random number function
function getRandomNumber() {
    return randomNumber = Math.random();
};

// start timer function
function startTimer() {
    timerTimerId = setInterval(() => {
        seconds += 1;
        if (seconds >= 0 && seconds <= 9) timer.textContent = minutes + ":" + "0" + seconds;
        if (seconds >= 10 && seconds <= 59) timer.textContent = minutes + ":" + seconds;
        if (seconds == 60) {
            minutes += 1;
            seconds = 0;
            timer.textContent = minutes + ":" + "0" + seconds;
        };
    }, 1000);
};

// reset timer function
function resetTimer() {
    seconds = 0;
    minutes = 0;
    timer.textContent = minutes + ":" + "0" + seconds;
};

// create player function
function createPlayer() {
    grid.appendChild(player);
    player.classList.add("player");
    player.style.left = 60 + "px";
    player.style.bottom = 60 + "px";
};

// obstacle class
class Obstacle {
    constructor(newObstacleLeft, newObstacleBottom) {
        this.left = newObstacleLeft;
        this.bottom = newObstacleBottom;
        this.visual = document.createElement("div");
        const visual = this.visual;
        visual.classList.add("obstacle");
        visual.style.left = this.left + "px";
        visual.style.bottom = this.bottom + "px";
        grid.appendChild(visual);
    };
};

// create obstacles function
function createObstacles() {
    if (obstacleTimerid = false) return;

    // randomly create ground or air obstacle
    getRandomNumber();
    if (randomNumber < .5) {
        // ground obstacle
        let newObstacle = new Obstacle(830, 60);
        obstacles.push(newObstacle);
    } else {
        // air obstacle
        let newObstacle = new Obstacle(830, 90);
        obstacles.push(newObstacle);
    };
};

// move obstacles function 
function moveObstacles() {
    obstacleTimerId = setInterval(() => {
        obstacles.forEach((obstacle) => {
            obstacle.left -= 20;
            let visual = obstacle.visual;
            visual.style.left = obstacle.left + "px";

            // player/obstacle collision
            obstacles.forEach((obstacle) => {
                if (
                    ((playerBottomSpace + 60) >= obstacle.bottom) &&
                    (playerBottomSpace <= (obstacle.bottom + 50)) &&
                    ((playerLeftSpace + 60) >= obstacle.left) &&
                    (playerLeftSpace <= (obstacle.left + 30))
                ) gameOver();
            });

            // delete obstacle
            if (obstacle.left < -60) {
                firstObstacle = obstacles[0].visual;
                firstObstacle.classList.remove("obstacle");
                obstacles.shift();

                // create new obstacle
                createObstacles()
            };
        });
    }, 30);
};

// jump function
function jump() {
    if (isJumping) return;
    if (isDucking) return;
    upTimerId = setInterval(() => {
        if (playerBottomSpace > 140) {
            clearInterval(upTimerId);
            downTimerId = setInterval(() => {
                if (playerBottomSpace <= 80) {
                    clearInterval(downTimerId);
                    isJumping = false;
                }
                playerBottomSpace -=20;;
                player.style.bottom = playerBottomSpace + "px";
            }, 30);
        };
        isJumping = true;
        playerBottomSpace += 20;
        player.style.bottom = playerBottomSpace + "px";
    }, 30);
};

// duck function
function duck() {
    if (isJumping) return;
    if (isFalling) return;
    isDucking = true;
    playerBottomSpace = 29;
    player.style.height = "30px";
}

// controls function
function control(e) {
    if (e.keyCode === 32) {
        if (e.repeat) return;
        jump();
    };
    if (e.key === "Shift") {
        duck();
        document.addEventListener("keyup", function (e) {
            if (e.key === "Shift") {
                if (isJumping) return;
                isDucking = false;
                playerBottomSpace = 60;
                player.style.height = "60px";
            };
        });
    };
};

// game over function
function gameOver() {

    // clear timer ids
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(obstacleTimerId);
    clearInterval(timerTimerId);

    // clear control states
    isJumping = false;
    isFalling = false;
    isDucking = false;

    // remove obstacles
    obstacles.forEach((i) => {
        firstObstacle = obstacles[0].visual;
        firstObstacle.classList.remove("obstacle");
        obstacles.shift();
    });

    // remove player
    player.remove();

    // stop timer
    if (seconds >= 0 && seconds <= 9) timer.textContent = minutes + ":" + "0" + seconds;
    if (seconds >= 10 && seconds <= 59) timer.textContent = minutes + ":" + seconds;

    // add play button
    info.appendChild(play);
};

// start function
function start() {

    // reset timer
    resetTimer();

    // remove play button
    play.remove();

    // start timer
    startTimer();

    // create and move obstacles
    createObstacles();
    moveObstacles();

    // create player
    createPlayer();

    // controls
    document.addEventListener("keydown", control);
}

// start the game
play.addEventListener("click", function() {
    start();
});