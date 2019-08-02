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
        return false
    }
}); 

//Title Screen Warp
game.PressEnter = me.Warp.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },    
    //Needs Fixed
    if(me.input.isKeyPressed('enter'))
    {
        me.levelDirector.loadLevel("Mario_1-1");
    };
}); 