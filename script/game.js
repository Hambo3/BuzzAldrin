(function() {
    function Game(levelMap, type, titleScreen) {
        this.gameType = type;
        this.titleScreen = titleScreen;
        this.active = true;

        this.landscape = levelMap.terrain;//(type==0) ? Factory.Terrain(8, 2457) : Factory.Terrain(8, 2457);
        
        this.gravity = 1;
        var w = this.landscape[this.landscape.length-1].x;
        var r = w / levelMap.screen.width;
        var h = levelMap.screen.height * r;

        this.map = {width:w, height:h};
        this.offset = {x:0, y:0};

        this.minZoom = 1 / r;//this.scale;
        this.maxZoom = 1;
        this.scale = this.minZoom;

        this.zoomIn = false;
        this.zoomOut = false;

        this.celebrations = 
        [
            {
                success:["YOU MADE IT BUZZ",
                        "CONGRATULATIONS BUZZ, FIRST MAN ON THE MOON"],
                fail:[   
                    "YOU BROKE EVERY BONE IN YOUR BODY",
                    "THAT DIDNT QUITE WORK OUT THEN BUZZ",
                    "NEIL ARMSTONG BECOMES THE FIRST MAN ON THE MOON"
                    ]
            },
            {
                success:["THE EAGLE HAS LANDED"],
                fail:[   
                    "YOU CREATED A TWO MILE CRATER",
                    "THERE WERE NO SURVIVORS",
                    "YOU DESTROYED A 100 MEGATON LANDER"
                    ]
            }            
        ];

        this.buzz = new Buzz( 1500, 500, 0.07, 0.02, (type == 0) ? 300: 270,
            this.gameType, 
            this.celebrations[this.gameType],
            levelMap.safeZones);

        this.LM = (type == 0) ? new LM(1300, 400, -120 ,20, 6.5) : null;

        this.panel = new Panel(type);
        if(type == 1)
        {
             Sound.Play(Const.Sound.ambient);
        }
    };

    Game.prototype = {       
        Update: function(dt){

            if(this.zoomIn > 0){
                this.scale = Util.Lerp(this.scale, this.zoomIn, 0.01);
                if(this.scale > (this.zoomIn - 0.01))
                {
                    this.zoomIn = 0;
                }
            }
            if(this.zoomOut > 0){
                this.scale = Util.Lerp(this.scale, this.zoomOut, 0.01);
                if(this.scale < (this.zoomOut - 0.01))
                {
                    this.zoomOut = 0;
                }
            }

            Util.ScrollTo(this.buzz.x * this.scale, this.buzz.y * this.scale,
                {width:800, height:600}, 
                {width:this.map.width * this.scale, height:this.map.height * this.scale}, 
                this.offset, false);

            this.buzz.Update(dt, this.scale);    

            if(this.buzz.state == Const.State.enabled){
                var c = this.buzz.Check(this.landscape, this.offset);

                if(c.hits != 0){
                    this.buzz.InitContact(c);
                }
                this.panel.Update(this.buzz.dx, this.buzz.dy, this.buzz.fuel, c.dist, this.buzz.score);

                this.buzz.lemTd = this.panel.lemTd;                

                if(c.dist < 300){
                    this.zoomIn = 1;
                }
                else if(c.dist < 500){
                    this.zoomIn = 0.5;
                }

                else if(c.dist < 900){
                    this.zoomIn = 0.2;
                }                 
            }
            // else if(!this.zoomOut && this.buzz.state == Const.State.congrats)
            // {
            //     this.zoomOut = this.minZoom;
            // }

            if(this.LM){
                this.LM.Update(dt, this.scale);
            }

            if(this.buzz.state == Const.State.disabled){
                Sound.Stop(Const.Sound.ambient);
                this.titleScreen();
            }
            if(input.isUp('ESC'))
            {
                Sound.Stop(Const.Sound.ambient);
                this.titleScreen();
            }
        },
        Render: function(){    
            Renderer.Clear(25*32,19*32);
            Renderer.VectorLine(this.landscape, PAL[1], this.offset, this.scale);

            for (let i = 0; i < this.buzz.safeZones.length; i++) {
                var p = this.buzz.safeZones[i].index;
                var r = this.buzz.safeZones[i].rate;
                var x1 = (this.landscape[p-1].x * this.scale) - this.offset.x;
                var x2 = (this.landscape[p].x * this.scale) - this.offset.x;

                Renderer.DrawText(r+"X", x1 + ((x2-x1)/2)-6, 
                        (this.landscape[p-1].y * this.scale) - this.offset.y + 16,
                        "12px Arial");                           
            }

            this.buzz.Render(this.offset);  

            if(this.LM){
                this.LM.Render(this.offset);
            }

            this.panel.Render();
debug.Render(false, true);
        }
    };

    window.Game = Game;
})();
