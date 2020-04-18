(function() {

    ///Buzz asset
    function Buzz(x, y, gravity, resistance) {
 
		this.state = Const.State.disabled;
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

        this.body = Util.Scale(Factory.LEM(1), 1);
        this.ptcache = Util.Scale(Factory.LEM(1), 1);
        this.crashedCount = 0;
    };

    Buzz.prototype = {	
        InitContact: function(contact){


            var r = (this.rotation % 360);

            console.log("dx:"+this.dx+"dy:"+this.dy+"r"+r);
            
            if((this.dx == 0 && this.dy < 1 && (r > 359 || r < 1)) && (contact.left && contact.right))
            {                
                this.state = Const.State.landed;
                this.crashedCount = 100;
            }
            else
            {
                this.ptcache.pop();
                for(var b = 0; b < this.ptcache.length; b++) 
                {
                    this.ptcache[b].dx = Util.Rndf(-0.5, 0.5);
                    this.ptcache[b].dy = Util.Rndf(-0.5, 0.5);
                } 
                this.state = Const.State.crashed;
                this.crashedCount = 100;
            }

        },
        Check: function(landscape, offset){
            
            var c = 0;
            var near = 0;
            var left = false;
            var right = false;
            if(this.state == Const.State.enabled) 
            {
                for (var b = 0; b < this.body.length - 1; b++) 
                {            
                    for (var p = 1; p < this.body[b].pt.length; p++) 
                    {
                        for (var i = 1; i < landscape.length; i++) 
                        {
                            //get distance
                            var d = Util.Distance(this.x, this.y+17, landscape[i].x, landscape[i].y);
                            if(near == 0 || d < near)
                            {
                                near = d;
                            }
                            //detect touching
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
                                if(b == 5 || b == 6)
                                {//special case for foot
                                    //left foot is b0, rt= b1
                                    if(b == 5){
                                        left = true;
                                    }
                                    if(b == 6){
                                        right = true;
                                    }
                                }
                                else{
                                    c++;
                                }
                            }
                        }
                    }
                }
            }
            return {hits:c, dist:near, left:left, right:right};
        },
        Update: function(dt, scale) {
            if(this.state == Const.State.landed)
            {
                if(--this.crashedCount == 0)
                {
                    this.state = Const.State.disabled;
                }
            }
            else if(this.state == Const.State.crashed)
            {
                for(var b = 0; b < this.ptcache.length; b++) {

                    for(var i = 0; i < this.ptcache[b].pt.length; i++) {
                        this.ptcache[b].pt[i].x += this.ptcache[b].dx;
                        this.ptcache[b].pt[i].y += this.ptcache[b].dy;
                    }  
                } 
                
                if(--this.crashedCount == 0)
                {
                    this.state = Const.State.disabled;
                }

            }
            else if(this.state == Const.State.enabled)
            {
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

                this.body[7].pt[1].y = 14 + (8000*this.thrust);

                var pts = [];
                for(var b = 0; b < this.body.length; b++) {
                    pts = [];
                    for(var i = 0; i < this.body[b].pt.length; i++) {
                        var pt = Util.RotatePoint(this.body[b].pt[i].x * this.scale, this.body[b].pt[i].y * this.scale, this.rotation);
                        pts.push(pt);
                    }  
                    this.ptcache[b].pt = pts;
                }
            }
        },
        Render: function(os) {
            if(this.state != Const.State.disabled)
            {
                Renderer.VectorSprite((this.x * this.scale)-os.x, (this.y * this.scale)-os.y, this.ptcache, 0, 1);

                if(this.state == Const.State.crashed){
                    Renderer.DrawText("You destroyed a 100 megaton lander", 300,300, "12px Arial");
                }
                else if(this.state == Const.State.landed){
                    Renderer.DrawText("Great landing", 300,300, "12px Arial");
                }
            }
		}
    };

    window.Buzz = Buzz;


    ///score panel
    function Panel() {
        this.time = 0;
        this.score = 0;
        this.fuel = 750;
        this.altitude = 0;
        this.verticalSpeed=0;
        this.horizontalSpeed = 0;
    };
    Panel.prototype = {
        
        Update: function(horiz, vert, thrust, alt) {
            this.verticalSpeed = parseInt(150 * vert);
            this.horizontalSpeed = parseInt(150 * horiz);
            this.fuel -= thrust * 60;
            this.altitude = alt;
        },
        Render: function(os) {
            Renderer.DrawText("SCORE", 100,20);
            Renderer.DrawText("TIME", 100,40);
            Renderer.DrawText("FUEL", 100,60);

            Renderer.DrawText("ALTITUDE", 500,20);
            Renderer.DrawText("HORIZONTAL SPEED", 500,40);
            Renderer.DrawText("VERTICAL SPEED", 500,60);

            Renderer.DrawText(this.score, 180,20);
            Renderer.DrawText(this.time, 180,40);
            Renderer.DrawText(parseInt(this.fuel), 180,60);

            Renderer.DrawText(parseInt(this.altitude), 640,20);
            Renderer.DrawText(Math.abs(this.horizontalSpeed), 640,40);            
            Renderer.DrawText(Math.abs(this.verticalSpeed), 640,60);

            if(this.horizontalSpeed!=0){
                Renderer.DrawText(this.horizontalSpeed > 0 ? "+" : "-", 700,40);            
            }

            if(this.verticalSpeed != 0){
                Renderer.DrawText(this.verticalSpeed > 0 ? "+" : "-", 700,60);
            }
		}
    };

    window.Panel = Panel;


    ///Title screen
    function Title(){
        this.active = false;
        this.state = 0;
        this.unlocked = false;
        this.selected = 0;
    };
    Title.prototype = {
        Update: function(horiz, vert, thrust, alt) {
            if(this.active)
            {
                if((input.isUp('W') || input.isUp('UP')) && this.selected > 0)
                {
                    this.selected--;
                }
                if((input.isUp('S') || input.isUp('DOWN')) && this.selected < 2)
                {
                    this.selected++;
                }
                if(input.isDown('SPACE'))
                {
                    this.active = false;
                    this.state = 1;
                }
            }
        },
        Render: function(os) {
            if(this.active)
            {
                Renderer.DrawText("BUZZ ALDRIN", 260,240, "40px Arial");
                Renderer.DrawText("First man on the moon", 310,260, "16px Arial");

                //Renderer.DrawText("COMING SOON", 330,300, "16px Arial");

                Renderer.DrawText("[Start] (Buzz Adlrin)", 300,360);
                Renderer.DrawText("[Start] (Neil Armstrong)", 300,380);
                Renderer.DrawText("[Help]", 300,400);

                Renderer.DrawText(">", 260, 360 + (this.selected * 20));
            }
		}
    };
    window.Title = Title;
})();