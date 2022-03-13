const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
//Yang Aku Tambah = Alka
const foodImg = new Image();
foodImg.src = "assets/apple.png";
const foodImg2 = new Image();
foodImg2.src = "assets/nyawa.png";
const kepala = new Image();
kepala.src = "assets/ular.png";
const bodi = new Image();
bodi.src = "assets/body.png";
//Sampai Disini
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 120;
let countEatApple = 0;
let level = 1;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

let snake1 = {
    color: "red",
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
}
//let snake2 = initSnake("yellow");
let snake2 = {
    color: "blue",
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
}
let apple = {
    color: "red",
    position: initPosition(),
}
let nyawa = {
    color: "blue",
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else if (snake.color == snake2.color) {
        scoreCanvas = document.getElementById("scoreHeart");
    } else {
        scoreCanvas == document.getElementById("score3Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        //Draw snake kedua
        drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color);
        for (let i = 1; i < snake2.body.length; i++) {
            drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color);
        }
        //Yang Diubah itu drawCell menjadi ctx.drawImage()
        ctx.drawImage(kepala, snake1.head.x * CELL_SIZE, snake1.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        //loop
        for (let i = 1; i < snake1.body.length; i++) {
            ctx.drawImage(bodi, snake1.body[i].x * CELL_SIZE, snake1.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        //Sampai Disini

        // Ini Untuk Apple
       
        ctx.drawImage(foodImg, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        //sampai disini
        //ini untuk nyawa
        ctx.drawImage(foodImg2, nyawa.position.x * CELL_SIZE, nyawa.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        drawScore(snake1);
        drawScore(snake2);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple, nyawa) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        countEatApple++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        if (countEatApple === 5) {
            countEatApple = 0
            level++;
            var audio = new Audio('assets/naik-level.mp3');
            audio.play();
            setTimeout(() => {
                alert(`Level up, selamat kamu berhasil ke level selanjutnya ${level}`);
            }, 300)
        }
        if (level === 5) {
            // final game
            level = 1;
            countEatApple = 0
            var audio = new Audio('assets/naik-level.mp3');
            audio.play();
            setTimeout(() => {
                alert("Game selesai");
            }, 300)
            countEatApple = 0
            level = 1
            snake1 = initSnake("purple");
            snake2 = initSnake("blue");
        }
    }
    if (snake.head.x == nyawa.position.x && snake.head.y == nyawa.position.y) {
        nyawa.position = initPosition();
        snake.score++;
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple, nyawa);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple, nyawa);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple, nyawa);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple, nyawa);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        // Add game over audio:
        var audio = new Audio('assets/game-over.mp3');
        audio.play();
        setTimeout(() => {
            alert("Game over");
        }, 300)
        countEatApple = 0
        level = 1
        snake1;
        snake2 = initSnake("blue");
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    setTimeout(function() {
        move(snake);
    }, MOVE_INTERVAL);
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    //dict
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }

    if (event.key === "a") {
        turn(snake2, DIRECTION.LEFT);
    } else if (event.key === "d") {
        turn(snake2, DIRECTION.RIGHT);
    } else if (event.key === "w") {
        turn(snake2, DIRECTION.UP);
    } else if (event.key === "s") {
        turn(snake2, DIRECTION.DOWN);
    }
})

move(snake1);
move(snake2);