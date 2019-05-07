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
var XINIT = 400;
var YINIT = 200;
//Width of charater
var CHARW = 20;
//height of character
var CHARH = 20;

var lastAlpha = 0;
var alpha = 0;
var alphaStart = 0;
var alphCalc = 0;
//var alphas = 0;
var refreshID;

var walls = [];
var numWall = 100;

var radius = 20;
var speed = 1;
// empfindlicher je kleiner
var sensitivity = 4;

var circles = [];
var score = 0;
circles[0] = new circle(800);
circles[1] = new circle(1000);
circles[2] = new circle(1200);
circles[3] = new circle(1400);
//circles[4] = new circle(2300);
function resetCircles(){
    speed = 1;
    circles.map(function (c){
        c.radius = c.r;
    });
} 


//collision 58 deg;

function circle(r){
    this.r = r;
    this.radius = r;
    var rand = Math.floor(Math.random() * 360);
    this.dStart = (300 + rand)% 360;
    this.dEnd = (0 + rand)% 360;
    this.rStart = this.dStart * Math.PI/180;
    this.rEnd = this.dEnd * Math.PI/180;
    this.draw = function(){
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.arc(400, 200, this.radius, this.rStart, this.rEnd, true);
        ctx.stroke();
    }
    this.newRadius = function(){
        if(this.radius > 1){
            this.radius = this.radius - speed;
        }else{
            score += speed;
            if(speed == 1 && score >= 10){
                speed +=1;
            }
            if(speed == 2 && score >= 30){
                speed +=1;
            }
            if(speed == 3 && score >= 60){
                speed +=1;
            }
            this.dStart = (300 + rand)% 360;
            this.dEnd = (0 + rand)% 360;
           /* while(this.dStart - this.dEnd != 60 && this.dstart + 360 - this.dEnd != 60){
                this.dStart = (0 + rand)% 360;
                this.dEnd = (300 + rand)% 360;
            };*/
            this.rStart = this.dStart * Math.PI/180;
            this.rEnd = this.dEnd * Math.PI/180;
            this.radius = 800;
        }
    }
}

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
    alpha = 0;
    lastAlpha = 0;
    alphCalc = 0;
    setScreen();
    score = 0;
    console.log("reset");
    resetCircles();
    console.log("unstuck");
    running = true;
    refresh = 10;
    alphaStart = alpha;
    player = new character();
}

function draw(){
    if(running) {
        setScreen();
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Restore the transform
        ctx.fillStyle = "black";
        circles.map(function (c){
            c.newRadius();
            c.draw();
            //console.log("drew Radius ", c.radius);
        });
        ctx.restore();
        
       // ctx.clearRect(0, 0, canvas.width, canvas.height);  
        player.newPos();
        player.update();
        player.collision();
    } else {
        clearInterval(refreshID);		
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.parentNode.removeChild(canvas);					
        showInfoScreen("Score: "+ score +" zum Wiederholen klicken.");
    }
    
}



function character(){

    this.posX = XINIT;
    this.posY = YINIT;
    this.a;
    //alphaStart = alpha;

    this.newPos = function(){
        this.a = (alpha - alphaStart) % 360;
        if (this.a < 0){
            this.a += 360;
        }
      //  console.log("alpha: ", this.a);
       // console.log("alpha: ", alphas, " old: ", lastAlpha);
       // console.log("x: ", this.posX, " y: ", this.posY);
        alphCalc = this.a - lastAlpha;
        if(Math.abs(alphCalc) < 1) {
            alphCalc = 0;
        };
        lastAlpha = this.a;
    };

    this.collision = function(){ 
        circles.map(function(c){
            if(c.radius < 30 && c.radius > 10){
              /*  this.a = alpha % 360;
                if (this.a < 0){
                    this.a += 360;
                }*/
                var ag = 360 - a;
                console.log("alpha G: ", ag);
                console.log("start: ", c.dStart, "end: ", c.dEnd);
                var b =  c.dEnd - c.dStart;
                if(b == 60){
                    if(!(ag < c.dEnd && ag > c.dStart)){
                        running = false;
                    }else {

                    }
                }else{
                    console.log("not 60");
                    if(!(ag < c.dEnd || ag > c.dStart)){
                        running = false;
                    }else {

                    }
                }
            }
        });
    };
    
    this.update = function(){
        ctx.fillStyle = "red"; 

        ctx.translate(400, 200);
        ctx.rotate(-alphCalc * Math.PI/180);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(0, 0, radius, 0 , 2 * Math.PI);
        ctx.stroke();
        ctx.translate(-400, -200);
        //ctx.fillRect(this.posX, this.posY, CHARW, CHARH);
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(XINIT + radius, YINIT, 10, 0 , 2 * Math.PI);
        ctx.fill();
 
    };

}



var orientation = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;


if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (event){
        alpha = event.alpha;
    }, true)
} else {
    alert("Sorry, ihr Gerät unterstützt keine Bildschirmorientierung!");
}

window.addEventListener("keydown", function (event){
    if(event.keyCode == 37){
        alpha = alpha + 5;
    }
    if(event.keyCode == 39){
        alpha = alpha - 5;
    }
}, true)



