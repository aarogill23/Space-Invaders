// board

var tileSize = 32;
var rows = 16;
var cols = 16;

let board;
let boardWidth = tileSize * cols;
let boardHeight = tileSize * rows;
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * cols / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize;

//aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienCols = 3;
let alienCount = 0; 

let alienVelocityX = 1;

//weapon

let weaponArray = [];
let weaponVelocityY = -10; //Weapon speed

let score = 0;
let gameOver = false;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //context.fillStyle = "green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //load images
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function() {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "./alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
} 

function update(){
     if(gameOver){
        return;
     }

     
    

    requestAnimationFrame(update);

    
    context.clearRect(0,0, board.width, board.height);

    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //aliens
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if(alien.alive){
            alien.x += alienVelocityX;
            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                for(let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if(alien.y >= ship.y)
                gameOver = true;
        }
    }

    // weapons

    for(let i=0; i < weaponArray.length; i++){
        let weapon = weaponArray[i];
        weapon.y += weaponVelocityY;
        context.fillStyle = "red";
        context.fillRect(weapon.x, weapon.y, weapon.width, weapon.height);

        //bullet collison
        for(let k = 0; k < alienArray.length; k++){
            let alien = alienArray[k];
            if(!weapon.used && alien.alive && detectCollision(weapon, alien)){
                weapon.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }
    
    while(weaponArray.length > 0 && weaponArray[0].used || weaponArray[0].y < 0){
        weaponArray.shift();
    }

    //next level
    if(alienCount == 0){
        alienCols = Math.min(alienCols + 1, cols/2-2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2;
        alienArray = [];
        weaponArray = [];
        createAliens();
    }     

    //score

    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
   
}   



function moveShip(e){

    if(gameOver)
        return;

    if(e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0){
        ship.x -= shipVelocityX;
    }
    else if(e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width){
        ship.x += shipVelocityX;
    }

}

function createAliens(){
    for(let c = 0; c<alienCols; c++){
        for(let r = 0; r<alienRows; r++){
            let alien = {
                img : alienImg,
                x: alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e){

    if(gameOver)
        return;

    if (e.code == "Space"){
        let weapon = {
            x : ship.x + shipWidth * 15 / 32,
            y : ship.y,
            width : tileSize / 8,
            height : tileSize / 2,
            used : false
        }
        weaponArray.push(weapon);
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && 
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}