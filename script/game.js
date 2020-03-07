(function() {
    function Game(levelMap) {
        this.map = new MapManager();
        this.map.SetMap(levelMap);
        this.zoom = 1;

        this.buzz = new Buzz( 26*32, 9*32, 64,64,
            {idle:'one'}, 'one',
            0,1);

        this.neil = new Buzz( 0, 0, 64,64,
            {idle:'one'}, 'one',
            0, 1);
    };

    Game.prototype = {        
        Update: function(dt){
            if(input.isDown('Z'))
            {
                this.zoom +=0.01;
            }
            if(input.isDown('X'))
            {
                this.zoom -=0.01;
            }
            this.map.SetZoom(this.zoom);
            this.map.ScrollTo(this.buzz.x, this.buzz.y);
            var mp = this.map.ScrollOffset(); 

debug.Print("mp:","["+mp.x.toFixed(2)+"]["+mp.y.toFixed(2)+"]"); 
            this.buzz.update(dt, this.zoom, mp);
            //this.neil.update(dt, this.zoom, mp);
        },
        Render: function(){    

            this.map.Render();

            this.buzz.render();  
            //this.neil.render();  
debug.Print("zoom:","["+this.zoom+"]"); 
debug.Render(true, true);
        }
    };

    window.Game = Game;
})();
