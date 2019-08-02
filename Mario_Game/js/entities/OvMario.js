/**
 * Overworld Mario Entity
 */

 game.LilMario = me.Sprite.extend(
 {
     
     // constructor
     init:function (x, y, settings) {
         // call the parent constructor
         settings.image = "OvMario";
         var width = settings.width;
         
         settings.gravity = 0;
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;
         this._super(me.Sprite, 'init', [x, y , settings]);
         this.addAnimation("stand",  [0, 1,]);
         // set the standing animation as default
         this.setCurrentAnimation("stand");
         
         
         // add a physic body
         this.body = new me.Body(this);
         // add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         // configure max speed and friction
         this.body.setMaxVelocity(2, 2);
         this.body.setFriction(0, 0);
         this.body.gravity = 0;

         // enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;
         
         // set the display to follow our position on both axis
         me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
     },
        update : function (dt) 
    {
        if (me.input.isKeyPressed('left')) 
        {
              // update the default force
            this.body.force.x = -this.body.maxVel.x;

        } 
        else if (me.input.isKeyPressed('right')) 
        {
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;                
        } 
        else 
        {
            this.body.force.x = 0;
        }  
        
        if (me.input.isKeyPressed('down')) 
        {
          // update the default force
            this.body.force.y = this.body.maxVel.y;
        }
        
        if (me.input.isKeyPressed('up')) 
        {
                
                      // update the entity velocity
            this.body.force.y = -this.body.maxVel.y;              
        } 
        else 
        {
                      this.body.force.y = 0;
        }  

        this.body.update(dt);
        me.collision.check(this);
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },
     
     onCollision : function (response, other) 
        {
        
            switch (response.b.body.collisionType) 
            {
                case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") 
                {
                    if (this.body.falling && !me.input.isKeyPressed('down') && (response.overlapV.y > 0) && (~~this.body.vel.y >= ~~response.overlapV.y))
                    {
                        response.overlapV.x = 0;
                        return true;
                    }
                    return false;
                }
            }
        }
 });