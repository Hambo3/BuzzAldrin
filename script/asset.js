(function() {
    function Buzz(x, y) {
 
		this.enabled = true;

        this.x = x;
        this.y = y;
  

		this.scale = 1;
        this.rotation = 0;

        this.dx = 0;
        this.dy = 0;

        this.body = Util.Scale(Factory.Ship(1), 1);
        this.ptcache = Util.Scale(Factory.Ship(1), 1);

    };

    Buzz.prototype = {	
        update: function(dt, scale) {
            //this.x += this.rate;
            this.scale = scale;
            if(input.isDown('UP'))
            {
                this.y -=5;
            }
            if(input.isDown('DOWN'))
            {
                this.y +=5;
            }
            if(input.isDown('LEFT'))
            {
                this.x -=5;
            }
            if(input.isDown('RIGHT'))
            {
                this.x +=5;
            }

            if(input.isDown('A'))
            {
                this.rotation -= 0.2;
            }
            if(input.isDown('D'))
            {
                this.rotation += 0.2;
            }

            var pts = [];
            for(var b = 0; b < this.body.length; b++) {
                pts = [];
                for(var i = 0; i < this.body[b].pt.length; i++) {
                    var pt = Util.RotatePoint(this.body[b].pt[i].x, this.body[b].pt[i].y, this.rotation);
                    pts.push(pt);
                }  
                this.ptcache[b].pt = pts;
            }
        },
        render: function(os) {
            Renderer.VectorSprite(this.x-os.x, this.y-os.y, this.ptcache, 0, this.scale);
		}
    };

    window.Buzz = Buzz;
})();