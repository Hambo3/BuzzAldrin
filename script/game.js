(function() {
    function Game(levelMap) {
        this.active = false;
        this.landscape = Factory.Terrain(8, 2457);
        
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

        this.buzz = new Buzz( 1500, 500, 0.07, 0.04 );
        this.panel = new Panel();
    };

    Game.prototype = {       
        Start: function(){
            this.buzz = new Buzz( 1500, 500, 0.07, 0.04 );//.state = Const.State.enabled;
            this.buzz.state = Const.State.enabled;
            this.active = true;
            this.scale = this.minZoom;
            this.offset = {x:0, y:0};
        },
        Stop: function(){
            this.buzz.state = Const.State.disabled;
            this.active = false;
        },
        Update: function(dt){
            
            // if(input.isDown('O'))
            // {
            //     if(this.scale + 0.01 <= this.maxZoom)
            //     {
            //         //this.scale += 0.01;
            //         this.zoomIn = true;
            //         //this.scale = Util.Lerp(this.scale, 0.3, 0.001);
            //     }
            // }
            // if(input.isDown('U'))
            // {
            //     if(this.scale - 0.01 >= this.minZoom)
            //     {
            //         this.scale -= 0.01;
            //     }
            // }

            if(this.zoomIn > 0){
                this.scale = Util.Lerp(this.scale, this.zoomIn, 0.01);
                if(this.scale > (this.zoomIn - 0.01))
                {
                    this.zoomIn = 0;
                }
            }

            //debug.Print("this.scale",this.scale);

            if(this.active){
                Util.ScrollTo(this.buzz.x * this.scale, this.buzz.y * this.scale,
                    {width:800, height:600}, 
                    {width:this.map.width * this.scale, height:this.map.height * this.scale}, 
                    this.offset, false);

                this.buzz.Update(dt, this.scale);    

                if(this.buzz.state == Const.State.enabled){
                    var c = this.buzz.Check(this.landscape, this.offset);

debug.Print("foot:","["+c.left+"]["+c.right+"]");

                    if(c.hits != 0){
                        this.buzz.InitContact(c);
                    }
                    this.panel.Update(this.buzz.dx, this.buzz.dy, this.buzz.thrust, c.dist);

                    if(c.dist < 300){
                        this.zoomIn = 1;
                    }
                    // else if(c.dist < 400){
                    //     this.zoomIn = 0.7;
                    // }
                    else if(c.dist < 500){
                        this.zoomIn = 0.5;
                    }
                    // else if(c.dist < 600){
                    //     this.zoomIn = 0.5;
                    // }
                    // else if(c.dist < 700){
                    //     this.zoomIn = 0.4;
                    // }
                    // else if(c.dist < 800){
                    //     this.zoomIn = 0.3;
                    // }
                    else if(c.dist < 900){
                        this.zoomIn = 0.2;
                    }                 
                }

                if(this.buzz.state == Const.State.disabled){
                    this.active = false; 
                }
            }
        },
        Render: function(){   
            Renderer.Clear(25*32,19*32);
            Renderer.VectorLine(this.landscape, (this.active ? PAL[1] : PAL[2]), this.offset, this.scale);

            if(this.active){
                this.buzz.Render(this.offset);  
            }

            // if(this.buzz.state == Const.State.crashed){
            //     Renderer.DrawText("You destroyed a 100 megaton lander", 300,300, "12px Arial");
            // }

            this.panel.Render();
debug.Render(true, true);
        }
    };

    window.Game = Game;
})();
