/**
 * Overworld Mario Entity
 */

 game.LilMario = me.Sprite.extend({
     // constructor
     init:function (x, y, settings) {
         // call the parent constructor
         settings.image = "OvMario";
         var width = settings.width;
         
         
         settings.framewidth = settings.width = 16;
         settings.frameheight = settings.height = 16;
         this._super(me.Sprite, 'init', [x, y , settings]);

           
         //this.renderable.anchorPoint.set(1, 0);
         // define a basic walking animation
         //this.addAnimation("walk",  [...]);
         // define a standing animation (using the first frame)
         this.addAnimation("stand",  [0, 1,]);
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