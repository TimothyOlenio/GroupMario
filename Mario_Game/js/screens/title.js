// Title Menu


game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        ; // TODO
        me.levelDirector.loadLevel("Mario_Title");
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    
    

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        ; // TODO
    }
});
