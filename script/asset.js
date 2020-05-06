(function() {

    ///Buzz asset
    function Buzz(x, y, gravity, resistance, r, type, celebrations, safeZones) {
        this.type = type;
		this.state = Const.State.enabled;
        this.gravity = gravity;
        this.resistance = resistance;
        this.x = x;
        this.y = y;  

		this.scale = 1;
        this.rotation = r;
        this.thrust = 0;
        this.dx = 1;
        this.dy = 0;
        this.dr = 0;

        this.fuel = 750;
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

        this.celebrations = celebrations;
        this.safeZones = safeZones;

        this.body = (this.type == 0) ? Util.Scale(Factory.Buzz(1), 3) : Util.Scale(Factory.LEM(1), 1.5);
        this.ptcache = (this.type == 0) ? Util.Scale(Factory.Buzz(1), 3) : Util.Scale(Factory.LEM(1), 1.5);

        this.thrustSnd = Const.Sound.thrust;
        this.leftFoot = 5;
        this.rightFoot = 6;
        this.flameIndex = 7;
        if(this.type == 0)
        {
            this.leftFoot = 3;
            this.rightFoot = 4;
            this.flameIndex = 5; 

            this.thrustSnd = Const.Sound.farts;
        }
        this.tdCount = 0;
        this.congrats;
    };

    Buzz.prototype = {	
        InitContact: function(contact){
            var r = (this.rotation % 360);
           
            var cl = Util.ArrayFirst(this.safeZones, contact.left);
            var cr = Util.ArrayFirst(this.safeZones, contact.right);
            this.dy = 0;
            this.dx = 0; 
            if((this.dx == 0 && this.dy < 1 && (r > 359 || r < 1)) && (cl && cr))
            {                
                this.state = Const.State.landed;
                this.tdCount = 100;
                this.congrats = Util.OneOf(this.celebrations.success);
            }
            else
            {
                this.ptcache.pop();
                if(this.type==0)
                {
                    for(var b = 0; b < this.ptcache.length; b++) 
                    {
                        this.ptcache[b].dx = 0;
                        this.ptcache[b].dy = 0;                        
                    } 

                    var x = Util.Rndf(-0.5, 0.5);
                    var y =Util.Rndf(-0.5, -0.1);
                     this.ptcache[1].dx =x;
                     this.ptcache[1].dy = y;
                     this.ptcache[2].dx = x;
                     this.ptcache[2].dy = y;
                }
                else
                {
                    for(var b = 0; b < this.ptcache.length; b++) 
                    {
                        this.ptcache[b].dx = Util.Rndf(-0.5, 0.5);
                        this.ptcache[b].dy = Util.Rndf(-0.5, 0.5);
                    } 
                }

                this.state = Const.State.crashed;
                this.congrats = Util.OneOf(this.celebrations.fail);
                this.tdCount = 100;
                Sound.Play(Const.Sound.crash);
            }

        },
        Check: function(landscape, offset){
            
            var c = 0;
            var near = 0;
            var left = 0;
            var right = 0;
            if(this.state == Const.State.enabled) 
            {
                for (var b = 0; b < this.flameIndex; b++) 
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
                                if(b == this.leftFoot || b == this.rightFoot)
                                {//special case for foot
                                    //left foot is b0, rt= b1
                                    if(b == this.leftFoot){
                                        left = i;
                                    }
                                    if(b == this.rightFoot){
                                        right = i;
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
            if(this.state == Const.State.finished)
            {
                if(--this.tdCount == 0)
                {
                    this.state = Const.State.disabled;
                }
            }
            else if(this.state == Const.State.landed)
            {
                this.thrust -= nImpulse;
                if(this.thrust < 0)
                {
                    this.thrust = 0;
                }
                
                if(--this.tdCount == 0)
                {
                    this.state = Const.State.finished;
                    this.tdCount = 300;
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
                
                if(--this.tdCount == 0)
                {
                    this.state = Const.State.finished;
                    this.tdCount = 300;
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
                    Sound.Play(this.thrustSnd);
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

                this.fuel -= this.thrust * 60;
                if(this.type == 1){
                    this.body[this.flameIndex].pt[1].y = 21 + (8000*this.thrust);
                }
                else{
                    for(var b = this.flameIndex; b < this.body.length; b++) {
                        this.body[b].pt[1].y = 40 + (8000*this.thrust);
                    } 
                }

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
                    Renderer.DrawText(this.congrats, 300,300);
                }
                else if(this.state == Const.State.landed){
                    Renderer.DrawText(this.congrats, 300,300);
                }
            }
		}
    };

    window.Buzz = Buzz;


    ///score panel
    function Panel(type) {
        this.time = 0;
        this.score = 0;
        this.fuel = 0;
        this.altitude = 0;
        this.verticalSpeed=0;
        this.horizontalSpeed = 0;
        this.type = type;
    };
    Panel.prototype = {
        
        Update: function(horiz, vert, fuel, alt) {
            this.verticalSpeed = parseInt(150 * vert);
            this.horizontalSpeed = parseInt(150 * horiz);
            this.fuel = fuel;
            this.altitude = alt;
        },
        Render: function(os) {

            if(this.type == 1){
                Renderer.DrawText("TIME", 100,40);
                Renderer.DrawText("FUEL", 100,60);

                Renderer.DrawText(this.time, 180,40);
                Renderer.DrawText(parseInt(this.fuel), 180,60);
            }
            else{
                Renderer.DrawText("TIME TILL LM LANDING", 20,40);
                Renderer.DrawText(this.time, 180,40);
            }

            Renderer.DrawText("SCORE", 100,20);                        

            Renderer.DrawText("ALTITUDE", 500,20);
            Renderer.DrawText("HORIZONTAL SPEED", 500,40);
            Renderer.DrawText("VERTICAL SPEED", 500,60);

            Renderer.DrawText(this.score, 180,20);

            Renderer.DrawText(parseInt(this.altitude), 640,20);
            Renderer.DrawText(Math.abs(this.horizontalSpeed), 640,40);            
            Renderer.DrawText(Math.abs(this.verticalSpeed), 640,60);

            if(this.horizontalSpeed!=0){
                Renderer.VectorSprite(700,40, (this.horizontalSpeed > 0) ? Factory.RightArrow(1) : Factory.LeftArrow(1), 0, 1);
                //Renderer.DrawText(this.horizontalSpeed > 0 ? "+" : "-", 700,40);            
            }

            if(this.verticalSpeed != 0){
                Renderer.VectorSprite(700,60, (this.verticalSpeed > 0) ? Factory.DownArrow(1) : Factory.UpArrow(1), 0, 1);
                //Renderer.DrawText(this.verticalSpeed > 0 ? "+" : "-", 700,60);
            }
		}
    };

    window.Panel = Panel;


    ///Title screen
    function Title(game, start){
        this.game = game;
        this.active = true;
        this.state = start;
        this.unlocked = false;
        this.selected = 0;
        this.help = 0;
        //this.next =

        this.titleCol = start == 0 ? 0 : 1;
        this.menuCol = start == 0 ? 0 : 1;
        this.mapCol = start == 0 ? 0 : 0.2;

        this.landscape = Factory.Terrain(8, 2457);
        var w = this.landscape[this.landscape.length-1].x;
        var r = w / 800;
        this.scale = 1 / r;

        this.LM =new LM(400, 400, 0 ,0, 2);
    };

    Title.prototype = {
        Update: function(dt) {

            if(this.state == 0){
                this.titleCol = Util.SLerp(this.titleCol, 1, 0.005);
                if(this.titleCol > 0.95){
                    this.state++;
                }                        
            }
            else if(this.state == 1){
                this.menuCol = Util.SLerp(this.menuCol, 1, 0.01);
                this.mapCol = Util.SLerp(this.mapCol, 0.2, 0.005);
                if(this.menuCol > 0.95){
                    this.state++;
                }                        
            }
            else if(this.state == 2){
                if((input.isUp('W') || input.isUp('UP')) && this.selected > 0)
                {
                    this.selected--;
                }
                if((input.isUp('S') || input.isUp('DOWN')) && this.selected < 2)
                {
                    this.selected++;
                }
                if(input.isUp('SPACE'))
                {
                    if(this.selected == 0){
                       this.game(2);
                    }
                    else if(this.selected == 1){
                        this.game(1);
                    }else if(this.selected == 2){
                        this.state = 3;
                        this.help = 200;
                    }
                }
            }
            else if(this.state == 3){
                this.LM.Update(dt, 1);
                if(input.isUp('SPACE'))
                {
                    this.state=2;
                }
            }
        },
        Render: function() {

            Renderer.Clear(25*32,19*32);
            
            if(this.state < 3){
                Renderer.VectorLine(this.landscape, "rgba(200, 200, 200, "+this.mapCol+")", {x:0, y:0}, this.scale);
                Renderer.DrawText("BUZZ ALDRIN", 190,240, 
                    "rgba(255, 255, 255, "+this.titleCol+")", 
                    "64px Arial");
            }

            if(this.state > 0)
            {                
                if(this.state == 3){
                    Renderer.DrawText("[Space] to return", 100,500, "#555555", "20px Arial");
                    Renderer.DrawText("Lunar Excursion Module training manual", 140,150, "#FFFFFF", "28px Arial");
                    Renderer.DrawText("[up]              [W]", 396,200, "#FFFFFF", "20px Arial");
                    Renderer.DrawText("Control lander using [left] [right] or [A] [D]", 190,224, "#FFFFFF", "20px Arial");

                    this.help = Util.SLerp(this.help, 1500, 1);

                    switch (parseInt(this.help / 300)){
                        case 0:
                            this.LM.Render({x:0, y:0});
                            break;
                        case 1:
                            this.LM.rotation = Util.Lerp(this.LM.rotation, 30, 0.01);
                            this.LM.Render({x:0, y:0});

                            Renderer.DrawText("[right]", 560,400, "#FFFFFF", "20px Arial");
                            break;
                        case 2:
                            this.LM.rotation = Util.Lerp(this.LM.rotation, 0, 0.02);
                            this.LM.Render({x:0, y:0});
                            Renderer.DrawText("[left]", 200,400, "#FFFFFF", "20px Arial");
                            break; 
                        case 3:
                            this.LM.rotation = 0;
                            this.LM.thrust = Util.Lerp(this.LM.thrust, 80, 0.01);
                            this.LM.Render({x:0, y:0});

                            Renderer.DrawText("[up]", 380,340, "#FFFFFF", "20px Arial");

                            break; 
                        case 4:
                            this.LM.thrust = Util.Lerp(this.LM.thrust, 0, 0.02);
                            this.LM.Render({x:0, y:0});
                            break; 
                        case 5:
                            this.LM.rotation = 0;
                            this.LM.thrust = Util.Lerp(this.LM.thrust, 50, 0.01);
                            this.LM.y = Util.Lerp(this.LM.y, 500, 0.01);
                            this.LM.Render({x:0, y:0});

                            Renderer.VectorLine(Factory.HelpTerrain(), PAL[1], {x:0,y:0}, 1);

                            Renderer.DrawText("Land safely on a designated landing zone", 190,340, "#FFFFFF", "20px Arial");
                            Renderer.DrawText("2X", 380,560, "#FFFFFF", "20px Arial");
                            break;                                   
                    }
                }
                else{
                    Renderer.DrawText("First man on the moon", 280,264, 
                        "rgba(255, 255, 255, "+this.menuCol+")", 
                        "24px Arial");


                    Renderer.DrawText("[Start] (Buzz Aldrin)", 300,360, "rgba(255, 255, 255, "+this.menuCol+")", "20px Arial");
                    Renderer.DrawText("[Start] (Neil Armstrong)", 300,384, "rgba(255, 255, 255, "+this.menuCol+")", "20px Arial");
                    Renderer.DrawText("[Help]", 300,408, "rgba(255, 255, 255, "+this.menuCol+")", "20px Arial");

                    Renderer.DrawText(">", 260, 366 + (this.selected * 24), "rgba(255, 255, 255, "+this.menuCol+")", "32px Arial");
                    Renderer.DrawText("<", 560, 366 + (this.selected * 24), "rgba(255, 255, 255, "+this.menuCol+")", "32px Arial");

                    Renderer.DrawText("[Space] to select", 100,500, "#555555", "20px Arial");
                }
            }

		}
    };
    window.Title = Title;

    ///Buzz LM
    function LM(x, y, dx, dy, sz){
        this.active = true;
        this.x = x;
        this.y = y;  
        this.dx = dx;
        this.dy = dy;

        this.flameIndex = 7;

        this.thrust = 0;
		this.scale = 1;
        this.rotation = 0;
        this.body = Util.Scale(Factory.LEM(1), sz);
        this.ptcache = Util.Scale(Factory.LEM(1), sz);

        this.fl = this.body[this.flameIndex].pt[1].y;
    };
    LM.prototype = {
        Update: function(dt, scale) {
            this.scale = scale;
            this.y += this.dy * dt;
            this.x += this.dx * dt;   

            this.body[this.flameIndex].pt[1].y = this.fl + this.thrust;
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
        Render: function(os) {
            Renderer.VectorSprite((this.x * this.scale)-os.x, (this.y * this.scale)-os.y, this.ptcache, 0, 1);
		}
    };
    window.LM = LM; 

    ///Buzz Orbiter
    function Orbiter(x, y, dx, dy, sz){
        this.active = true;
        this.x = x;
        this.y = y;  
        this.dx = dx;
        this.dy = dy;

		this.scale = 1;
        this.rotation = 0;
        this.body = Util.Scale(Factory.Orbiter(1, -50), sz);
        this.ptcache = Util.Scale(Factory.Orbiter(1, -50), sz);
    };
    Orbiter.prototype = {
        Update: function(dt, scale) {
            this.scale = scale;
            this.y += this.dy * dt;
            this.x += this.dx * dt;   

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
        Render: function(os) {
            Renderer.VectorSprite((this.x * this.scale)-os.x, (this.y * this.scale)-os.y, this.ptcache, 0, 1);
		}
    };
    window.Orbiter = Orbiter; 

        ///buzz intro screen
        function BuzzIntro(start){
            this.start = start;
            this.scale = 0.7;
            
            this.LM = new LM(1320, 200, 0 ,0, 2);
            this.Orbiter = new Orbiter(1320, 200, 0 ,0, 2);
            this.LM.rotation = 270;
            this.Orbiter.rotation = 270;

            this.timings = [300,500,200,600, 300, 200, 400, 400];
            this.stage = 0;
            this.counter = this.timings[this.stage];

            this.txtCol = 0;
        };
    
        BuzzIntro.prototype = {            
            Update: function(dt) {
                //this.start(0);
                if(input.isUp('ESC'))
                {
                    this.start(0);
                }

                if(--this.counter == 0){
                    this.stage++;
                    if(this.stage == this.timings.length){
                        this.start(0);
                    }
                    else{
                        this.counter = this.timings[this.stage];
                    }
                }
                debug.Print("count:","["+this.counter+"]");
                switch (this.stage){ 
                    case 0:
                        this.txtCol = Util.Lerp(this.txtCol, 1, 0.01);
                        break;
                    case 1:
                        //date 20 Juluy 1969
                        this.txtCol = Util.Lerp(this.txtCol, 0, 0.1);
                        this.Orbiter.x = Util.Lerp(this.Orbiter.x, 400, 0.003);
                        this.LM.x = Util.Lerp(this.LM.x, 400, 0.003);
                        break;
                    case 2:
                        //pause
                        break;   
                    case 3:
                        //prepare
                        this.Orbiter.rotation = Util.Lerp(this.Orbiter.rotation, 360, 0.01);
                        this.LM.rotation = Util.Lerp(this.LM.rotation, 360, 0.01);
                        break;     
                    case 4:
                        //prepare for sep
                        this.scale = Util.Lerp(this.scale, 1, 0.01); 
                        this.Orbiter.x = Util.Lerp(this.Orbiter.x, 400, 0.01);
                        this.LM.x = Util.Lerp(this.LM.x, 400, 0.01);                       
                        break;  
                    case 5:
                        this.Orbiter.y = Util.Lerp(this.Orbiter.y, -0, 0.003);
                        break;    
                    case 6:
                        this.scale = Util.Lerp(this.scale, 1.5, 0.01);
                        this.Orbiter.x = Util.Lerp(this.Orbiter.x, 250, 0.01);
                        this.Orbiter.y = Util.Lerp(this.Orbiter.y, -200, 0.003);
                        this.LM.x = Util.Lerp(this.LM.x, 250, 0.01);
                        break;  
                    case 7:
                        this.scale = Util.Lerp(this.scale, 2, 0.01);
                        this.LM.x = Util.Lerp(this.LM.x, 200, 0.01);
                        break;  
                    case 99:
                        break;                            
                }
                this.Orbiter.Update(dt, this.scale);
                this.LM.Update(dt, this.scale);
            },
            Render: function() {
                Renderer.Clear(25*32,19*32);

                this.Orbiter.Render({x:0, y:0});
                this.LM.Render({x:0, y:0});

                switch (this.stage){ 
                    case 0:
                        Renderer.DrawText("20 July 1969", 300,300, "rgba(255, 255, 255, "+this.txtCol+")", "48px Arial");
                        break;
                    case 1:
                        Renderer.DrawText("20 July 1969", 300,300, "rgba(255, 255, 255, "+this.txtCol+")", "48px Arial");
                        break;                        
                }

                debug.Render(true, true);
            }
        };
        window.BuzzIntro = BuzzIntro;
})();