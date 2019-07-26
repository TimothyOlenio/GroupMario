
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
            me.debug.renderHitBox = true;
            me.sys.pauseOnBlur = false;
            me.sys.stopOnBlur = false;
        // Initialize the video.
        if (!me.video.init(480, 360, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

// -- Run on game resources loaded.
    
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.START, new game.StartScreen());

// -- add our player entity in the entity pooc
        
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("GoombaEntity", game.GoombaEntity);
        me.pool.register("CoinEntity", game.CoinEntity);
        me.pool.register("MushroomEntity", game.MushroomEntity);
        me.pool.register("KoopaEntity", game.KoopaEntity);
        
        //me.pool.register("FirePiranhaEntity", game.FirePiranhaEntity);
        // me.pool.register("LilMario", game.LilMario);

        
// -- Enable Keyboard 
        
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X, "jump", true);
        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.Z, "run");

// -- Start the game.
        
        me.state.change(me.state.MENU);
    }
};
