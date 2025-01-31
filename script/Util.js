var Util = {

    // Converts from degrees to radians.
    Radians: function(degrees) {
        return degrees * Math.PI / 180;
    },    
    // Converts from radians to degrees.
    Degrees: function(radians) {
        return radians * 180 / Math.PI;
    },
    Distance: function(x1, y1, x2, y2){
        var x = x2 - x1;
        var y = y2 - y1;
        return Math.sqrt(x*x + y*y);
    },
    line_intersects: function( a,  b,  c,  d)
    {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = b.x - a.x;
        s1_y = b.y - a.y;
        s2_x = d.x - c.x;
        s2_y = d.y - c.y;

        var s, t;
        s = (-s1_y * (a.x - c.x) + s1_x * (a.y - c.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (a.y - c.y) - s2_y * (a.x - c.x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)    
        {    
            // Collision detected
            return 1;
        }

        return 0; // No collision  
    },
    Direction: function(angle, speed)
    {
        angle = angle * Math.PI / 180.0;
        
        return {x:-(speed * Math.sin(angle)),
                y:speed * Math.cos(angle)};
    },
    RotatePoint: function (pointX, pointY, angle){
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
    },
    ArrayFirst: function(arr, index) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].index == index)
                return arr[i];
        }    
        return null;
    },
    OneIn: function(c){
        return Util.Rnd(0,c)==0;
    },
    OneOf: function(arr){
        return arr[Util.Rnd(0,arr.length)];
    },
    Rndf: function (min, max){
        return (Math.random() * (max-min)) + min;
    }, 
    Rnd: function (min, max){
        return parseInt(Math.random() * (max-min)) + min;
    }, 
    Lerp: function(start, end, amt)
    {
        return (end-start) * amt+start;
    },
    SLerp: function(start, end, amt)
    {
        return ((start+amt) < end) ? start+amt : end;
    },
    Scale: function(src, sc)    //scales a factory item
    {
        var poly = src;
        for (let p = 0; p < poly.length; p++) {
            for (let i = 0; i < poly[p].pt.length; i++) {
                poly[p].pt[i].x *= sc;
                poly[p].pt[i].y *= sc;
            }
        }
        return poly;
    },
    ScrollTo: function(x, y, screen, map, offset, lerp){
        var midx = screen.width / 2;
        var midy = screen.height / 2;
        var maxx = map.width - screen.width;
        var maxy = map.height - screen.height;

        var destx = (x-midx);
        var desty = (y-midy);

        if(lerp){
            destx = Util.Lerp(offset.x, destx, 0.04);
            desty = Util.Lerp(offset.y, desty, 0.04);
        }

        if(destx > 0){
            if(destx < maxx)
            {
                offset.x = destx;
            }
            else{
                offset.x = maxx;
            }            
        }
        else{
            offset.x = 0;
        }

        if(desty > 0){
            if(desty < maxy)
            {
                offset.y = desty;
            }
            else{
                offset.y = maxy;
            }            
        }
        else{
            offset.y = 0;
        }

        return offset;
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
    RightArrow: function (col){
        return [
            {col: PAL[col], pt: [{x:0, y:0},{x:0, y:5},{x:9, y:0},{x:0, y:-5},{x:0, y:0},{x:-19, y:0}] }
            ];
    },
    LeftArrow: function (col){
        return [
            {col: PAL[col], pt: [{x:0, y:0},{x:0, y:5},{x:-9, y:0},{x:0, y:-5},{x:0, y:0},{x:19, y:0}] }
            ];
    },
    UpArrow: function (col){
        return [
            {col: PAL[col], pt: [{x:0, y:0},{x:5, y:0},{x:0, y:-9},{x:-5, y:0},{x:0, y:0},{x:0, y:19}] }
            ];
    },
    DownArrow: function (col){
        return [
            {col: PAL[col], pt: [{x:0, y:0},{x:5, y:0},{x:0, y:9},{x:-5, y:0},{x:0, y:0},{x:0, y:-19}] }
            ];
    },
    Box: function (col){
        return [
            {col: PAL[col], pt: [{x:-16, y:-16},{x:16, y:-16},{x:16, y:16},{x:-16, y:16},{x:-16, y:-16}] }
            ];
    },
    Terrain: function(scale, oy){
        var b = [{x:0,y:0},
            {x:5,y:0},
            {x:6,y:5},
            {x:11,y:5},
            {x:12,y:10},
            {x:15,y:10},
            {x:16,y:25},
            {x:20,y:37},
            {x:20,y:45},
            {x:22,y:53},
            {x:30,y:58},
            {x:33,y:71},
            {x:39,y:77},
            {x:44,y:77},
            {x:51,y:69},
            {x:57,y:60},
            {x:64,y:53},
            {x:66,y:48},
            {x:71,y:43},
            {x:75,y:37},
            {x:77,y:37},
            {x:81,y:33},
            {x:83,y:29},
            {x:88,y:28},
            {x:93,y:24},
            {x:100,y:24},
            {x:103,y:25},
            {x:108,y:29},
            {x:109,y:34},
            {x:113,y:38},
            {x:114,y:43},
            {x:118,y:48},
            {x:119,y:53},
            {x:123,y:58},
            {x:128,y:58},
            {x:131,y:48},
            {x:134,y:46},
            {x:136,y:46},
            {x:140,y:49},
            {x:143,y:55},
            {x:145,y:62},
            {x:152,y:67},
            {x:153,y:83},
            {x:157,y:95},
            {x:157,y:101},
            {x:161,y:106},//46
            {x:173,y:106},//46
            {x:183,y:92},
            {x:183,y:95},
            {x:190,y:83},
            {x:190,y:85},
            {x:196,y:78},
            {x:201,y:58},
            {x:206,y:55},
            {x:213,y:47},
            {x:220,y:36},
            {x:223,y:24},
            {x:231,y:15},
            {x:232,y:10},
            {x:236,y:5},
            {x:240,y:5},
            {x:247,y:-3},
            {x:248,y:-5},
            {x:255,y:-14},
            {x:260,y:-52},
            {x:260,y:-36},
            {x:261,y:-58},
            {x:264,y:-68},
            {x:266,y:-71},
            {x:269,y:-71},
            {x:271,y:-77},
            {x:272,y:-82},//72
            {x:280,y:-82},//72
            {x:281,y:-77},
            {x:286,y:-77},
            {x:287,y:-72},
            {x:290,y:-72},
            {x:297,y:-66},
            {x:299,y:-55},
            {x:307,y:-50},
            {x:314,y:-29},
            {x:319,y:-28},
            {x:324,y:-24},
            {x:325,y:-18},
            {x:329,y:-15},
            {x:330,y:-9},
            {x:334,y:-5},
            {x:339,y:-5},
            {x:342,y:29},//89
            {x:350,y:29},//89
            {x:350,y:34},
            {x:354,y:40},
            {x:356,y:49},
            {x:358,y:53},
            {x:363,y:58},
            {x:364,y:73},
            {x:368,y:85},
            {x:368,y:93},
            {x:369,y:97},
            {x:373,y:101},
            {x:378,y:101},
            {x:380,y:111},
            {x:393,y:125},//103
            {x:432,y:125},//103
            {x:434,y:109},
            {x:439,y:101},
            {x:442,y:91},
            {x:444,y:91},
            {x:447,y:83},
            {x:456,y:72},
            {x:461,y:71},
            {x:466,y:67},
            {x:471,y:67},
            {x:479,y:93},
            {x:491,y:105},
            {x:493,y:115},
            {x:500,y:120},
            {x:512,y:120},
            {x:521,y:121},
            {x:530,y:125},//120
            {x:549,y:125},//120
            {x:553,y:109},
            {x:554,y:91},
            {x:559,y:91},
            {x:562,y:82},
            {x:568,y:76},
            {x:570,y:66},
            {x:574,y:62},
            {x:579,y:62},
            {x:583,y:43},
            {x:588,y:38},
            {x:589,y:38},
            {x:592,y:43},//133
            {x:604,y:43},//133
            {x:608,y:38},
            {x:609,y:28},
            {x:613,y:17},
            {x:618,y:14},
            {x:619,y:10},
            {x:627,y:1}
            ];

        b.forEach(t => {
            t.x *= scale;
            t.y = (t.y * scale) + oy;
        });

        return b;
    },
    BuzzTerrain: function(scale, oy){
        var b = [{x:0,y:0},
            {x:5,y:0},
            {x:16,y:9},
            {x:23,y:18},
            {x:23,y:28},
            {x:26,y:31},
            {x:30,y:34},
            {x:43,y:35},
            {x:48,y:39},
            {x:51,y:44},
            {x:53,y:51},
            {x:56,y:54},
            {x:60,y:56},
            {x:67,y:56},
            {x:68,y:57},
            {x:82,y:57},
            {x:93,y:52},
            {x:111,y:37},
            {x:113,y:36},
            {x:122,y:36},
            {x:128,y:40},
            {x:131,y:50},
            {x:133,y:55},
            {x:144,y:69},
            {x:149,y:80},
            {x:152,y:100},
            {x:158,y:106},
            {x:179,y:106},
            {x:190,y:96},
            {x:203,y:85},
            {x:215,y:67},
            {x:224,y:57},
            {x:231,y:51},
            {x:240,y:32},
            {x:250,y:17},
            {x:256,y:18},
            {x:267,y:26},
            {x:281,y:32},
            {x:303,y:31},
            {x:323,y:22},
            {x:338,y:21},
            {x:368,y:52},
            {x:375,y:89},
            {x:393,y:125},
            {x:432,y:125},
            {x:437,y:95},
            {x:456,y:72},
            {x:469,y:64},
            {x:493,y:60},
            {x:507,y:53},
            {x:514,y:55},
            {x:529,y:99},
            {x:560,y:99},
            {x:580,y:76},
            {x:585,y:60},
            {x:591,y:54},
            {x:600,y:54},
            {x:608,y:56},
            {x:615,y:52},
            {x:627,y:20},
        ];

        b.forEach(t => {
            t.x *= scale;
            t.y = (t.y * scale) + oy;
        });

        return b;
    },
    HelpTerrain: function(){

        var b =[{x:191, y:399},
                {x:199, y:417},
                {x:260, y:456},
                {x:262, y:496},
                {x:273, y:520},
                {x:296, y:535},
                {x:503, y:535},
                {x:535, y:477},
                {x:564, y:453},
                {x:577, y:415},
                {x:642, y:394}
                ];
                return b;        
    },
    LEM: function (col){
        return [
            {col: PAL[col], pt: [{x:-14, y:17},{x:-18, y:17},{x:-16, y:16},{x:-11, y:6}] },
            {col: PAL[col], pt: [{x:14,y:17},{x:18,y:17},{x:16,y:16},{x:11, y:6}] },                
            {col: PAL[col], pt: [{x:-6, y:6},{x:-9, y:14},{x:9, y:14},{x:5, y:6}] },
            {col: PAL[col], pt: [{x:-11, y:6},{x:-11, y:2},{x:11, y:2},{x:11, y:6},{x:-11, y:6}] },
            {col: PAL[col], pt: [{x:-5, y:1},{x:-11, y:-4},{x:-11, y:-11},{x:-4, y:-18}, {x:4, y:-18},{x:11, y:-11},{x:11, y:-4},{x:5, y:1},{x:-5, y:1}] },
            
            {col: PAL[0], pt: [{x:-16, y:18},{x:-16, y:16}] },//left foot
            {col: PAL[0], pt: [{x:16, y:18},{x:16, y:16}] },  //right foot

            {col: PAL[col], pt: [{x:-9, y:14},{x:0, y:14},{x:9, y:14}] }//flame
            ];
    },
    Orbiter: function (col, y){
        var b = [
            {col: PAL[col], pt: [{x:-13, y:19},{x:-13, y:-14},{x:13, y:-14},{x:13, y:19},{x:-13,y:19}] },
            {col: PAL[col], pt: [{x:-13, y:19},{x:-4, y:31},{x:4, y:31},{x:13,y:19}] },
            {col: PAL[col], pt: [{x:-4, y:-14},{x:-9, y:-31},{x:9, y:-31},{x:4,y:-14}] }
            ];

        b.forEach(t => {
            t.pt.forEach(p => {
                p.y += y;
            });
        });

        return b;
    },
    Buzz: function (col, scale){
        return [
            {col: PAL[col], pt: [ {x:-3, y:5}, {x:-7, y:12}, {x:-7, y:17}, {x:-15, y:17}, {x:-16, y:16}, {x:-16, y:14}, {x:-15, y:13}, {x:-12, y:13}, {x:-10, y:4}, {x:-6, y:-1}, {x:-6, y:-10}, {x:-10, y:-8}, {x:-10, y:-3}, {x:-11, y:-2}, 
                {x:-13, y:-2}, {x:-14, y:-3},  {x:-14, y:-10}, {x:-9, y:-15}, {x:-5, y:-15},           
                {x:5, y:-15}, {x:9, y:-15},  {x:14, y:-10}, {x:14, y:-3}, {x:13, y:-2}, {x:11, y:-2}, {x:10, y:-3}, {x:10, y:-8}, {x:6, y:-10}, {x:6, y:-1}, {x:10, y:4},
                {x:12, y:13}, {x:15, y:13}, {x:16, y:14}, {x:16, y:16}, {x:15, y:17}, {x:7, y:17}, {x:7, y:12},{x:3, y:5}, {x:-3, y:5}
            ]},
            {col: PAL[col], pt:[{x:-3, y:-15}, {x:-5, y:-17}, {x:-5, y:-22}, {x:-4, y:-23}, {x:-3, y:-24}, {x:3, y:-24} ,{x:4, y:-23}, {x:5, y:-22}, {x:5, y:-17}, {x:3, y:-15}, {x:-3, y:-15}]},
            {col: PAL[col], pt: [{x:-2, y:-17},{x:-3, y:-18},{x:-3, y:-20},{x:-2, y:-21}, {x:2, y:-21},{x:3, y:-20},{x:3, y:-18},{x:2, y:-17},{x:-2, y:-17}] },

            {col: PAL[0], pt: [{x:-11, y:18},{x:-11, y:16}] },//left foot
            {col: PAL[0], pt: [{x:11, y:18},{x:11, y:16}] },  //right foot

            {col: PAL[0], pt: [{x:0, y:6},{x:0, y:8}] }
        ];
    }
};

//pallette
var PAL = [
    "#000000",
    "#FFFFFF",
    "#EEEEEE",
    "#DDDDDD",
    "#CCCCCC",
    "#BBBBBB",
    "#AAAAAA",
    "#999999",
    "#888888",
    "#777777",
    "#666666",
    "#555555",
    "#444444",
    "#333333",
    "#222222",
    "#111111",
    "#000000"
    ];


var Const = {
    State:{
        disabled:0,
        enabled:1,
        crashed:2,
        landed:3,
        finished:4,
        congrats:5
    },
    GameState:{
        title:0,
        buzzActive:1,
        buzzFail:2,
        buzzSuccess:3
    },
    Sound:{
        crash:0,
        thrust:1,
        ambient:2,
        farts:3,
        goforundock:4,
        eaglehaswings:5,
        lookinggood:6,
        radiocrackle:7,
        standingby:8
    }
}
