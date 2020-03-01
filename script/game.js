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
            if(input.isDown('UP'))
            {
                this.zoom +=0.01;
            }
            if(input.isDown('DOWN'))
            {
                this.zoom -=0.01;
            }
            this.map.ScrollTo(this.buzz.x, this.buzz.y);
            var mp = this.map.ScrollOffset(); 

            this.buzz.update(dt, this.zoom, mp);
            this.neil.update(dt, this.zoom, {x:0,y:0});
        },
        Render: function(){    

            this.map.Render(this.zoom);

            this.buzz.render();  
            this.neil.render();  
        }
    };

    window.Game = Game;
})();
