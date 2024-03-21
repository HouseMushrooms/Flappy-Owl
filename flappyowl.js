//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 56; //width/height ration = 280/310 = 28/31
let birdHeight = 62;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 66; //width/height ratio = 110/920 = 11/92
let pipeHeight = 552;
let pipeX = boardWidth; 
let pipeY = 0;

let topTrashcanImg;
let bottomTrashcanImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

//game over and win
let gameOver = false;
let score = 0;
let gameWin = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used to draw on the board

    //draw flappy owl
   // context.fillStyle = "blue";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./flappyowl.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topTrashcanImg = new Image();
    topTrashcanImg.src = "./toptrashcan.png";

    bottomTrashcanImg = new Image();
    bottomTrashcanImg.src = "./bottomtrashcan.png";

    requestAnimationFrame(update);
    setInterval(placeTrashcans, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
   //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height-60){
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++){
        let trashcan = pipeArray[i];
        trashcan.x += velocityX;
        context.drawImage(trashcan.img, trashcan.x, trashcan.y, trashcan.width, trashcan.height);

        if(!trashcan.passed && bird.x > trashcan.x + trashcan.width){
            score += 0.5; //2 (trahscans)*0.5 = 1 score per set of pipes
            trashcan.passed = true;
        }

        if (detectCollision(bird, trashcan)){
            gameOver = true;
        }
    }
   //clear
   while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth-10){
        pipeArray.shift(); //remove first element from the array
   }

    //score
    context.fillStyle = "white";
    context.font = "45px Helvetica";
    context.fillText(score, 5, 45);

    if(score == 10){
        gameWin = true;
    }

    if(gameOver){
        context.fillText("GAME OVER", 45, boardHeight/2);
    }
    context.fillStyle = "white";
    context.font = "30px Helvetica";
    if(gameOver){
        context.fillText("Tap to Play Again!", 55, 370);
    }

}



function placeTrashcans(){
    if (gameOver){
        return;
    }
    //(0-1) * pipeHeight/2
    //0 -> -138 (pipeHeight/4)
    //1 -> - 138 - 276 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topTrashcan = {
        img : topTrashcanImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topTrashcan);

    let bottomTrashcan = {
        img : bottomTrashcanImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width :pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomTrashcan);
}

function moveBird(e){
        velocityY = -6;

    //reset game
    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a,b){
    return  a.x < b.x + b.width-10 &&
            a.x + a.width-15 > b.x &&
            a.y < b.y + b.height-10 &&
            a.y + a.height-25 > b.y;

}