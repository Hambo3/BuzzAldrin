/* Resources
https://stackoverflow.com/questions/2432561/rotate-point-in-rectangle

velocity_X = velocity*cos(angle)
velocity_Y = velocity*sin(angle)

calculateAngle: function() {
              sinAngle = Math.sin(this.anims.idle.angle);
              cosAngle = Math.cos(this.anims.idle.angle);
              bulletX = (this.pos.x + this.halfWidth) + (47 * sinAngle);
              bulletY = (this.pos.y + 47) - (47 * cosAngle);
              return {x: bulletX, y: bulletY, sin: sinAngle, cos: cosAngle};
  },
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
var titleAsset;
var Renderer;

var state = Const.GameState.title;

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
	titleAsset = new Title();
	gameAsset.active = false;
	titleAsset.active = true;
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
	if(state == Const.GameState.title){

		if(titleAsset.state != 0){
			if(titleAsset.state == 1){
				gameAsset.Start();	
				titleAsset.state = 0;
				state = Const.GameState.buzzActive;	
			}
		}
	}
	else if(state == Const.GameState.buzzActive){
		if(!gameAsset.active){
			gameAsset.Stop();	
			titleAsset.state = 0;
			titleAsset.active = true;
			state = Const.GameState.title;	
		}
	}

	gameAsset.Update(dt);
	titleAsset.Update(dt);
};

function render() {	
	gameAsset.Render();
	titleAsset.Render();
};

window.onload = function() {
	Start("canvasBody");
}
