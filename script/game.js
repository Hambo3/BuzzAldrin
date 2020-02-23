(function() {
    function Game() {
 
    };

    Game.prototype = {
        Update: function(dt){
            console.log("update");
        },
        Render: function(){      
        }
    };

    window.Game = Game;
})();
