game.PlayerEntity = me.Entity.extend
({
    /**
     * constructor
     */
    init:function (x, y, settings) 
    {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

//---- set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

//---- ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        this.renderable.anchorPoint.set(0.1, 0);
//---- define a basic walking animation (using 2 frames)
        this.renderable.addAnimation("walk",  [0, 1]);
// --- Jumping Animation
        this.renderable.addAnimation("jump",  [0, 2]);
// --- Ducking Animation
        this.renderable.addAnimation("duck",  [3]);

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

        this.body.setMaxVelocity(2.3, 11);
        this.body.setFriction(0.4, -0.2);

        }        
      else  {
          this.body.setMaxVelocity(2, 12.8);
          this.body.setFriction(0.4, 0.2);
            }
          
          if (me.input.isKeyPressed('left') && !me.input.isKeyPressed('down')) 
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
            } else if (me.input.isKeyPressed('right') && !me.input.isKeyPressed('down')) 
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

      if (me.input.isKeyPressed('jump') || me.input.isKeyPressed('up')) 
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
        
    
    if(me.input.isKeyPressed('down'))
    {
        this.renderable.setCurrentAnimation("duck");
        if (me.input.isKeyPressed('left'))
        {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
        }
        else if (me.input.isKeyPressed('right'))
        {
            // flip the sprite on horizontal axis
            this.renderable.flipX(false);
        }
    }
        
    //if(me.input.isKeyPressed('down') && this.x == pipeEnterance1.x && (this.y == pipeEnterance1.y - 1))    
        
        
        
        
    
        var pause = false;
        
        
        if(me.input.isKeyPressed('start'))
        {
            console.log("Enter");               //Test, Delete later
            if(me.state.isCurrent(me.state.MENU))
            {
                console.log("Working");         //Test, Delete later
                //Set this to TITLE when working
                me.state.change(me.state.START);
            }
            else
            {
                console.log("Broken");          //Test, Delete later
                if(pause)
                {
                    console.log("Unpause");     //Test, Delete later
                    this.pause = (false);
                    //me.state.resume();

                }
                else
                {
                    console.log("Pause");       //Test, Delete later
                    this.pause = (true);
                    //me.state.pause();
                    
                }
                // Insert Pause Code Here
            }
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
//maybe stuff for wing goomba
            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping) 
            {
                this.pos.y = other.pos.y - 5.8 - this.height;
                // bounce (force jump)
                this.body.falling = false;
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

                // set the jumping flag
                this.body.jumping = true;
            }
            else 
            {
        // this is Mario Dying, I still need to add Animation after he is hit, and a death animation.
        // Pause if Collide with enemy
        me.state.pause;
        me.state.waitSeconds
                
                // Load the Mario_Overworld1 map, set to Mario_1-1 for testing would need to change this line if using multiple worlds, possible would need a lot more if/else statements for going back to the overworld and keeping Lives/Score/ect.   Currently commented out as its annoying the hell out of me when testing.
                
        me.levelDirector.loadLevel("Mario_1-1");
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
                
        me.state.resume;
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

