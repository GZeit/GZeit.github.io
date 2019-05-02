var character;
var canvas;
var beta = 0;
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
    character = new piece(30, 30, 0, canvas.height - 30, "red");
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
    character.newPos();
    character.update();
}

function accelerate(n) {
    character.gravity = n;
}
function myFunction() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, c.height - 100, 100, 100);
  }