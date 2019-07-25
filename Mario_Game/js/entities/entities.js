game.PlayerEntity = me.Entity.extend
({
    /**
     * constructor
     */
    init:function (x, y, settings) 
    {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
//---- max walking & jumping speed
        this.body.setMaxVelocity(2, 12);
        this.body.setFriction(0.6, 0);

//---- set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

//---- ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

//---- define a basic walking animation (using 2 frames)
        this.renderable.addAnimation("walk",  [0, 1]);
// --- Jumping Animation
        this.renderable.addAnimation("jump",  [0, 2]);

//---- define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);
      
//---- set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) 
    {
        
    if(me.input.isKeyPressed('run')) 
        {
        this.body.setMaxVelocity(3, 15);
        }        
      else  {
          this.body.setMaxVelocity(2, 12);
            }
          
          if (me.input.isKeyPressed('left')) 
            {

          // flip the sprite on horizontal axis
          this.renderable.flipX(true);
          // update the default force
          this.body.force.x = -this.body.maxVel.x;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) 
                {
              this.renderable.setCurrentAnimation("walk");
                }
            } else if (me.input.isKeyPressed('right')) 
                    {

                      // unflip the sprite
                      this.renderable.flipX(false);
                      // update the entity velocity
                      this.body.force.x = this.body.maxVel.x;
                      // change to the walking animation
                      if (!this.renderable.isCurrentAnimation("walk")) {
                          this.renderable.setCurrentAnimation("walk");
          }
                    } 
                    else 
                    {
                      this.body.force.x = 0;
                      // change to the standing animation
                      this.renderable.setCurrentAnimation("stand");
                    }     

      if (me.input.isKeyPressed('jump')) 
      {
          if (!this.body.jumping && !this.body.falling && !this.body.jumping == 1)
          {   
              // --- Sets Jumping to 0, so mario can jump
              this.body.jumping = 0;
              // set current vel to the maximum defined value
              // gravity will then do the rest
              this.body.force.y = -this.body.maxVel.y
          }
      } 
        else 
      {
          this.body.force.y = 0;
          // --- Sets Jumping to 1, so Mario cant jump mid air
          this.body.jumping = 1;
      }

      // apply physics to the body (this moves the entity)
        this.body.update(dt);

      // handle collisions against other shapes
        me.collision.check(this);

      // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    
   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) 
        {
        
            switch (response.b.body.collisionType) 
            {
                case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") 
                {
                    if (this.body.falling &&
                    !me.input.isKeyPressed('down') &&

                    // Shortest overlap would move the player upward
                    (response.overlapV.y > 0) &&

                    // The velocity is reasonably fast enough to have penetrated to the overlap depth
                    (~~this.body.vel.y >= ~~response.overlapV.y)
                    ){
                        // Disable collision on the x axis
                        response.overlapV.x = 0;

                        // Repond to the platform (it is solid)
                        return true;
                     }

                    // Do not respond to the platform (pass through)
                    return false;
                }
                    break;

            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping) 
            {
                this.pos.y = other.pos.y - this.height;
                // bounce (force jump)
                this.body.falling = false;
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

                // set the jumping flag
                this.body.jumping = true;
            }
            else 
            {
        // let's flicker in case we touched an enemy
                this.renderable.flicker(750);
            }

                // Fall through

            default:
                 // Do not respond to other objects (e.g. coins)
            return false;
            }

  // Make the object solid
     return true;
        }
});

/**
 * a Coin entity
 */

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
    },       
    //this function is called by the engine when an object is touched by something (here collected)
    onCollision : function (response, other) 
    {
        //do something when collected
        // make sure it cannot be collects "again"
        game.data.score += 250;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);       
        // remove it
        me.game.world.removeChild(this);
                
        return false
    }
});

/**
 * an enemy Entity
 */
 game.GoombaEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
// save the area size as defined in Tiled
         var width = settings.width;

// define this here instead of tiled
         settings.image = "Goomba_Walk";

// adjust the size setting information to match the sprite size
// so that the entity object is created with the right size
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;

// call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

// add a physic body
         this.body = new me.Body(this);
// add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
// configure max speed and friction
         this.body.setMaxVelocity(1, 6);
         this.body.setFriction(0.4, 0);
// enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

// set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
//this.pos.x  = x + width - this.width;

// to remember which side we were walking
         this.walkLeft = false;

// make it "alive"
         this.alive = true;
     },

// manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             if (this.walkLeft && this.pos.x <= this.startX)
             {
                 this.walkLeft = false;
                 this.body.force.x = this.body.maxVel.x;
             }
             else if (!this.walkLeft && this.pos.x >= this.endX)
             {
                 this.walkLeft = true;
                 this.body.force.x = -this.body.maxVel.x;
             }

             this.flipX(this.walkLeft);
         }
         else
         {
             this.body.force.x = 0;
         }
// check & update movement
         this.body.update(dt);

// handle collisions against other shapes
         me.collision.check(this);

// return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

/**
 * colision handler
 * (called when colliding with other objects)
 */
     onCollision : function (response, other) {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
     }
 });


game.WingGoombaEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
// save the area size as defined in Tiled
         var width = settings.width;

// define this here instead of tiled
         settings.image = "still need sprite";

// adjust the size setting information to match the sprite size
// so that the entity object is created with the right size
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;

// call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

// add a physic body
         this.body = new me.Body(this);
// add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
// configure max speed and friction
         this.body.setMaxVelocity(1, 6);
         this.body.setFriction(0.4, 0);
// enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

// set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
//this.pos.x  = x + width - this.width;

// to remember which side we were walking
         this.walkLeft = false;

// make it "alive"
         this.alive = true;
     },

// manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             if (this.walkLeft && this.pos.x <= this.startX)
             {
                 this.walkLeft = false;
                 this.body.force.x = this.body.maxVel.x;
             }
             else if (!this.walkLeft && this.pos.x >= this.endX)
             {
                 this.walkLeft = true;
                 this.body.force.x = -this.body.maxVel.x;
             }

             this.flipX(this.walkLeft);
         }
         else
         {
             this.body.force.x = 0;
         }
// check & update movement
         this.body.update(dt);

// handle collisions against other shapes
         me.collision.check(this);

// return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

/**
 * colision handler
 * (called when colliding with other objects)
 */
     onCollision : function (response, other) {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
     }
 });

 game.KoopaEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
// save the area size as defined in Tiled
         var width = settings.width;

// define this here instead of tiled
         settings.image = "Gargantua_koopa";

// adjust the size setting information to match the sprite size
// so that the entity object is created with the right size
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;

// call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

// add a physic body
         this.body = new me.Body(this);
// add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
// configure max speed and friction
         this.body.setMaxVelocity(1, 6);
         this.body.setFriction(0.4, 0);
// enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

// set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
//this.pos.x  = x + width - this.width;

// to remember which side we were walking
         this.walkLeft = false;

// make it "alive"
         this.alive = true;
     },

// manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             if (this.walkLeft && this.pos.x <= this.startX)
             {
                 this.walkLeft = false;
                 this.body.force.x = this.body.maxVel.x;
             }
             else if (!this.walkLeft && this.pos.x >= this.endX)
             {
                 this.walkLeft = true;
                 this.body.force.x = -this.body.maxVel.x;
             }

             this.flipX(this.walkLeft);
         }
         else
         {
             this.body.force.x = 0;
         }
// check & update movement
         this.body.update(dt);

// handle collisions against other shapes
         me.collision.check(this);

// return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

/**
 * colision handler
 * (called when colliding with other objects)
 */
     onCollision : function (response, other) {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
     }
 });


/**
 * Overworld Mario Entity
 *

 game.LilMario = me.Sprite.extend({
     // constructor
     init:function (x, y, settings) {
         // call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

         // define a basic walking animation
         this.addAnimation("walk",  [...]);
         // define a standing animation (using the first frame)
         this.addAnimation("stand",  [...]);
         // set the standing animation as default
         this.setCurrentAnimation("stand");

         // add a physic body
         this.body = new me.Body(this);
         // add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         // configure max speed and friction
         this.body.setMaxVelocity(3, 15);
         this.body.setFriction(0.4, 0);

         // enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

         // set the display to follow our position on both axis
         me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
     },
 }); 

*/