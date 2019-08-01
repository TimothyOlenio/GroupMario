//Warp Exit entity
game.pipeExit = me.Warp.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {        
        return false
    }
}); 


//Warp Enterance entity
game.pipeEnterance = me.Warp.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {
        /* //do something when collected       
        if(me.input.isKeyPressed('down'))
        {
            console.log("Down");
            //insert warp to area here
            game.PlayerEntity.x=(game.pipeExit.x)
            game.PlayerEntity.y=(game.pipeExit.y)
        } */
                
        return false
    }
}); 
