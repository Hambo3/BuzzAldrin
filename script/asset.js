(function() {
    function Buzz(x, y, width, height, anims, initialAnim, r, s) {
 
		this.enabled = true;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
		this.anims = anims;
        this.currentAnim = initialAnim;       

		this.scale = s;
        this.rotation = 0;
        this.rate = r;
                
        this.frame = 0;
        this.frameNum = 0;
		this.frameRate = 16;

        this.dx = 0;
        this.dy = 0;
        
        this.sprite = new Sprite();
        this.sprite.Init(
            {
                src: this.currentAnim,
                x:this.x,
				y:this.y,
				scale:this.scale
            });  
    };

    Buzz.prototype = {	
        update: function(dt, z, os) {
            //this.x += this.rate;
            //this.rotation +=0.01;
            if(input.isDown('UP'))
            {
                this.y -=1;
            }
            if(input.isDown('DOWN'))
            {
                this.y +=1;
            }
            if(input.isDown('LEFT'))
            {
                this.x -=1;
            }
            if(input.isDown('RIGHT'))
            {
                this.x +=1;
            }
            this.scale = z;
debug.Print("buzz:","["+this.x.toFixed(2)+"]["+this.y.toFixed(2)+"]");            
			this.sprite.Update(dt, 
				{
					x:this.x-os.x, 
					y:this.y-os.y, 
					frame:this.frame, 					
                    src:this.currentAnim,
                    scale:this.scale,
                    rotation:this.rotation
                });
        },
        render: function() {
            this.sprite.Render();
		}
    };

    window.Buzz = Buzz;
})();