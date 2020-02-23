var rf = (function(){
  return window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(cb){
          window.setTimeout(cb, 1000 / 60);
      };
})();

var lastTime;
var now;
var dt = 0;
var fps = 60;
var step = 1 / fps;

var gameAsset;
var Renderer;

var fileSource=	[{ src:'content/testSheet1.png', tag:"test" }];

//sprite definitions
var spriteDef = {
	'one':{ tag:"test", src:[{x:0,y:0},{x:64,y:0}],w:64,h:64}
};


//map definition and levels
var map = {
	width:640, height:480
};


/*****************************/
var ctx;
function Start(canvasBody)
{	
	// Create the canvas
	var canvas = document.createElement("canvas");
	if(canvas.getContext)
	{
		ctx = canvas.getContext("2d");
		canvas.width = map.width;
		canvas.height = map.height;

		var b = document.getElementById(canvasBody);
    	b.appendChild(canvas);

		//everything is drawn by this renderer
		Renderer = new SpriteRenderer(ctx, 
			{
				spritesheet:fileSource,
				spriteData:spriteDef,
				onReady:init
			});

	}
}

function init()
{  
  var now = timestamp();	
	lastTime = now;
	
	gameAsset = new Game();
	FixedLoop();  
}

function FixedLoop(){
	now = timestamp();
	dt = dt + Math.min(1, (now - lastTime) / 1000);
	while (dt > step) {
	  dt = dt - step;
	  update(step);
	}

	render();
				
	lastTime = now;
	rf(FixedLoop);	
}

function timestamp() {
	var wp = window.performance;
	return wp && wp.now ? wp.now() : new Date().getTime();
}

// Update game objects
function update(dt) {
	gameAsset.Update(dt);
};

function render() {
	gameAsset.Render();
};

window.onload = function() {
	Start("canvasBody");
}
