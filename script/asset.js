(function() {
    function Buzz(x, y, gravity, resistance) {
 
		this.enabled = true;
        this.gravity = gravity;
        this.resistance = resistance;
        this.x = x;
        this.y = y;  

		this.scale = 1;
        this.rotation = 270;
        this.thrust = 0;
        this.dx = 1;
        this.dy = 0;
        this.dr = 0;

        this.rate = {
            rotation: {
                        impulse:2,
                        drag:1
                    },
            thrust: {
                        impulse:0.0012,
                        drag:0.005
                    }
        };

        this.body = Util.Scale(Factory.Ship(1), 1);
        this.ptcache = Util.Scale(Factory.Ship(1), 1);

    };

    Buzz.prototype = {	
        check: function(landscape, offset){
            var c = 0;

            for (var b = 0; b < this.body.length - 1; b++) 
            {            
                for (var p = 1; p < this.body[b].pt.length; p++) 
                {
                    for (var i = 1; i < landscape.length; i++) 
                    {
                        var x = Util.line_intersects(
                        {
                            x:this.ptcache[b].pt[p-1].x + (this.x * this.scale)-offset.x,
                            y:this.ptcache[b].pt[p-1].y + (this.y * this.scale)-offset.y
                        },
                        {
                            x:this.ptcache[b].pt[p].x + (this.x * this.scale)-offset.x,
                            y:this.ptcache[b].pt[p].y + (this.y * this.scale)-offset.y
                        },
                        {
                            x: (landscape[i-1].x * this.scale) - offset.x,
                            y: (landscape[i-1].y * this.scale) - offset.y
                        },
                        {
                            x: (landscape[i].x * this.scale) - offset.x,
                            y: (landscape[i].y * this.scale) - offset.y}
                        );
                        if(x){
                            c++;
                        }
                    }
                }
            }

            return c;
        },
        update: function(dt, scale) {
            this.scale = scale;
            var rImpulse = this.rate.rotation.impulse * dt;
            var drag = this.rate.rotation.drag * dt;
            var tImpulse = this.rate.thrust.impulse * dt;
            var nImpulse = this.rate.thrust.drag * dt;
            var gravity = this.gravity * dt;
            var resistance = this.resistance *dt;

            if(input.isDown('W') || input.isDown('UP'))
            {
                this.thrust += tImpulse;
            }
            else{
                this.thrust -= nImpulse;
                if(this.thrust < 0)
                {
                    this.thrust = 0;
                }
            }

            if(input.isDown('A') || input.isDown('LEFT'))
            {
                this.dr -= rImpulse;
            }
            if(input.isDown('D') || input.isDown('RIGHT'))
            {
                this.dr += rImpulse;
            }


            this.rotation += this.dr;

            var velocity_Y = -(this.thrust * Math.cos(Util.Radians(this.rotation)));
            var velocity_X = (this.thrust * Math.sin(Util.Radians(this.rotation)));

            this.dy += gravity + velocity_Y;
            this.dx += velocity_X;

            if(this.dr > 0){
                this.dr = (this.dr - drag > 0) ? this.dr - drag : 0;
            }

            if(this.dr < 0){
                this.dr = (this.dr + drag < 0) ? this.dr + drag : 0;
            }

            if(this.dx > 0){
                this.dx = (this.dx - resistance > 0) ? this.dx - resistance : 0;
            }

            if(this.dx < 0){
                this.dx = (this.dx + resistance < 0) ? this.dx + resistance : 0;
            }

            if(this.dy < 0){
                this.dy = (this.dy + gravity < 0) ? this.dy + gravity : 0;
            }

            this.y += this.dy;
            this.x += this.dx;                  

            this.body[4].pt[1].y = 14 + (8000*this.thrust);

            var pts = [];
            for(var b = 0; b < this.body.length; b++) {
                pts = [];
                for(var i = 0; i < this.body[b].pt.length; i++) {
                    var pt = Util.RotatePoint(this.body[b].pt[i].x * this.scale, this.body[b].pt[i].y * this.scale, this.rotation);
                    pts.push(pt);
                }  
                this.ptcache[b].pt = pts;
            }

        },
        render: function(os) {
            Renderer.VectorSprite((this.x * this.scale)-os.x, (this.y * this.scale)-os.y, this.ptcache, 0, 1);
		}
    };

    window.Buzz = Buzz;


    function Panel() {
        this.time = 0;

    };
    Panel.prototype = {
        
        update: function(fuel, horiz, vert, alt) {

        },
        render: function(os) {
            Renderer.DrawText("SCORE", 100,20);
            Renderer.DrawText("TIME", 100,40);
            Renderer.DrawText("FUEL", 100,60);

            Renderer.DrawText("ALTITUDE", 500,20);
            Renderer.DrawText("HORIZONTAL SPEED", 500,40);
            Renderer.DrawText("VERTICAL SPEED", 500,60);
		}
    };

    window.Panel = Panel;
})();