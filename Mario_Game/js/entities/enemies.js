//Goomba Entity
game.GoombaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var width = settings.width;
        var height = settings.height;

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

    /* colision handler
    (called when colliding with other objects) */
    onCollision : function (response, other) 
    {
        switch (response.b.body.collisionType) 
        {
            case me.collision.types.WORLD_SHAPE:
            // RIGGSBY NOTE: OTHER.TYPE IS NOT LEGIT, AS LONG AS IF IS TRUE IT WILL RUN
            if (other.type === "platform") 
            {
                if (this.body.falling &&
                // Shortest overlap would move the player upward
                (response.overlapV.y > 0) &&
                // The velocity is reasonably fast enough to have penetrated to the overlap depth
                (~~this.body.vel.y >= ~~response.overlapV.y))
                {
                    // Disable collision on the x axis                
                    response.overlapV.x = 1;

                    // Repond to the platform (it is solid)
                    return true;
                 }
                // Do not respond to the platform (pass through)
                return false;
            }
            break;
            case me.collision.types.ENEMY_OBJECT:
            if ((response.overlapV.y>0) && !this.body.jumping && other.type === "Player") 
            {
                other.pos.y = this.pos.y - 5.8 - other.height;
                // bounce (force jump)
                other.body.falling = false;
                other.body.vel.y = -other.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                other.body.jumping = true;
                this.onDeath();
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

//Winged Goomba Entity
game.WingGoombaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var width = settings.width;
        var height = settings.height;
        this.counter = 0;
         
        // define this here instead of tiled
        settings.image = "Goomba_Fly";

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 20;
        settings.frameheight = settings.height = 24;

        // call the parent constructor
        this._super(me.Sprite, 'init', [x, y , settings]);

        // add a physic body
        this.body = new me.Body(this);
        // add a default collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        // configure max speed and friction
        this.body.setMaxVelocity(1.5, 6);
        this.body.setFriction(0, 0.2);
        this.body.force.set(2, 10);
         
        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.pos.x = this.endX = x + width - this.width; 
        y = this.pos.y;
        this.startY = y;
        this.pos.y = this.endY = y + height - this.height;
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
             
             this.counter += dt;
             if (this.counter >= 250)
             {
                this.body.force.y = -50;
                this.counter = 0;
                this.body.force.x = this.body.force.x / 10;
                this.body.pos.x = this.body.pos.x + 10;
             }
             
             else     
             {
                 this.body.force.y = 0;
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

   /* colision handler 
   (called when colliding with other objects)*/
    onCollision : function (response, other) 
    {
        switch (response.b.body.collisionType) 
        {
            case me.collision.types.WORLD_SHAPE:
            // Simulate a platform object
            if (other.type === "platform") 
            {
                if (this.body.falling &&
                // Shortest overlap would move the player upward
                (response.overlapV.y > 0) &&
                // The velocity is reasonably fast enough to have penetrated to the overlap depth
                (~~this.body.vel.y >= ~~response.overlapV.y))
                {
                    // Disable collision on the x axis
                    response.overlapV.x = 1;
                    // Repond to the platform (it is solid)
                    return true;
                }
                // Do not respond to the platform (pass through)
                return false;
            }
            break;

            case me.collision.types.ENEMY_OBJECT:
            if ((response.overlapV.y>2) && !this.body.jumping && other.type === "Player") 
            {  
               other.pos.y = this.pos.y - 5.8 - other.height;
               // bounce (force jump)
               other.body.falling = false;
               other.body.vel.y = -other.body.maxVel.y * me.timer.tick;
               // set the jumping flag
               other.body.jumping = true;
               this.onDeath();
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
                this.flipX(this.walkLeft);
                this.walkLeft = false;
                this.body.force.x = this.body.maxVel.x; 
            }
            else if (!this.walkLeft && this.pos.x >= this.endX)
            {
                this.flipX(this.walkLeft);
                this.walkLeft = true;
                this.body.force.x = -this.body.maxVel.x;     
            }
            
        }
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

    /* colision handler
    (called when colliding with other objects)*/
    onCollision : function (response, other) 
    {
        switch(response.b.body.collisionType)
        {
            case me.collision.types.WORLD_SHAPE:        
            if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) 
            {
                return false;
            }
            break;
                
            case me.collision.types.ENEMY_OBJECT:
            if ((response.overlapV.y>0) && !this.body.jumping && other.type === "Player") 
            {
                other.pos.y = this.pos.y - 5.8 - other.height;
                // bounce (force jump)
                other.body.falling = false;
                other.body.vel.y = -other.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                other.body.jumping = true;
                this.onDeath();
            }

            // Fall through
            default:
            // Do not respond to other objects (e.g. coins)
            return false;
        }
    },
    onDeath: function () 
    {
        game.data.score += 100;
        me.game.world.removeChild(this);
        console.log("closer");   
    }
});

//an enemy Entity
game.WingKoopaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var width = settings.width;
        var height = settings.height;
        this.counter = 0;

        // define this here instead of tiled
        settings.image = "RedKoopa_Fly";

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
        this.body.setMaxVelocity(1.5, 6);
        this.body.setFriction(0, 0);
        this.body.force.set(2, 10);
         
        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.pos.x = this.endX = x + width - this.width; 
        y = this.pos.y;
        this.startY = y;
        this.pos.y = this.endY = y + height - this.height;

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
                this.flipX(this.walkLeft);
                this.walkLeft = false;
                this.body.force.x = this.body.maxVel.x;
            }
            else if (!this.walkLeft && this.pos.x >= this.endX)
            {
                this.flipX(this.walkLeft);
                this.walkLeft = true;
                this.body.force.x = -this.body.maxVel.x;
            } 
            this.counter += dt;
            if (this.counter >= 250)
            {
                this.body.force.y = -50;
                this.counter = 0;
                this.body.force.x = this.body.force.x / 10;
                this.body.pos.x = this.body.pos.x + 10;
            }
            else     
            {
                this.body.force.y = 0;
            }
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

    /*colision handler
    (called when colliding with other objects) */
    onCollision : function (response, other) 
    {
        switch (response.b.body.collisionType) 
        {
            case me.collision.types.WORLD_SHAPE:
            // Simulate a platform object
            if (other.type === "platform") 
            {
                if (this.body.falling &&
                // Shortest overlap would move the player upward
                (response.overlapV.y > 0) &&
                // The velocity is reasonably fast enough to have penetrated to the overlap depth
                (~~this.body.vel.y >= ~~response.overlapV.y))
                {
                    // Disable collision on the x axis    
                    response.overlapV.x = 1;
                    // Repond to the platform (it is solid)
                    return true;
                }
                // Do not respond to the platform (pass through)
                return false;
            }
            break;
            case me.collision.types.ENEMY_OBJECT:        
            if ((response.overlapV.y>0) && !this.body.jumping && other.type === "Player") 
            {
                other.pos.y = this.pos.y - 5.8 - other.height;
                // bounce (force jump)
                other.body.falling = false;
                other.body.vel.y = -other.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                other.body.jumping = true;
                this.onDeath();
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

//an enemy Entity
game.PiranhaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var height = settings.height;
        this.counter = 0;
        this.pauseDur = settings.pauseDur;
        // define this here instead of tiled
        settings.image = "plant";
        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 32;
        // call the parent constructor
        this._super(me.Sprite, 'init', [x, y , settings]);
        // add a physic body
        this.body = new me.Body(this);
        // add a default collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        // configure max speed and friction
        this.body.setMaxVelocity(0.25, 1.5);
        this.body.setFriction(0.4, 0);
        this.body.gravity.y = 0;
        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;
        // set start/end position based on the initial area size
        y = this.pos.y;
        this.startY = y;
        this.pos.y = this.endY = y + height - this.height;
        //this.pos.x  = x + width - this.width;
        // to remember which side we were walking
        this.comeUp = true;
        // make it "alive"
        this.alive = true;
    },

    // manage the enemy movement
    update : function (dt)
    {         
        this.counter += dt; 
        if(this.counter >= this.pauseDur)
        {
            console.log(this.counter);
            this.comeUp = !this.comeUp;
            this.counter = 0;
        } 
        if (this.comeUp && this.pos.y <= this.startY)
        {
            this.body.force.y = this.body.maxVel.y;
            console.log("Go Down");
        } 
        else if (!this.comeUp && this.pos.y >= this.endY)
        {
            this.body.force.y = -this.body.maxVel.y;
            console.log("Go Up");
        } 
        if(this.pos.y < this.startY)
        {
            this.pos.y = this.startY;
            console.log("stopping");
        } 
        if(this.pos.y > this.endY)
        {
            this.pos.y = this.endY;
            console.log("stopping");
        }
             
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /* colision handler
    (called when colliding with other objects) */
    onCollision : function (response, other) 
    {
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
            
            }
            return false;
         }
         // Make all other objects solid
         return true;
    }
});
 
game.RedFirePiranhaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var height = settings.height;
        this.counter = 0;
        this.pauseDur = settings.pauseDur;

        // define this here instead of tiled
        settings.image = "plant";

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 32;

        // call the parent constructor
        this._super(me.Sprite, 'init', [x, y , settings]);

        // add a physic body
        this.body = new me.Body(this);
        // add a default collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        // configure max speed and friction
        this.body.setMaxVelocity(0.25, 1.5);
        this.body.setFriction(0.4, 0);
        this.body.gravity.y = 0;
        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;

        // set start/end position based on the initial area size
        y = this.pos.y;
        this.startY = y;
        this.pos.y = this.endY = y + height - this.height;
        //this.pos.x  = x + width - this.width;

        // to remember which side we were walking
        this.comeUp = true;

        // make it "alive"
        this.alive = true;
    },

    // manage the enemy movement
    update : function (dt)
    {         
        this.counter += dt; 
        if(this.counter >= this.pauseDur)
        {
            console.log(this.counter);
            this.comeUp = !this.comeUp;
            this.counter = 0;
         }         
         if (this.comeUp && this.pos.y <= this.startY)
         {
            this.body.force.y = this.body.maxVel.y;
            console.log("Go Down");
         }
         else if (!this.comeUp && this.pos.y >= this.endY)
         {
            this.body.force.y = -this.body.maxVel.y;
            console.log("Go Up");
         }
         if(this.pos.y < this.startY)
         {
            this.pos.y = this.startY;
            console.log("stopping");
         }
         if(this.pos.y > this.endY)
         {
            this.pos.y = this.endY;
            console.log("stopping");
         }
             
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /*colision handler
    (called when colliding with other objects) */
    onCollision : function (response, other) 
    {
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
             
            }
            return false;
        }
        // Make all other objects solid
        return true;
    }
});

game.GreenFirePiranhaEntity = me.Sprite.extend(
{
    init: function (x, y, settings)
    {
        // save the area size as defined in Tiled
        var height = settings.height;
        this.counter = 0;
        this.pauseDur = settings.pauseDur;

        // define this here instead of tiled
        settings.image = "plant";

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 32;

        // call the parent constructor
        this._super(me.Sprite, 'init', [x, y , settings]);

        // add a physic body
        this.body = new me.Body(this);
        // add a default collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        // configure max speed and friction
        this.body.setMaxVelocity(0.25, 1.5);
        this.body.setFriction(0.4, 0);
        this.body.gravity.y = 0;
        // enable physic collision (off by default for basic me.Renderable)
        this.isKinematic = false;

        // set start/end position based on the initial area size
        y = this.pos.y;
        this.startY = y;
        this.pos.y = this.endY = y + height - this.height;
        //this.pos.x  = x + width - this.width;

        // to remember which side we were walking
        this.comeUp = true;

        // make it "alive"
        this.alive = true;
    },

    // manage the enemy movement
    update : function (dt)
    {         
        this.counter += dt; 
        if(this.counter >= this.pauseDur)
        {
            console.log(this.counter);
            this.comeUp = !this.comeUp;
            this.counter = 0;
        } 
        if (this.comeUp && this.pos.y <= this.startY)
        {
            this.body.force.y = this.body.maxVel.y;
            console.log("Go Down");
        } 
        else if (!this.comeUp && this.pos.y >= this.endY)
        {
            this.body.force.y = -this.body.maxVel.y;
            console.log("Go Up");
        } 
        if(this.pos.y < this.startY)
        {
            this.pos.y = this.startY;
            console.log("stopping");
        } 
        if(this.pos.y > this.endY)
        {
            this.pos.y = this.endY;
            console.log("stopping");
        }
             
        // check & update movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /* colision handler
    (called when colliding with other objects) */
    onCollision : function (response, other) 
    {
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
             
            }
            return false;
        }
        // Make all other objects solid
        return true;
    }
 });