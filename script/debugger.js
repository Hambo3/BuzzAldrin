
var Debug = function (options) {
    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    var lineht = 16;
    var lines = {};
    var txtCol = '#FF0000';

    var width;
    var height;
    var ctx;
    if(options){
        width=options.width;
        height=options.height;
        ctx = options.ctx;
    }
    if(!ctx){
        var canvas = document.createElement("canvas");
        canvas.className = "debugger";
        if(canvas.getContext)
        {
            ctx = canvas.getContext("2d");
            ctx.font = "30px Arial";
            canvas.width = width;
            canvas.height = height;

            var b = document.getElementById(options.canvas);
            b.appendChild(canvas);			
        }        
    }

    function ShowFps() {
        var currentLoop = (new Date()).getMilliseconds();
        if (lastLoop > currentLoop) {
          fps = count;
          count = 1;
        } else {
          count += 1;
        }
        lastLoop = currentLoop;
        return fps;
      }

    return {
        Print: function (id, text)//debug.Print("key",value);
        {
            lines[id] = text;
            //lines.push(text);            
        },
        Render: function(rend, showFps){
            if(rend == true){
                //ctx.clearRect(0, 0, width, height);
                var x=0;
                var y=lineht;
                ctx.font = lineht+"px Arial";
                
                //ctx.clearRect(0, 0, width, lineht * (Object.keys(lines).length+2));

                if(showFps == true){
                    //ctx.clearRect(0, y-lineht, width, lineht);
                    ctx.fillStyle = txtCol;
                    ctx.fillText(ShowFps(), x, y);
                    y+=lineht; 
                }                

                for (var key in lines) {
                    //ctx.clearRect(0, y-lineht, width, lineht);
                    ctx.fillStyle = txtCol;
                    ctx.fillText(key+":"+lines[key], x, y);
                    y+=lineht; 
                }            
            }
        }
    }
};
