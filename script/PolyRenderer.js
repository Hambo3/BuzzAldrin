//handles loading and keeps track of all graphics
//performs all rendering operations
var PolyRenderer = function (context, screen) {
    var ctx = context;
    var scale = 1;
    var bounds = null;
    
    if(screen)
    {
        bounds ={
            minx:0, 
            maxx:screen.w, 
            miny:0,
            maxy:screen.h};     
    }

    function PT(p){
        return p*scale;//Math.round(p*scale);
    }

    function R(pointX, pointY, angle) {
        // convert angle to radians
        angle = angle * Math.PI / 180.0
        // calculate center of rectangle
        var centerX = 0;
        var centerY = 0;
        // get coordinates relative to center
        var dx = pointX - centerX;
        var dy = pointY - centerY;
        // calculate angle and distance
        var a = Math.atan2(dy, dx);
        var dist = Math.sqrt(dx * dx + dy * dy);
        // calculate new angle
        var a2 = a + angle;
        // calculate new coordinates
        var dx2 = Math.cos(a2) * dist;
        var dy2 = Math.sin(a2) * dist;
        // return coordinates relative to top left corner
        return { x: dx2 + centerX, y: dy2 + centerY };
      }

    function polygon(x, y, poly){
        for(var i = 0; i < poly.length; i++) 
        {
            side(x, y, poly[i]);
        } 
    }

    function vector(x, y, poly, rot){
        for(var i = 0; i < poly.length; i++) 
        {
            box(x, y, poly[i], rot);
        } 
    }

    function side(x, y, plane){
        ctx.fillStyle = plane.col;
        ctx.beginPath();
        ctx.moveTo(PT(plane.pt[0].x + x), PT(plane.pt[0].y + y));

        for(var p = 1; p < plane.pt.length; p++) {
            ctx.lineTo(PT(plane.pt[p].x + x), PT(plane.pt[p].y + y) );   
        }
        ctx.closePath();
        ctx.fill();
    }

    function box(x, y, plane, rot){
        ctx.strokeStyle = plane.col;
        ctx.beginPath();

        var r = R(plane.pt[0].x, plane.pt[0].y, rot);
        ctx.moveTo(PT(r.x + x), PT(r.y + y));

        for(var p = 1; p < plane.pt.length; p++) {
            r = R(plane.pt[p].x, plane.pt[p].y, rot);
            ctx.lineTo(PT(r.x + x), PT(r.y + y) );  
        }
        ctx.stroke();
    }

    function vectorLine(poly, col, start, scale){
        ctx.strokeStyle = col;
        ctx.beginPath();

        ctx.moveTo((poly[0].x * scale) - start.x, (poly[0].y * scale) - start.y);

        for(var p = 1; p < poly.length; p++) {
            ctx.lineTo((poly[p].x * scale) - start.x , (poly[p].y * scale)- start.y);  
        }
        ctx.stroke();
    }

    function inBounds(x, y){
        return (!bounds || ((x > bounds.minx && x < bounds.maxx) && (y > bounds.miny  && y < bounds.maxy)) ); 
    }
    return {
        Clear: function(w,h,x,y){
            ctx.clearRect(x||0, y||0, w, h);
        },   
        VectorSprite: function(x, y, poly, a, s){
            scale = s;
            //if(inBounds(x,y)) {
                vector(x, y, poly, a);    
                return 1;
            //}
            //return 0;
        }, 
        VectorLine: function(poly, col, start, scale){
            vectorLine(poly, col, start, scale);
        },
        DrawText: function(txt, x, y, col, font){
            context.font = font || "12px Arial";
            context.fillStyle = col ? col : PAL[1];
            //context.textAlign = "center";
            context.fillText(txt, x, y);
        }             
    }
};