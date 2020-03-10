//handles map rendering and collisons
var MapManager = function () {
    var map = {
        set:null,
        dimensions:{width:0, height:0},
        tile:{width:32, height:32},
        screen:{width:0, height:0},
        colliders:{hit:[],over:[]},
        data:[]
    };
    var zoom = 1;
    var twidth = map.tile.width;
    var theight = map.tile.height;
    //var offset = {x:0,y:0};
    var scroll = {x:0, y:0,xoffset:0,yoffset:0};
    
    function hpoint(p){
        return Math.floor(p / twidth);
    }		
    function vpoint(p){
        return Math.floor(p / theight);
    }
    function cell(x, y){
        var h = hpoint(x);
        var v = vpoint(y);
        var p = h + (v * map.dimensions.width);
        return p;
    }
    function content(x,y){
        var cp = map.data[cell(x, y)];
        return cp;
    }
    function lerp(start, end, amt)
    {
        return (end-start) * amt+start;
    }

    function hitSomething(cell){
        return map.colliders.hit.indexOf(cell) != -1;
    }

    function scrollOffset() {
        return {x:(scroll.xoffset*twidth)-scroll.x,
                y:(scroll.yoffset*theight)-scroll.y};
    }

    function render() {
        var m = 0;
        var p;
        var mcols = map.dimensions.width;
        var col = parseInt( ((map.screen.width+1)*twidth)/(twidth*zoom) );
        var row = parseInt( ((map.screen.height+1)*twidth)/(twidth*zoom) );

debug.Print("col:","["+col+"]["+row+"]");         
        for(var r=0; r < row; r++) {
            for(var c = 0; c < col; c++) {
                m = ((r+scroll.yoffset) * mcols) + (c+scroll.xoffset);
                p = map.data[m];
try {
                       Renderer.Tile(
                    ((c * twidth) + (scroll.x))*zoom,//+offset.x, 
                    ((r * theight) + (scroll.y))*zoom,//+offset.y, 
                    map.set + p, zoom);   
} catch (error) {
   var x =zoom;
}
               


            } 
        }
    }
    
    return {
        ScrollTo: function(x, y){
            var midx = ( map.screen.width*twidth) / 2;
            var midy = ( map.screen.height*theight) / 2;
            var maxx = (map.dimensions.width * twidth) - ( map.screen.width*twidth);
            var maxy = (map.dimensions.height * theight) - ( map.screen.height*theight);

            var cpx = (scroll.xoffset*twidth)-scroll.x;
            var cpy = (scroll.yoffset*theight)-scroll.y;
            var destx = lerp(cpx, (x-midx), 0.04);
            var desty = lerp(cpy, (y-midy), 0.04);

            if(destx > 0 && destx < maxx)
            {
                scroll.x = -destx % twidth;
                scroll.xoffset = parseInt(destx / twidth);
            }
            if(desty > 0 && desty < maxy)
            {
                scroll.y = -desty % theight;
                scroll.yoffset = parseInt(desty / theight);
            }
        },
        Hit: function(x, y){
            return hitSomething(content(x, y));
        },
        MapSize: function(){
            return {width:map.dimensions.width * map.tile.width, 
                    height:map.dimensions.height * map.tile.height};
        },
        ScreenSize: function(){
            return {width:map.screen.width * map.tile.width, 
                    height:map.screen.height * map.tile.height};
        },        
        SetMap: function (m) {
            map = m;
        },
		Hpoint: function (p) {
			return hpoint(p);
		},
		Vpoint: function (p) {
			return vpoint(p);
		},		
        Content: function (x, y) {
            return content(x, y);
        },   
        IsVisible: function (perp) {
            var left = perp.x;
            var right = perp.x+perp.width;
            var top = perp.y;
            var bottom = perp.y+perp.height;

            var screenPos = scrollOffset();
            return( (right > screenPos.x && left < (screenPos.x + ( map.screen.width*map.tile.width)) ) && 
                (bottom > screenPos.y && top < (screenPos.y + ( map.screen.height*map.tile.height))) );
        },  
        mapCollision: function (perp, static) {
            var clx = false;
			if(static || perp.dx > 0){
				if( hitSomething(content(perp.x + perp.dx + perp.hitBox().r, perp.y + perp.hitBox().t)) || 
                hitSomething(content(perp.x + perp.dx + perp.hitBox().r, perp.y + perp.hitBox().b)) )
                {
                    perp.dx = 0;
                    clx = true;
				}
			}
			else if(static || perp.dx < 0){
				if(	hitSomething(content(perp.x + perp.dx + perp.hitBox().l, perp.y + perp.hitBox().t)) || 
                hitSomething(content(perp.x + perp.dx + perp.hitBox().l, perp.y + perp.hitBox().b)) )
                {
                    perp.dx = 0;
                    clx = true;
				}
            }			

			if(static || perp.dy > 0){
				if(	hitSomething(content(perp.x + perp.hitBox().l, perp.y + perp.dy + perp.hitBox().b)) || 
                hitSomething(content(perp.x + perp.hitBox().r, perp.y + perp.dy + perp.hitBox().b)) )
                {
                    perp.dy = 0;
                    clx = true;
				}
			}
			else if(static || perp.dy < 0){
				if(	hitSomething(content(perp.x + perp.hitBox().l, perp.y + perp.dy + perp.hitBox().t)) || 
                hitSomething(content(perp.x + perp.hitBox().r, perp.y + perp.dy + perp.hitBox().t)))
                {
                    perp.dy = 0;
                    clx = true;
				}
            }
            return clx;
        },
        ScrollOffset: function () {

            return {x:(scroll.xoffset*(map.tile.width))-scroll.x,
                    y:(scroll.yoffset*(map.tile.height))-scroll.y};
        }, 
        Scroll: function(x, y){             
            var xt = map.tile.width;            
            var yt = map.tile.height;
            var mw = map.dimensions.width - map.screen.width - 1;
            var mh = map.dimensions.height - map.screen.height - 1;
            if( (x > 0 && ((scroll.xoffset > 0) || (scroll.xoffset == 0 && scroll.x+x < 0))) || 
                (x < 0 && ((scroll.xoffset < mw) || (scroll.xoffset == mw && scroll.x+x >= -xt))) )
            {
                scroll.x += x;

                if(scroll.x < -xt){
                    scroll.x += xt;
                    scroll.xoffset++;
                }
                if(scroll.x > 0){
                    scroll.x -= xt;
                    scroll.xoffset--;
                } 
            }            

            if( (y > 0 && ((scroll.yoffset > 0) || (scroll.yoffset == 0 && scroll.y+y < 0))) || 
                (y < 0 && ((scroll.yoffset < mh) || (scroll.yoffset == mh && scroll.y+y >= -yt))) )
            {
                scroll.y += y;    
                if(scroll.y < -yt){
                    scroll.y += yt;
                    scroll.yoffset++;
                }
                if(scroll.y > 0){
                    scroll.y -= yt;
                    scroll.yoffset--;
                } 
            }    
            
        },
        Render: function () {
            render();            
        },
        SetZoom : function(z){
            zoom = z;
            //twidth = map.tile.width * zoom;
            //theight = map.tile.height * zoom;
        }
    }
};