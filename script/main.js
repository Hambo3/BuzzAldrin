/* Resources
https://stackoverflow.com/questions/2432561/rotate-point-in-rectangle


*/



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


//map definition and levels
var map = {
		screen:{width:800, height:600}		
};

/*****************************/
var ctx;
var debug;

function Start(canvasBody)
{	
	// Create the canvas
	var canvas = document.createElement("canvas");
	if(canvas.getContext)
	{
		ctx = canvas.getContext("2d");
		canvas.width = map.screen.width;
		canvas.height = map.screen.height;

		var b = document.getElementById(canvasBody);
    	b.appendChild(canvas);

		//everything is drawn by this renderer
		Renderer = new PolyRenderer(ctx, {w:canvas.width, h:canvas.height});

		debug = new Debug({ctx:ctx});	

		init();
	}
}

function init()
{  
  var now = timestamp();	
	lastTime = now;
	
	gameAsset = new Game(map);
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
