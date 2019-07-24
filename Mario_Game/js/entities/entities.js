/**
 * Player Entity
 */


game.PlayerEntity = me.Entity.extend({
    
    /**
     * constructor
     */
    init:function (x, y, settings) {
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
// --- Running Animation
      this.renderable.addAnimation("run",  [0, 1, 2]);

//---- define a standing animation (using the first frame)
      this.renderable.addAnimation("stand",  [0]);
      
//---- set the standing animation as default
      this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        
    if(me.input.isKeyPressed('run')) {
        this.body.setMaxVelocity(3, 15);
    }        
      else {
          this.body.setMaxVelocity(2,12);
      }
          
          if (me.input.isKeyPressed('left')) {

          // flip the sprite on horizontal axis
          this.renderable.flipX(true);
          // update the default force
          this.body.force.x = -this.body.maxVel.x;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
              this.renderable.setCurrentAnimation("walk");
          }
      } else if (me.input.isKeyPressed('right')) {

          // unflip the sprite
          this.renderable.flipX(false);
          // update the entity velocity
          this.body.force.x = this.body.maxVel.x;
          // change to the walking animation
          if (!this.renderable.isCurrentAnimation("walk")) {
              this.renderable.setCurrentAnimation("walk");
          }
      } else {
          this.body.force.x = 0;
          // change to the standing animation
          this.renderable.setCurrentAnimation("stand");
      }

      if (me.input.isKeyPressed('jump')) {
          if (!this.body.jumping && !this.body.falling && !this.body.jumping == 1)
          {   // --- Sets Jumping to 0, so mario can jump
              this.body.jumping = 0;
              // set current vel to the maximum defined value
              // gravity will then do the rest
              this.body.force.y = -this.body.maxVel.y
          }
      } else {
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
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
        
    }
});

// goomba entity, made with love by Riggsby

 game.EnemyEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
         // save area defined in tiled 
         var width = settings.width;

         // define here instead of tiled
         settings.image = "SNES - Super Mario All-Stars Super Mario Bros 3 - Enemies";

         //adjusting entity to fit sprite
         settings.framewidth = settings.width = 64;
         settings.frameheight = settings.height = 64;

         // call parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

         // add physical body
         this.body = new me.Body(this);
         // default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         //  max speed n friction
         this.body.setMaxVelocity(4, 6);
         this.body.setFriction(0.4, 0);
         // enable physic collision
         this.isKinematic = false;

         // set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
         //this.pos.x  = x + width - this.width;

         // to remember which side we were walking
         this.walkLeft = false;

         // It's ALIIIIVE
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
         // check n update movement
         this.body.update(dt);

         // handle when shapes got beef
         me.collision.check(this);

         // return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

     // collision handler
     onCollision : function (response, other) {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // make other obj solid
         return true;
     }
 });

//koopa entity



game.EnemyEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
         // save area defined in tiled 
         var width = settings.width;

         // define here instead of tiled
         settings.image = "koopa entity png when i have it";

         //adjusting entity to fit sprite
         settings.framewidth = settings.width = 64;
         settings.frameheight = settings.height = 64;

         // call parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

         // add physical body
         this.body = new me.Body(this);
         // default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         //  max speed n friction
         this.body.setMaxVelocity(4, 6);
         this.body.setFriction(0.4, 0);
         // enable physic collision
         this.isKinematic = false;

         // set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
         //this.pos.x  = x + width - this.width;

         // to remember which side we were walking
         this.walkLeft = false;

         // It's ALIIIIVE
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
         // check n update movement
         this.body.update(dt);

         // handle when shapes got beef
         me.collision.check(this);

         // return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

     // collision handler
     onCollision : function (response, other) 
     {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) 
         { 
             // res.y >0 means touched by something on the bottom
             // which mean top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // make other obj solid
         return true;
     }
 });


