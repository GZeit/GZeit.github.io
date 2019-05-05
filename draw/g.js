var canvas;

var ctx;

var ratio;

var score;

var refresh = 10;

var accX = 0;
var accY = 0;
//var accXs = 0;
//var accYs = 0;

var oldAccX;
var oldAccY;

var running = false;
var won = false;

var player;
var XINIT = 675;
var YINIT = 315;
//Width of charater
var CHARW = 100;
//height of character
var CHARH = 20;

var lastAlpha = 0;
var alpha = 0;
var alphaStart;
//var alphas = 0;
var refreshID;

var walls = [];
var numWall = 100;

// empfindlicher je kleiner
var sensitivity = 4;


function wall(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.draw = function(){
        ctx.fillRect(x, y, w, h);
    };
}

walls[0] = new wall(650, 250, 10, 150);
walls[1] = new wall(650, 390, 150, 10);
walls[2] = new wall(790, 0, 10, 400);
walls[3] = new wall(650, 250, 80, 10);
walls[4] = new wall(0, 250, 10, 150);
walls[5] = new wall(0, 390, 150, 10);
walls[6] = new wall(140, 250, 10, 150);


function showInfoScreen(txt){
    var showDiv = document.createElement('div');
    showDiv.id = "showDiv";
    showDiv.style.height = 400;
    showDiv.style.textDecoration = "underline";
    showDiv.style.textAlign = "center";
    showDiv.style.paddingTop = "100px";
    showDiv.style.background = "#f0ffff";
    document.body.appendChild(showDiv);
    var btnText = document.createTextNode(txt);
    showDiv.appendChild(btnText);
    showDiv.addEventListener("click", function() {	
        showDiv.parentNode.removeChild(showDiv);
        initCanvas();
        init();
        //Startet Bildschirmwiederholung für Spiel
        refreshID = setInterval(draw, refresh);
        canvas.webkitRequestFullScreen();                
    }, false);
}

function initCanvas(){
    canvas = document.createElement('canvas');		
    canvas.id = "myCanvas";
    canvas.width = "800";
    canvas.height = "400";
    canvas.style = "border:3px solid #61210B;";		
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
}

function setScreen(){
    var width = canvas.width;
    var height = canvas.height;                   
    ratio = width / height;
    var heightval;
    var widthval;

    if ((window.innerWidth / window.innerHeight) < ratio) {
        widthval = window.innerWidth - 16;
        heightval = (widthval / ratio) - 16;
        canvas.style.height = heightval + "px";
        canvas.style.width = widthval + "px";
    } else {
        heightval = window.innerHeight - 16;
        widthval = (heightval * ratio) - 16;
        canvas.style.height = heightval + "px";
        canvas.style.width = widthval + "px";
    }		
}

function init(){
    setScreen();
    //Timer starten für Spielzeit
    score = new Date();
    
    //Trägheit des Balles
    //ballInertiax = BALLINERTIA;
    //ballInertiay = BALLINERTIA;

    //Trägheitsbehaftete Beschleunigung
    //phoneTilt = accel * ballInertia;
  //  phoneTiltx = 0;
  //  phoneTilty = 0;

    //Aktuell ausgelesene Beschleunigung aus dem Beschleunigungssensor

    //Beschleunigung im letzten Intervall
    // aktuelle Beschleunigung * letzte < 0 bedeutet Richtungsänderung

    //Position des Balls
   // x = XINIT;
   // y = YINIT;

    //Hindernis mit dem der Ball im letzten Intervall kollidiert ist
   // lastBrickx = -1;
   // lastBricky = -1;			
    
    running = true;
    won = false;
   // pocketed = false;
    refresh = 10;
    //alphaStart = alpha;
    alphaStart = 0;
    player = new character();
}

function draw(){
    if(running) {
        setScreen();
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "black";
        walls.map(function (w){
            w.draw();
        });

        // Restore the transform
        ctx.restore();
        
       // ctx.clearRect(0, 0, canvas.width, canvas.height);  
        player.newPos();
        player.update();
        player.collision();
    } else {
        if(won){
            clearInterval(refreshID);		
			canvas.parentNode.removeChild(canvas);					
			showInfoScreen("Gewonnen! Zeit: " + setStopWatch() + " zum Wiederholen klicken.");
        }else{
            clearInterval(refreshID);		
			canvas.parentNode.removeChild(canvas);					
            showInfoScreen("Verloren! um Wiederholen klicken.");
        }
    }
}

function drawCharacter(){
    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
}

function character(){

    this.posX = XINIT;
    this.posY = YINIT;

 /*   this.coord = [
        {x: this.posX - (CHARW/2), y: this.posY + (CHARH/2)}, 
        {x: this.posX + (CHARW/2), y: this.posY + (CHARH/2)},
        {x: this.posX + (CHARW/2), y: this.posY - (CHARH/2)},
        {x: this.posX - (CHARW/2), y: this.posY - (CHARH/2)}
    ];*/

    
    this.alphaCalc = 0;
   /* this.xMax = Math.max(this.coord[0].x, this.coord[1].x, this.coord[2].x, this.coord[3].x);
    this.xMin = Math.min(this.coord[0].x, this.coord[1].x, this.coord[2].x, this.coord[3].x);
    this.yMax = Math.max(this.coord[0].y, this.coord[1].y, this.coord[2].y, this.coord[3].y);
    this.yMin = Math.min(this.coord[0].y, this.coord[1].y, this.coord[2].y, this.coord[3].y);*/

    this.newPos = function(){
       // console.log("alpha: ", alphas, " old: ", lastAlpha);
        var aRad =  alpha * Math.PI/180;
        var sinA = Math.sin(aRad);
        var cosA = Math.cos(aRad); 
       // console.log("sin: ", sinA, " cos: ", cosA);
        var speedX = Math.round(accX/sensitivity);
        var speedY = Math.round(accY/sensitivity);
        this.posX = this.posX + cosA * speedX + sinA * speedY;
        this.posY = this.posY - sinA * speedX + cosA * speedY;
       // console.log("x: ", this.posX, " y: ", this.posY);

        this.alphCalc = alpha - lastAlpha;
        if(Math.abs(this.alphCalc) < 1) return;
        lastAlpha = alpha;
      /*  var aRad =  alphCalc * Math.PI/180;
        var sinA = Math.sin(aRad);
        var cosA = Math.cos(aRad); */
       // console.log(sinA);
     /*    this.coord.map(function(co){
            co.x = co.x - player.posX;
            co.y = co.y - player.posY;
        });
      //  console.log("--Map: ", this.coord[0].x, " ", this.coord[0].y," ", this.coord[1].x," ", this.coord[1].y," ", this.coord[2].x," ", this.coord[2].y," ", this.coord[3].x," ", this.coord[3].y);
        this.coord.map(function(co) {
            co.x = (cosA * co.x) - (sinA * co.y);
            co.y = (sinA * co.x) + (cosA * co.y);
        });
       // console.log("----Map: ", this.coord[0].x, " ", this.coord[0].y," ", this.coord[1].x," ", this.coord[1].y," ", this.coord[2].x," ", this.coord[2].y," ", this.coord[3].x," ", this.coord[3].y); 
       this.coord.map(function(co){
           // co.x = Math.round(co.x) + player.posX;
           // co.y = Math.round(co.y) + player.posY;
           co.x = co.x + player.posX;
           co.y = co.y + player.posY;
        });
       // console.log("--------Map: ", this.coord[0].x, " ", this.coord[0].y," ", this.coord[1].x," ", this.coord[1].y," ", this.coord[2].x," ", this.coord[2].y," ", this.coord[3].x," ", this.coord[3].y);
     */
    };

    this.collision = function(){
      /*  if(alpha < 0){
            alpha = 360 - alpha;
        }
        if(alpha >= 360){
            alpha = alpha -380
        }*/
        var aRad =  alpha * Math.PI/180;
        var sinA = Math.sin(aRad);
        var cosA = Math.cos(aRad);
        console.log("alpha: ",alpha, " sinA: ", sinA, " cosA: ", cosA);
        var coord = [
            {x:  - (CHARW/2), y:  + (CHARH/2)}, 
            {x:  + (CHARW/2), y:  + (CHARH/2)},
            {x:  + (CHARW/2), y:  - (CHARH/2)},
            {x:  - (CHARW/2), y:  - (CHARH/2)}
        ];
        coord.map(function(co){
            co.x = (cosA * (co.x) - (sinA * co.y));
            co.y = (sinA * (co.x) + cosA * (co.y));
        });
        var d = [
            {x: (coord[0].x - coord[1].x), y: (coord[0].y - coord[1].y)},
            {x: (coord[1].x - coord[2].x) , y: (coord[1].y - coord[2].y)} //,
          //  {x: coord[2].x - coord[3].x , y: coord[2].y - coord[3].y},
          //  {x: coord[3].x - coord[0].x , y: coord[3].y - coord[0].y}          
        ];

        coord.map(function(co){
            co.x = co.x + player.posX + (CHARW/2);
            co.y = co.y + player.posY + (CHARH/2);
        });

        xMax = Math.max(coord[0].x, coord[1].x, coord[2].x, coord[3].x);
        xMin = Math.min(coord[0].x, coord[1].x, coord[2].x, coord[3].x);
        yMax = Math.max(coord[0].y, coord[1].y, coord[2].y, coord[3].y);
        yMin = Math.min(coord[0].y, coord[1].y, coord[2].y, coord[3].y);
        
        
        var a = Math.pow(d[0].x,2) + Math.pow(d[0].y,2);

        d.map(function (e){
            e.x = e.x / a;
            e.y = e.y / a;
        })

        var xProjMaxA = Math.max(
            coord[0].x * d[0].x + coord[0].y * d[0].y,
            coord[1].x * d[0].x + coord[1].y * d[0].y,
            coord[2].x * d[0].x + coord[2].y * d[0].y,
            coord[3].x * d[0].x + coord[3].y * d[0].y
        );
        var xProjMinA = Math.min(
            coord[0].x * d[0].x + coord[0].y * d[0].y,
            coord[1].x * d[0].x + coord[1].y * d[0].y,
            coord[2].x * d[0].x + coord[2].y * d[0].y,
            coord[3].x * d[0].x + coord[3].y * d[0].y
        );

        var xProjMaxB = Math.max(
            coord[0].x * d[1].x + coord[0].y * d[1].y,
            coord[1].x * d[1].x + coord[1].y * d[1].y,
            coord[2].x * d[1].x + coord[2].y * d[1].y,
            coord[3].x * d[1].x + coord[3].y * d[1].y
        );
        var xProjMinB = Math.min(
            coord[0].x * d[1].x + coord[0].y * d[1].y,
            coord[1].x * d[1].x + coord[1].y * d[1].y,
            coord[2].x * d[1].x + coord[2].y * d[1].y,
            coord[3].x * d[1].x + coord[3].y * d[1].y
        );
        

        walls.map(function (wa){
            console.log(wa.x, " + ", wa.w, " < xMin: ", xMin);
            console.log(wa.x, "> xMax: ", xMax);
            console.log(wa.y, " + ", wa.h, "< yMin: ", yMin);
            console.log(wa.y, "> yMax: ", yMax);
            console.log(coord[0].y, " --- ", coord[1].y, " --- ", coord[2].y, " --- ", coord[3].y);
            if((((wa.x + wa.w) < xMin) || (wa.x > xMax)) || (((wa.y + wa.h) < yMin) || (wa.y > yMax))){
                console.log("AABB FAULT");   
            }else{
                        
                var maxW = Math.max(
                    wa.x *          d[0].x + wa.y *          d[0].y,
                    (wa.x + wa.w) * d[0].x + wa.y *          d[0].y,
                    wa.x *          d[0].x + (wa.y + wa.h) * d[0].y,
                    (wa.x + wa.w) * d[0].x + (wa.y + wa.h) * d[0].y
                );
                
                var minW = Math.min(
                    wa.x *          d[0].x + wa.y *          d[0].y,
                    (wa.x + wa.w) * d[0].x + wa.y *          d[0].y,
                    wa.x *          d[0].x + (wa.y + wa.h) * d[0].y,
                    (wa.x + wa.w) * d[0].x + (wa.y + wa.h) * d[0].y
                    
                );
                console.log(d[0].x, " ", d[0].y);
                console.log("maxW: ",maxW, " minW: ",minW, " ProjAmax: ", xProjMaxA, " ProjAmin: ", xProjMinA);
                if(minW <= xProjMaxA || maxW >= xProjMinA){
                    
                    maxW = Math.max(
                        wa.x *          d[1].x + wa.y *          d[1].y,
                        (wa.x + wa.w) * d[1].x + wa.y *          d[1].y,
                        wa.x *          d[1].x + (wa.y + wa.h) * d[1].y,
                        (wa.x + wa.w) * d[1].x + (wa.y + wa.h) * d[1].y
                    );
                    minW = Math.min(
                        wa.x *          d[1].x + wa.y *          d[1].y,
                        (wa.x + wa.w) * d[1].x + wa.y *          d[1].y,
                        wa.x *          d[1].x + (wa.y + wa.h) * d[1].y,
                        (wa.x + wa.w) * d[1].x + (wa.y + wa.h) * d[1].y
                    );
                    if(minW <= xProjMaxB || maxW >= xProjMinB) {
                        console.log("Projection faulty");
                        running = false;
                    }
                }   
            }
        })
        

    };
    
    this.update = function(){
        ctx.fillStyle = "red"; 

        ctx.translate(this.posX + CHARW/2, this.posY + CHARH/2);
        ctx.rotate(this.alphCalc * Math.PI/180);
        ctx.translate(-this.posX - CHARW/2, -this.posY - CHARH/2);

        ctx.fillRect(this.posX, this.posY, CHARW, CHARH);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posX + CHARW/2, this.posY + CHARH/2, CHARH/2, 0 , 2 * Math.PI);
        ctx.fill();
 
      /*  ctx.beginPath();
        ctx.fillStyle = "red"; 
        console.log("draw: ", this.coord[0].x, " ", this.coord[0].y," ", this.coord[1].x," ", this.coord[1].y," ", this.coord[2].x," ", this.coord[2].y," ", this.coord[3].x," ", this.coord[3].y);
        ctx.moveTo(this.coord[0].x, this.coord[0].y);
        ctx.lineTo(this.coord[1].x, this.coord[1].y);
        ctx.lineTo(this.coord[2].x, this.coord[2].y);
        ctx.lineTo(this.coord[3].x, this.coord[3].y);
        ctx.fill();*/

    };

}
function triangle(){
    this.x1 = XINIT - 10;
    this.x2 = XINIT + 10;
    this.x3 = XINIT;

    this.y1 = YINIT - 5;
    this.y2 = YINIT - 5;
    this.y3 = YINIT + 15;

    this.xMax = Math.max(this.x1, this.x2, this.x3);
    this.xMin = Math.min(this.x1, this.x2, this.x3);
    this.yMax = Math.max(this.y1, this.y2, this.y3);
    this.yMin = Math.min(this.y1, this.y2, this.y3);

    this.newPos = function(){

    };
    
    this.update = function(){
        ctx.beginPath();
        ctx.fillStyle = "red"; 
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.fill();
    };

}



/*window.addEventListener("deviceorientation", handleOrientation, true);
handleOrientation = function(event){
  //var alpha    = event.alpha;
  beta = event.beta;
  //var gamma    = event.gamma;
}*/
var GameScreen = {
    canvas : document.getElementById("myCanvas"),
    start : function(){
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateCanvas, 20);
    },
    stop : function(){
        clearInterval(this.Interval);
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var orientation = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;


function startGame() {
  /*  if (orientation === "landscape-primary") {
        console.log("That looks good.");
        character = new piece(30, 30, 0, canvas.height - 30, "red");
        GameScreen.start();
      } else if (orientation === "landscape-secondary") {
        console.log("Mmmh... the screen is upside down!");
      } else if (orientation === "portrait-secondary" || orientation === "portrait-primary") {
        console.log("Mmmh... you should rotate your device to landscape");
      } else if (orientation === undefined) {
        console.log("The orientation API isn't supported in this browser :("); 
      }*/
    player = new piece(30, 30, 0, canvas.height - 30, "red");
    GameScreen.start();
}

/*var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);        
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}*/

function piece(width, height, x, y, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.xMax = canvas.width - this.width;
    
    this.update = function(){
        ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos= function(){
        if(beta > 45){
            this.x = xMax;
            return;
        }
        if(beta < -45){
            this.x = 0;
            return;
        }
        this.x = ((Math.round(beta) + 45)/90)*(this.xMax);
    }
}

/*function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
}*/

function updateCanvas() {
    GameScreen.clear();
    player.newPos();
    player.update();
}

function accelerate(n) {
    player.gravity = n;
}
function myFunction() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, c.height - 100, 100, 100);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("devicemotion", function (event) {
       accX = event.accelerationIncludingGravity.x * (-1);
       accY = event.accelerationIncludingGravity.y * (.1);
    }, true);
    window.addEventListener("deviceorientation", function (event){
        alpha = event.alpha;
    }, true)
} else {
    alert("Sorry, ihr Gerät unterstützt keine Bildschirmorientierung!");
}

window.addEventListener("keydown", function (event){
    if(event.keyCode == 37){
        alpha = alpha - 5;
    }
    if(event.keyCode == 39){
        alpha = alpha + 5;
    }
    if(event.keyCode == 87){
        accY = -5;
    }
    if(event.keyCode == 65){
        accX = -5;
    }
    if(event.keyCode == 83){
        accY = 5;
    }
    if(event.keyCode == 68){
        accX = 5;
    }
}, true)


window.addEventListener("keyup", function (event){
    if(event.keyCode == 87){
        accY = 0;
    }
    if(event.keyCode == 65){
        accX = 0;
    }
    if(event.keyCode == 83){
        accY = 0;
    }
    if(event.keyCode == 68){
        accX = 0;
    }
}, true)
