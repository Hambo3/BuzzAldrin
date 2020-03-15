(function() {
    function Buzz(x, y) {
 
		this.enabled = true;

        this.x = x;
        this.y = y;
  

		this.scale = 1;
        this.rotation = 0;

        this.dx = 0;
        this.dy = 0;

        this.body = Factory.Ship(1);

    };

    Buzz.prototype = {	
        update: function(dt) {
            //this.x += this.rate;
            this.rotation +=0.1;
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
            if(input.isDown('X'))
            {
                this.scale += 0.01;
            }
            if(input.isDown('Z'))
            {
                this.scale -= 0.01;
            }

        },
        render: function() {
            Renderer.VectorSprite(this.x, this.y, this.body, this.rotation, this.scale);
		}
    };

    window.Buzz = Buzz;
})();