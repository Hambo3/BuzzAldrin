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

var Renderer;

var state = Const.GameState.title;

//map definition and levels
var map= {
	screen:{width:800, height:600},
	maps:
	[
		{
			screen: {width:800, height:600},
			terrain: Factory.BuzzTerrain(8, 2457),
			safeZones:        
				[
					{index:27, rate:3},
					{index:44, rate:2},
					{index:52, rate:3}
				]		
		},
		{
			screen: {width:800, height:600},
			terrain: Factory.Terrain(8, 2457),
			safeZones:        
				[
					{index:46, rate:3},
					{index:72, rate:5},
					{index:89, rate:5},
					{index:103, rate:2},
					{index:120, rate:2},
					{index:133, rate:3}
				]		
		}
	]
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
		Sound = new AudioManager(
			[
				{
					key:Const.Sound.crash,
					src:"audio/collision.wav",
					type:"play"
				},
				{
					key:Const.Sound.thrust,
					src:"audio/thrust.wav",
					type:"play"
				},
				{
					key:Const.Sound.ambient,
					src:"audio/ambient.wav",
					type:"loop"
				},
				{
					key:Const.Sound.farts,
					src:[
						"audio/fart1.wav",
						"audio/fart2.wav",
						"audio/fart3.wav",
						"audio/fart4.wav",
						"audio/fart5.wav",
						"audio/fart6.wav",
						"audio/fart7.wav",
						"audio/fart9.wav",
						"audio/fart10.wav",
						"audio/fart11.wav",
						"audio/fart12.wav",
						"audio/fart13.wav"
					],
					type:"sequence"
				}				
			]);

		debug = new Debug({ctx:ctx});

		init();
	}
}

function GameStart(type){
	if(type==2){
		gameAsset = new BuzzIntro(GameStart);
	}
	else{
		gameAsset = new Game(map.maps[type], type, TitleScreen);
	}
}

function TitleScreen(){
	gameAsset = new Title(GameStart, 2);
}

function init()
{  
  var now = timestamp();	
	lastTime = now;
	
	gameAsset = new Title(GameStart, 0);

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
