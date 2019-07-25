/**
 * Player Entity
 */
game.EnemyEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        
        // save the area size as defined in tiled
        var width = settings.width
        
        // define this here instead of tiled
        settings.image = "wheelie_right";
        
        //adjust the size setting information to match the sprite size
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.frameheight= 64;
        
        //call the parent constructor
        
        
        this._super(me.Entity, 'init', [x, y , settings]);
        
        //add a physic body
        this.body = new me.Body(this);
        //add a default collision shape
        this.body.addShape(new me.Rect(0,0,this.width, this.height));
        
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.4,0);
        
        //enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;
        
        //set the start and end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.pos.x = this.endX = x + width - this.width;
        
        //to remember which side we were walking
        this.walkLeft = false;
        
        //make it alive
        this.alive = true;
        
    
        //ToDo: add animation to player

    },

    /**
     * update the entity
     */
    update : function (dt) 
    {
        if(this.alive)
        {
            if(this.walkLeft && this.pos.x <= this.startX)
            {
                this.walkLeft = false;
                this.body.force.x = this.body.maxVel.x;
                this.renderable.flipX (false);
            }
            else if(!this.walkLeft && this.pos.x >= this.endX)
            {
                this.walkLeft = true;
                this.body.force.x = -this.body.maxVel.x;
                this.renderable.flipX (true);
            }
        }
        else
        {
            this.body.force.x = 0;
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
        
        if(response.b.body.collisionType !== me.collision.types.WORLD_SHAPE)
        {
            //res.y > 0 this means touched by somethng on the bottom, which means at the top position for this one
            
            if(this.alive && (response.overlapV.y > 0) && response.a.body.falling)
            {
                //this.renderable.flicker(750);
                
            }
            return false;
        }
        // Make all other objects solid
        return true;
    }
});