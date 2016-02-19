(function(){
	var

	canvas,
	height,
	width,
	ctx, 
	img,
	frames,
	bullets = [],

	currentstate, 
	states = {
		Splash: 0,
		Game: 1,
		End:2
	},

	inputHandler,

	aliens = {
		_aliens: [],
		rows:  [0,1,1,2,2],
		cols: 10, 

		x: 20,
		y: 60,
		step:30,
		frame: 0,
		dir: 1,
		animation: [0,1],
		velocity: 60,

		init: function(){
			this.velocity = 60;
			bullets= [];
			this._aliens = [];

			for(var k=0; k<this.rows.length; k++){
				for(var i=0; i < this.cols; i++){
					var _x = this.x + this.step*i;
					var _y = this.y +this.step*k;

					this._aliens.push(
						{
							sprite: s_alien[this.rows[k]],
							x: _x,
							y: _y,
							w: s_alien[this.rows[k]][0].width, 
							h: s_alien[this.rows[k]][0].height
						}
					);
				}
			}
		},

		update: function(){

			if(this._aliens.length === 0){
				aliens.init();
				currentstate = states.Splash;
			}

			// Bullet hit on alien? 
			for(var i=0, len=this._aliens.length; i < len;i++){
				for(var j = 0, len2 = bullets.length; j<len2; j++){
					var a = this._aliens[i];
					var b = bullets[j];

					try{
						if(b.x > a.x && b.x < a.x+a.w && b.y >= a.y && b.y <= a.y+a.h){		
							this._aliens.splice(i,1);
							i--;len--;
							bullets.splice(j,1);
							j--, len2--;
						
							this.velocity = this._aliens.length + 6;
						}
					} catch(ex){console.log("err: "+ex.toString())}
				}
			}

			// Alien fire!
			if(frames % 10 === 0 && Math.random() < .1){
				var a = this._aliens[Math.floor(Math.random()*this._aliens.length)];
				// console.log(a);
				bullets.push({
					sprite: s_bulletAlien,
					x: a.x,
					y: a.y - 2,
					v:2,
					dir: 1
				});

				console.log("SPACEFIRE");

			}


			if( frames % this.velocity == 0){
				this.frame ++;
				var _min = width, _max= 0;
				for(var i=0, len=this._aliens.length; i < len;i++){
					var a = this._aliens[i];
					a.x += this.step * this.dir;

					_min = Math.min(a.x, _min);
					_max = Math.max(a.x, _max);
					
				}

				if(_min < 30  || _max > width-30-this.step){
					this.dir *= -1;
					for (var i = 0, len = this._aliens.length; i < len; i++) {
						this._aliens[i].x += this.step * this.dir;
						this._aliens[i].y += this.step;
					}
				}
			}

		},

		draw:function(ctx){
			ctx.save();

			for(var i=0, len=this._aliens.length; i < len;i++){
				var a = this._aliens[i];
				a.sprite[this.frame%this.animation.length].draw(ctx, a.x, a.y);
			}

			ctx.restore();
		}
	},

	ship = {
		x:0,
		y:0,
		w:0,
		h:0,

		init:function(){
			this.x = width/2,
			this.y = height-75
			this.w = s_ship.width,
			this.h = s_ship.height;
		},

		update: function(){
			for(var i=0, len= bullets.length; i < len; i++){
				var b = bullets[i];
				b.y += b.v * b.dir;

				if(b.y < 0  || b.y > height){
					bullets.splice(i,1);
					i--;
					len--;
				}
				try{
					// Are you hit?
					if(b.x > this.x && b.x < this.x+this.w && b.y >= this.y && b.y <= this.y+this.h){		

						currentstate = states.End;
						return;

					}
				} catch(ex){console.log("err: "+ex.toString())}

			}

			if(input.isPressed(32)){
			// if(input.isDown(32)){ // Easymode
				// space
				bullets.push({
					sprite: s_bulletShip,
					x: this.x,
					y: this.y + 2,
					v:3,
					dir: -1
				});

			}
			if(input.isDown(37)){
				// left
				if(this.x < 30) return;
				if(input.shiftModified())
					this.x -= 4;
				else  
					this.x -= 2;

			}
			if(input.isDown(39)){
				// right
				if(this.x > width - 30 - ship.width) return;
				if(input.shiftModified())
					this.x += 4;
				else
					this.x += 2;
			}
		},

		draw:function(){
			s_ship.draw(ctx,this.x,height-75);

			for(var i=0, len= bullets.length; i < len; i++){
				var b = bullets[i];
				b.sprite.draw(ctx,b.x, b.y);
			}

		}
	},

	cities = {

	};

	function main(){
		canvas = document.getElementById("invadersCanvas");
		width= window.innerWidth;
		height = window.innerHeight;

		width = 800;
		height  = width / 1.5;

		canvas.width = width;
		canvas.height= height;

		input = new InputHandler();
		currentstate = states.Splash;

		ctx = canvas.getContext("2d");



		img = new Image();
		img.src = "res/sprite_sheet.png";
		img.src = "res/sprite_sheet-transparent.png";
		
		img.onload = function(){
			initSprites(this);

			ctx.fillStyle=s_bgColor;
			ctx.fillRect(0,0,width, height);

			frames = 0;
			ship.init();
			aliens.init();
			run();
		};
	}

	function run(){
		var loop = function(){
			update();
			render();
			window.requestAnimationFrame(loop);
			//loop();
		}
		loop();
	}

	function update(){
		frames++;

		if(currentstate === states.Game){
			aliens.update();
		}

		ship.update();
	}

	function render(){
		// Clear canvas
		ctx.fillStyle = s_bgColor;
		ctx.fillRect(0, 0, width, height);
		ctx.stroke();

		aliens.draw(ctx);
		ship.draw(ctx);

		if(currentstate !== states.Game){
			ctx.fillStyle = "rgba(31, 40, 45, .8)";
			ctx.fillRect(0,0,width, height);

			s_title.draw(ctx,width/2-s_title.width/2,100 );
		}
	}

	function InputHandler(){
		this.down= {};
		this.pressed=  {};

		var self = this;


		document.addEventListener("keydown", function(evt){
			if(evt.which === 13){
				if(currentstate === states.Splash){
					currentstate = states.Game;
					bullets = [];
				}
				else if(currentstate === states.Game){
					currentstate = states.Splash;
				}else if (currentstate === states.End){
					currentstate = states.Game;
					aliens.init();
				}
			}
			self.down[evt.which] = true;
			//console.log(evt.which);
		});

		document.addEventListener("keyup", function(evt){
			self.down[evt.which] = false;	
			self.pressed[evt.which] = false;
		});
	}

	InputHandler.prototype.isDown = function(key) {
		return this.down[key];
	}

	InputHandler.prototype.isPressed = function(key) {
		if(this.pressed[key])
			return false;
		else if(this.down[key])
			return this.pressed[key] = true;
		return false;
	};

	InputHandler.prototype.shiftModified = function() {
		return this.isDown(16);
	};


	main();
})();