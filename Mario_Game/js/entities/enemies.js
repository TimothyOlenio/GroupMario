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
         this.body.setMaxVelocity(0.6, 6);
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
                this.onDeath();
            }
            else 
            {
                
            }

                // Fall through

            default:
                 // Do not respond to other objects (e.g. coins)
            return false;
            }

  // Make the object solid
     return true;
        },
     
     onDeath: function () 
     {
     
       game.data.score += 100;
       me.game.world.removeChild(this);
       console.log("closer");   
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
         //this.pos.y = other.pos.y - 5 - this.height;
                // bounce (force jump)
           //     this.body.falling = false;
             //   this.body.vel.y = -this.body.maxVel.y * //me.timer.tick;

                // set the jumping flag
               // this.body.jumping = true;
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
         settings.image = "RedKoopa_Walk";

// adjust the size setting information to match the sprite size
// so that the entity object is created with the right size
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 27;

// call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

// add a physic body
         this.body = new me.Body(this);
// add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
// configure max speed and friction
         this.body.setMaxVelocity(0.5, 6);
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
    onCollision : function (response, other) 
     {
        switch(response.b.body.collisionType)
        {
            case me.collision.types.WORLD_SHAPE:        
                if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) 
                {
                    // res.y >0 means touched by something on the bottom
                    // which mean at top position for this one
                    if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) { 
                       
                 
                }
             return false;
         }
             break;
                
            case me.collision.types.PlayerEntity:
               
                if(reponse.b.body.collisionType == me.collision.type.PlayerEntity)
                    {
                        if (this.alive && (this.body.pos.overlapV.y < 0) && game.PlayerEntity.pos.overlapV.y)
                            {
                                me.state.pause();
                            }
                        return false;
                    }
             break;
         // Make all other objects solid
         return true;
        }
        
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

/**
 * an enemy Entity
 */
game.PiranhaEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
// save the area size as defined in Tiled
         var height = settings.height;

// define this here instead of tiled
         settings.image = "plant";

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
         y = this.pos.y;
         this.startY = y;
         this.pos.y = this.endY = y + height - this.height;
//this.pos.x  = x + width - this.width;

// to remember which side we were walking
         this.comeUp = false;

// make it "alive"
         this.alive = true;
     },

// manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             if (this.comeUp && this.pos.y <= this.startY)
             {
                 this.comeUp = false;
                 this.body.force.y = this.body.maxVel.y;
             }
             else if (!this.comeUp && this.pos.y >= this.endY)
             {
                 this.comeUp = true;
                 this.body.force.y = -this.body.maxVel.y;
             }

             //this.flipX(this.comeUp);
         }
         else
         {
             this.body.force.y = 0;
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
          switch (response.b.body.collisionType) 
            {
                case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "pipes") 
                {
                    return false;
                }
                
            }
         
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
 

game.FirePiranhaEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
         // save the area size as defined in Tiled
         var height = settings.height;

         // define this here instead of tiled
         settings.image = "plant";

         // adjust the size setting information to match the sprite size
         // so that the entity object is created with the right size
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;

         // call the parent constructor
         this._super(me.Sprite, 'init', [x, y, settings]);

         // add a physic body
         this.body = new me.Body(this);

         // add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));

         // configure max speed and friction
         this.body.setMaxVelocity(1, 6);
         this.body.setFriction(0.4, 0);

         // enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;


         // define the x so that the entity can flip when mario jumps over it
         x = this.pos.x;

         // set start/end position based on the initial area size
         y = this.pos.y;
         this.startY = y;
         this.pos.y = this.endY = y + height - this.height;

         //this.pos.x  = x + width - this.width;
         
         //Create Player Variable to store, getChildByName is expensive!!!!
         //this.player = me.game.world.getChildByName("mainPlayer")[0];
         //this.player = me.pool.pull('mainPlayer',100,100);


         // to remember which side we were walking
         this.comeUp = false;
         this.faceLeft = true;


         // make it "alive"
         this.alive = true;
     },


     // manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             //this.flipX(this.faceLeft);
             //console.log(this.player);
             //make it face mario
             //if (this.player.pos.x <= this.pos.x)
             //{
             //    this.faceLeft = true;
             //}
             //else    
             //{
            //     this.faceLeft
             //}
             if (this.comeUp && this.pos.y <= this.startY)
             {
                 this.comeUp = false;
                 this.body.force.y = this.body.maxVel.y;
             }
             else if (!this.comeUp && this.pos.y >= this.endY)
             {
                 this.comeUp = true;
                 this.body.force.y = -this.body.maxVel.y;
             }
         }
         else
         {
             this.body.force.y = 0;
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
          switch (response.b.body.collisionType) 
            {
                case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "pipes") 
                {
                    return false;
                }
                
            }
         
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) 
         {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) 
             {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
     }
 });