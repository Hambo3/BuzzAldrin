(function() {
    function Game(levelMap) {

        this.landscape = [{x:0,y:416},
            {x:8,y:416},
            {x:10,y:422},
            {x:16,y:422},
            {x:18,y:428},
            {x:21,y:429},
            {x:24,y:452},
            {x:30,y:483},
            {x:39,y:489},
            {x:43,y:502},
            {x:52,y:513},
            {x:58,y:513},
            {x:68,y:502},
            {x:73,y:494},
            {x:84,y:482},
            {x:85,y:478},
            {x:93,y:470},
            {x:95,y:465},
            {x:102,y:461},
            {x:108,y:452},
            {x:113,y:452},
            {x:121,y:446},
            {x:127,y:446},
            {x:131,y:447},
            {x:139,y:452},
            {x:140,y:459},
            {x:145,y:465},
            {x:146,y:471},
            {x:152,y:478},
            {x:152,y:482},
            {x:158,y:489},
            {x:163,y:489},
            {x:169,y:476},
            {x:172,y:474},
            {x:173,y:474},
            {x:182,y:482},
            {x:185,y:495},
            {x:195,y:502},
            {x:197,y:525},
            {x:201,y:536},
            {x:201,y:544},
            {x:208,y:550},
            {x:219,y:550},
            {x:233,y:535},
            {x:242,y:525},
            {x:244,y:519},
            {x:250,y:517},
            {x:256,y:489},
            {x:263,y:486},
            {x:273,y:475},
            {x:281,y:459},
            {x:284,y:447},
            {x:291,y:440},
            {x:295,y:428},
            {x:300,y:422},
            {x:306,y:422},
            {x:314,y:415},
            {x:319,y:405},
            {x:325,y:398},
            {x:331,y:370},
            {x:332,y:342},
            {x:337,y:329},
            {x:344,y:320},
            {x:344,y:325},
            {x:350,y:313},
            {x:355,y:313},
            {x:358,y:320},
            {x:364,y:320},
            {x:365,y:325},
            {x:368,y:325},
            {x:374,y:330},
            {x:379,y:340},
            {x:380,y:346},
            {x:389,y:352},
            {x:399,y:381},
            {x:404,y:381},
            {x:411,y:386},
            {x:413,y:393},
            {x:418,y:399},
            {x:419,y:405},
            {x:424,y:410},
            {x:429,y:410},
            {x:432,y:431},
            {x:436,y:445},
            {x:436,y:452},
            {x:441,y:452},
            {x:444,y:459}
            ];
        
        this.zoom = 1;

        this.buzz = new Buzz( 13*32, 9*32 );
    };

    Game.prototype = {        
        Update: function(dt){
            this.buzz.update(dt);
            for (var b = 1; b < this.buzz.body[0].pt.length; b++) 
            {
                for (var i = 1; i < this.landscape.length; i++) {
                    var x = Util.line_intersects(
                        this.buzz.body[0].pt[b-1].x + this.buzz.x,
                        this.buzz.body[0].pt[b-1].y + this.buzz.y,
                        this.buzz.body[0].pt[b].x + this.buzz.x,
                        this.buzz.body[0].pt[b].y + this.buzz.y,
                        this.landscape[i-1].x,
                        this.landscape[i-1].y,
                        this.landscape[i].x,
                        this.landscape[i].y);
debug.Print("mode","["+x+"]"); 
                }
            }
        },
        Render: function(){   
            Renderer.Clear(25*32,19*32);
            Renderer.VectorLine(this.landscape, PAL[1]);
            this.buzz.render();  
debug.Render(true, true);
        }
    };

    window.Game = Game;
})();
