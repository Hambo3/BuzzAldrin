(function() {
    function Game(levelMap) {

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

        this.buzz = new Buzz( 1500, 500, 0.07, 0.04 );
        this.panel = new Panel();
    };

    Game.prototype = {        
        Update: function(dt){
            
            if(input.isDown('O'))
            {
                if(this.scale + 0.01 <= this.maxZoom)
                {
                    this.scale += 0.01;
                }
            }
            if(input.isDown('U'))
            {
                if(this.scale - 0.01 >= this.minZoom)
                {
                    this.scale -= 0.01;
                }
            }


            Util.ScrollTo(this.buzz.x * this.scale, this.buzz.y * this.scale,
                 {width:800, height:600}, 
                 {width:this.map.width * this.scale, height:this.map.height * this.scale}, 
                 this.offset, false);

            this.buzz.update(dt, this.scale);    

            var c = this.buzz.check(this.landscape, this.offset);

            this.panel.update();
        },
        Render: function(){   
            Renderer.Clear(25*32,19*32);
            Renderer.VectorLine(this.landscape, PAL[1], this.offset, this.scale);
            this.buzz.render(this.offset);  

            this.panel.render();
debug.Render(true, true);
        }
    };

    window.Game = Game;
})();
