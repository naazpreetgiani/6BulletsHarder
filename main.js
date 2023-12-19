// Click Detect Challenge

//Canvas Setup
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables
let mouseIsPressed = false;
let mouseX, mouseY;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let playerDirection = "up";
let bulletDirection = "up";

// Player Characteristics
let player = {
    x: cnv.width / 2,
    y: 550,
    r: 30,
    color: "blue"
};

let line = {
    w: 5,
    colour: "red",
    x1: player.x,
    y1: player.y,
    x2: player.x,
    y2: player.y - player.r
}

// Circles Array
let circles = [];
for (let n = 1; n <= 5; n++) {
    circles.push(randomCircle());
}

// Bullets Array
let bullets = [];

window.addEventListener("load", draw)

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // Draw Player
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI)
    ctx.fill();

    // Change player direction
    if (leftPressed) {
        player.x -= 7;
        playerDirection = "left";
    } else if (rightPressed) {
        player.x += 7;
        playerDirection = "right";
    } else if (upPressed) {
        player.y -= 7;
        playerDirection = "up";
    } else if (downPressed) {
        player.y += 7;
        playerDirection = "down";
    }

    // Draw line to detect the way player is facing
    ctx.lineWidth = line.w;
    ctx.strokeStyle =  `${line.colour}`;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();

    // Move line to see which direction the line is facing
    if (playerDirection === "up") {
        line.x2 = player.x;
        line.y2 = player.y - player.r;
        bulletDirection = "up";
    } else if (playerDirection === "down") {
        line.x2 = player.x;
        line.y2 = player.y + player.r;
        bulletDirection = "down";
    } else if (playerDirection === "left") {
        line.x2 = player.x - player.r;
        line.y2 = player.y;
        bulletDirection = "left";
    } else if (playerDirection === "right") {
        line.x2 = player.x + player.r;
        line.y2 = player.y;
        bulletDirection = "right";
    }

    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        drawCircle(circle);
        moveCircle(circle);
        
        // Check if player collides with circle
        let d = Math.sqrt((player.x - circle.x)**2 + (player.y - circles.y)**2);
        if (d < player.r + circle.r) {
          player.r += (circles.r / 8);
          console.log(circle.length);
          circles.splice(i, 1);
        }
    }

    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        drawBullet(bullet);
        moveBullet(bullet);

        for (let n = 0; n < circles.length; n++) {
            let circle = circles[n];
            let distance = Math.sqrt((bullet.x - circle.x) ** 2 + (bullet.y - circle.y) ** 2);

            if (distance <= bullet.r + circle.r) {
                // Handle collision, remove the bullet and circle
                bullets.splice(i, 1);
                circles.splice(n, 1);
            }
 
            if (bullet.y < 0) {
                bullets.splice(i, 1);
            }
        }   
    }

 requestAnimationFrame(draw);
}

//Circle Stuff

function drawCircle(aCircle) {
 ctx.lineWidth = 3;   
 ctx.strokeStyle = `${aCircle.c}`;
 ctx.beginPath();
 ctx.arc(aCircle.x, aCircle.y, aCircle.r, 0, 2 * Math.PI)
 ctx.stroke();
}

function moveCircle(aCircle) {
    aCircle.y += aCircle.ys;
    aCircle.x += aCircle.xs;

    //Check for collisions with canvas boundaries
    if (aCircle.x - aCircle.r < 0 || aCircle.x + aCircle.r > cnv.width) {
        aCircle.xs = -aCircle.xs;
    }

    if (aCircle.y - aCircle.r < 0 || aCircle.y + aCircle.r > cnv.height) {
        aCircle.ys = -aCircle.ys;
    }
}

function randomCircle() {
   return {
        x: randomInt(0, cnv.width),
        y: randomInt(0, cnv.height),
        r: randomInt(10, 50),
        xs: randomInt(1, 5),
        ys: randomInt(1, 5),
        c: randomRGB()
    }
}

// Bullet Stuff

function singleBullet() {
    return {
        x: player.x,
        y: player.y,
        r: 5,
        s: 3,
        c: "white"
    }
}  

function drawBullet(aBullet) {
    ctx.lineWidth = 3;   
    ctx.fillStyle = `${aBullet.c}`;
    ctx.beginPath();
    ctx.arc(aBullet.x, aBullet.y, aBullet.r, 0, 2 * Math.PI)
    ctx.fill();
}

function moveBullet(aBullet) {
    let distance = Math.sqrt((aBullet.x - player.x) ** 2 + (aBullet.y - player.y) ** 2);

    if (distance <= aBullet.r + player.r) {
        if (bulletDirection === "up") {
            aBullet.y -= aBullet.s;
        } else if (bulletDirection === "down") {
            aBullet.y += aBullet.s;
        } else if (bulletDirection === "left") {
            aBullet.x -= aBullet.s;
        } else if (bulletDirection === "right") {
            aBullet.x += aBullet.s;
        }
    }

    if (bulletDirection === "up") {
        aBullet.y -= aBullet.s;
    } else if (bulletDirection === "down") {
        aBullet.y += aBullet.s;
    } else if (bulletDirection === "left") {
        aBullet.x -= aBullet.s;
    } else if (bulletDirection === "right") {
        aBullet.x += aBullet.s;
    }
}

// Event Listeners & Handlers
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);

function keydownHandler(e) {
    //Check for keys pressed
  if (e.code === "ArrowLeft") {
        leftPressed = true;
    } else if (e.code === "ArrowRight") {
        rightPressed = true;
    }  else if (e.code === "ArrowUp") {
        upPressed = true;
    } else if (e.code === "ArrowDown") {
        downPressed = true;
    } 

    if (player.x - player.r < 0) {
        player.x = player.r;
    } else if (player.x + player.r > cnv.width) {
        player.x = cnv.width - player.r;
    }
}

function keyupHandler(e) {
    //Check for keys pressed
   if (e.code === "ArrowLeft") {
      leftPressed = false;
    } else if (e.code === "ArrowRight") {
      rightPressed = false;
    } else if (e.code === "ArrowUp") {
        upPressed = false;
    } else if (e.code === "ArrowDown") {
        downPressed = false;
    } 
}

function mousedownHandler() {
    mouseIsPressed = true;
    if (mouseIsPressed) {
        for (let i = 0; i < 1; i++) {
            bullets.push(singleBullet());
        }
        mouseIsPressed = false;
    }
    console.log(bullets.length);
}

function mouseupHandler() {
    mouseIsPressed = false;
}