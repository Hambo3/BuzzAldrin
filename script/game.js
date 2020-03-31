(function() {
    function Game(levelMap) {

        this.landscape = Factory.Terrain(8, 2457);
        
        var w = this.landscape[this.landscape.length-1].x;
        var r = w / levelMap.screen.width;
        var h = levelMap.screen.height * r;

        this.map = {width:w, height:h};
        this.offset = {x:0, y:0};

        //this.l = {x:-2737,y:-760};
        this.scale = 1;//1 / r; //0.16;//1;
        this.minZoom = this.scale;
        this.maxZoom = 1;

        this.buzz = new Buzz( 2516, 1778 );
    };

    Game.prototype = {        
        Update: function(dt){
            
            if(input.isDown('W'))
            {
                if(this.scale + 0.01 <= this.maxZoom)
                {
                    this.scale += 0.01;
                }
            }
            if(input.isDown('S'))
            {
                if(this.scale - 0.01 >= this.minZoom)
                {
                    this.scale -= 0.01;
                }
            }

             if(input.isDown('I'))
             {
                 this.offset.y -=1;
             }
             if(input.isDown('K'))
             {
                 this.offset.y +=1;
             }
             if(input.isDown('J'))
             {
                 this.offset.x -=1;
             }
             if(input.isDown('L'))
             {
                 this.offset.x +=1;
             }

debug.Print("l","["+this.offset.x+"]["+this.offset.y+"]"); 
debug.Print("scale","["+this.scale+"]"); 
            //this.buzz.update(dt, this.scale);

            Util.ScrollTo(this.buzz.x, this.buzz.y,
                 {width:800, height:600}, 
                 {width:this.map.width, height:this.map.height}, 
                 this.offset);

            this.buzz.update(dt, this.scale);     
            var c = 0;

            for (var b = 0; b < this.buzz.body.length; b++) 
            {            
                for (var p = 1; p < this.buzz.body[b].pt.length; p++) 
                {
                    for (var i = 1; i < this.landscape.length; i++) 
                    {
                        var x = Util.line_intersects(
                            {
                                x:this.buzz.ptcache[b].pt[p-1].x + this.buzz.x,
                                y:this.buzz.ptcache[b].pt[p-1].y + this.buzz.y
                            },
                            {
                                x:this.buzz.ptcache[b].pt[p].x + this.buzz.x,
                                y:this.buzz.ptcache[b].pt[p].y + this.buzz.y
                            },
                            {
                                x:this.landscape[i-1].x - this.offset.x,
                                y:this.landscape[i-1].y - this.offset.y
                            },
                            {
                                x:this.landscape[i].x - this.offset.x,
                                y:this.landscape[i].y - this.offset.y}
                            );
                            if(x){
                                c++;
                            }
                    }
                }
            }
            debug.Print("contact","["+c+"]"); 
        },
        Render: function(){   
            Renderer.Clear(25*32,19*32);
            Renderer.VectorLine(this.landscape, PAL[1], this.offset, this.scale);
            this.buzz.render(this.offset);  
debug.Render(true, true);
        }
    };

    window.Game = Game;
})();
