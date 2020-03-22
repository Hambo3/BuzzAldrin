var Util = {

    line_intersects: function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;

        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)    
        {    
            // Collision detected
            return 1;
        }

        return 0; // No collision    
    },
    Rnd: function (min, max){
        return parseInt(Math.random() * (max-min)) + min;
    }, 
    Lerp: function(start, end, amt)
    {
        return (end-start) * amt+start;
    }
}

// a v simple object pooler
var ObjectPool = function () {
    var list = [];

    return {
        Add: function(obj){
            for (var i = 0; i < list.length; i++) {
                if (list[i].enabled == false)
                {
                    list[i] = obj;
                    return list[i];
                }
            }
            list.push(obj);         
        },
        Get: function(){
            return list.filter(l => l.enabled);
        },
        Count: function(all){
            return (all) ? list : list.filter(l => l.enabled).length;
        }      
    }
};

var Factory = {
    Ship: function (col){
        return [
            {col: PAL[col], pt: [{x:-32, y:-32},{x:32, y:-32},{x:32, y:32},{x:-32, y:32},{x:-32, y:-32}] }
            ];
    }
};

//pallette
var PAL = [
    "#000000",
    "#FFFFFF"
    ];

var Const = {
    game:{
        friction:6,
        mobFont:"12px Arial",
        h1Font:"bold 48px Arial",
        h2Font:"24px Arial",
        h3Font:"16px Arial"
    },
    actors:{
        player:1,
        shopr: 2,
        troll: 3,
        hater: 4,
    },
    txts:{
        msgs:[
        'At the mall, lol',
        'Really need the loo',
        'Ive been here for ages',
        'Just seen @BrianHambo3',
        'Need a charge point, lol',
        'Outside Pret lol',
        'Going to get new shoes',
        'Where can I get a doughnut',
        'I always wanted to be a lumberjack']
    }
}
