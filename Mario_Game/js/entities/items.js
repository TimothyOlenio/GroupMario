//Coin Entity
game.CoinEntity = me.CollectableEntity.extend(
    {
//--- extending the init function is not mandatory
//--- unless you need to add some extra initialization
        
    init: function (x, y, settings) 
        {
      
//--- call the parent constructor
            
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

        },

//--- this function is called by the engine, when
//--- an object is touched by something (here collected)
        
  onCollision : function (response, other) 
        {
//--- do something when collected
//--- make sure it cannot be collected "again"
    game.data.score += 250;
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

//--- remove it
            
    me.game.world.removeChild(this);

    return false
            
        }
});

//Mushroom entity
game.MushroomEntity = me.CollectableEntity.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
        // save the area size as defined in Tiled
        var width = settings.width;
        settings.image = "Mushroom";
        settings.frameWidth = settings.width = 16;
        settings.frameHeight = settings.height = 16;

    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {
        //do something when collected
        // make sure it cannot be collects "again"
        game.data.score += 1000;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);       
        // remove it
        me.game.world.removeChild(this);
                
        return false
    }
});

//1Up entity
game.OneUpEntity = me.CollectableEntity.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
        // save the area size as defined in Tiled
         var width = settings.width;
        settings.image = "1Up";
        settings.frameWidth = settings.width = 16;
        settings.frameHeight = settings.height = 16;

    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {
        //do something when collected
        // make sure it cannot be collects "again"
        game.data.score += 1000;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);       
        // remove it
        me.game.world.removeChild(this);
                
        return false
    }
});

//Leaf entity
game.LeafEntity = me.CollectableEntity.extend(
{
    // entending the init function is not manditoy
    // unless you need to add some extra initialization
    init: function (x, y, settings) 
    {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
        // save the area size as defined in Tiled
         var width = settings.width;
        settings.image = "Leaf";
        settings.frameWidth = settings.width = 16;
        settings.frameHeight = settings.height = 16;

    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {
        //do something when collected
        // make sure it cannot be collects "again"
        game.data.score += 1000;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);       
        // remove it
        me.game.world.removeChild(this);
                
        return false
    }
});