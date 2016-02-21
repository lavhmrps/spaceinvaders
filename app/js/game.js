(function(){
	var

	canvas,
	background, 
	height,
	width,
	ctx, 
	img,
	frames,
	bullet=0,
	bullets = [],
	points = [],
	ufo = null,

	sfx_explosion = new Audio("sfx/explosion.wav"),
	sfx_shoot = new Audio("sfx/shoot.wav"),
	sfx_ufo_highpitch = new Audio("sfx/ufo_highpitch.wav"),
	volume, 

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
		//rows:  [2],
		cols: 10, 

		x: 20,
		y: 60,
		step:30,
		frame: 0,
		dir: 1,
		animation: [0,1],
		velocity: 60,

		reset: function(){
			this._aliens = [];
			this.velocity = 0;
			this.x=20;
			this.y=60;
			this.dir=1;
			this.frame = 0;
			frames =0;

		},

		init: function(){
			this.velocity = 75;
			this.y += Math.min(10*score.level,100);

			bullets= [];
			this._aliens = [];


			for(var k=0; k<this.rows.length; k++){
				var v = this.rows[k]
				var o = v == 0 ? 7: (v==1?4:3);
				for(var i=0; i < this.cols; i++){

					var _x = this.x + this.step*i + o;
					var _y = this.y +this.step*k;

					this._aliens.push(
						{
							sprite: s_alien[v],
							x: _x,
							y: _y,
							w: s_alien[v][0].width, 
							h: s_alien[v][0].height,
							value: 50-20*v
						}
					);
				}
			}
		},

		update: function(){

			if(this._aliens.length === 0){
				score.lives += score.lives < 4 ? 1:0;
				score.level++;
				aliens.reset();
				aliens.init();
				
			}

			//  hit on alien
			for(var i=0, len=this._aliens.length; i < len;i++){
				for(var j = 0, len2 = bullets.length; j<len2; j++){
					var a = this._aliens[i];
					var b = bullets[j];

					try{
						if(b.dir == -1 && b.x +b.w >= a.x && b.x <= a.x+a.w && b.y+b.h >= a.y && b.y <= a.y+a.h){
							points.push({
								value: a.value,
								x: a.x,
								y:a.y,
								t:0
							});

							score.score += a.value;
							this._aliens.splice(i,1);
							i--;len--;
							bullets.splice(j,1);
							j--, len2--;

							frames -= (frames % 60)-1;
						
							
						}
					} catch(ex){}
				}
			}

			if(ufo !== null){
				sfx_ufo_highpitch.play();
				var u = ufo;
				for(var i = 0, len = bullets.length; i<len; i++){
					var b = bullets[i];
					try{
						if(b.dir === -1 && b.x+b.w >= u.x && b.x <= u.x+u.w && b.y+b.h >= u.y && b.y <= u.y+u.h){
							score.score += u.value;
							points.push({
								value: u.value,
								x: u.x,
								y:u.y,
								t:0
							});
							bullets.splice(i,1);
							ufo = null;
						}	
					}catch(ex){}
				}
			}



			if( frames % this.velocity == 0){
				this.frame ++;
				var _minX = width, _maxX= 0, _maxY = 0;
				// move side
				var s = this.step-Math.floor(Math.random()*5);
				
				for(var i=0, len=this._aliens.length; i < len;i++){
					var a = this._aliens[i];
					a.x += s * this.dir;

					_minX = Math.min(a.x, _minX);
					_maxX = Math.max(a.x, _maxX);

					
				}

				// move down
				if(_minX < 30  || _maxX > width-30-this.step){
					this.dir *= -1;
					for (var i = 0, len = this._aliens.length; i < len; i++) {
						var a = this._aliens[i];
						a.x += this.step * this.dir;
						a.y += this.step;
						_maxY = Math.max(_maxY,a.y );
						if(_maxY >= 440){
							currentstate = states.End;
							return;
						}
					}
				}
			}

			// Alien fire
			if(this._aliens.length > 1 && frames % 10 === 0 && Math.random() < .05*score.level){
				var a = this._aliens[Math.floor(Math.random()*this._aliens.length)];
				bullets.push({
					f:0,
					sprite: s_bulletAlien,
					x: a.x,
					y: a.y - 2,
					v:2,
					dir: 1
				});
				sfx_shoot.play();
			}

			// spawn ufo
			if(ufo == null && this._aliens.length > 1 && frames % 10 === 0 && Math.random() < .005){
				var dir = Math.random() < .5 ? -1:1;
				ufo = {
					sprite: s_ufo,
					x:dir==1?0:width,
					y:35,
					w: s_ufo.width,
					h: s_ufo.height,
					dir: dir,
					velocity: Math.floor(Math.random()*3)+2,
					value: Math.floor(Math.random()*20)*10+100
				}
			}
			

			this.velocity = this._aliens.length + 18 - 3* Math.min(score.level,5);

		},

		draw:function(ctx){
			for(var i=0, len=this._aliens.length; i < len;i++){
				var a = this._aliens[i];
				a.sprite[this.frame%this.animation.length].draw(ctx, a.x, a.y);
			}

			if(ufo !== null){
				s_ufo.draw(ctx,ufo.x,ufo.y);
				ufo.x += ufo.velocity * ufo.dir ;
				if(ufo.x < 0 - s_ufo.width || ufo.x > width)
					ufo = null;

			}
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

				// change bullet sprite
				if(frames%30==0)
					b.f++;

				b.y += b.v * b.dir;

				if(b.y < 0  || b.y > height){
					bullets.splice(i,1);
					i--;
					len--;
				}
				try{
					// hit on you
					if(b.dir == 1 && b.x > this.x && b.x < this.x+this.w && b.y >= this.y && b.y <= this.y+this.h){		
						sfx_explosion.play();
						if(score.lives == 0){
							currentstate = states.End;
							return;
						}
						score.lives -= score.lives > 0 ? 1 :0;
						bullets.splice(i--,1);
						len--;


					}
				} catch(ex){}

			}

			if(input.isPressed(32)){
			// if(input.isDown(32)){ // Easymode
				// space
				bullets.push({
					f:0,
					sprite: s_bulletShip,
					x: this.x+this.w/2,
					y: this.y + 2,
					w: s_bulletShip[0].width,
					h: s_bulletShip[0].height,
					v:3,
					dir: -1
				});

				score.score  -= score.score > 0 ? 1 :0;


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
				var border =width - 30 - s_ship.width; 
				if(this.x > border){ 
					return;
				}
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
				b.sprite[b.f%2].draw(ctx,b.x, b.y);
			}

		}
	},

	cities = {

		_cities: [],

		step: 138,
		num: 5,
		x:0,
		y:0,
		w:0,
		h:0, 

		reset: function(){
			this._cities = [];
		},

		init:function(){
			_cities = [];
			this.w =  s_city[0].width;
			this.h =  s_city[0].height;
			for(var i= 0; i< this.num; i++)
			{
				this._cities.push( {
					sprite: s_city,
					x: 100+this.step*i,
					y:height-150,
					hits:0,
					w:this.w,
					h:this.h
				});
			}

		},
		update: function(){
			for(var j=0, len2= this._cities.length; j<len2; j++){
				for(var i=0, len= bullets.length; i<len; i++){
					var c = this._cities[j];
					var b = bullets[i];

					// hit on city
					try{
						 if(b.x > c.x && b.x < c.x+c.w && b.y >= c.y && b.y <= c.y+c.h){
							bullets.splice(i,1);
							i--;
							len--;
							c.hits++;
							if(c.hits > 5){
								this._cities.splice(j,1);
								j--;
								len2--;
							}
						}
					}catch(ex){};
					
				}
			}

		},
		draw: function(ctx){
			for(var i=0, len= this._cities.length; i<len; i++){
				var c = this._cities[i];
				c.sprite[c.hits].draw(ctx,c.x, c.y);
			}

		}

	},
	score= {
		score:0,
		hiscore: 0,
		lives: 0,
		level: 0,

		init:function(){
			this.hiscore = localStorage.getItem("highscore") || 0;
			this.score = 0;
			this.lives= 3;
			this.level=0;
			console.log(this.hiscore);

		},
		update: function(){
			if(this.score > this.hiscore)
				localStorage.setItem("highscore", this.score);
			this.hiscore = Math.max(this.hiscore, this.score);


		},
		draw: function(){
			s_score.draw(ctx,20,10);
			var str = this.score+"";
			for(var i=0; i<str.length;i++){		
				var d = str.charAt(i);
				s_number[d].draw(ctx,120+15*i,10);
			}

			ctx.save();
			ctx.font ="15px monospace";
			ctx.fillStyle= "white";
			ctx.fillText("Level: "+(score.level+1), 250, 25);
			ctx.restore();

			s_credit.draw(ctx,width/1.6,10);

			for(var i=0; i<this.lives;i++){
				s_ship.draw(ctx, width/1.6+ s_credit.width+s_ship.width+s_ship.width*1.3*i,10);
			}

			ctx.save();
			ctx.font = "15px monospace";
			ctx.fillStyle="rgba(255,100,100,.8)";
			for(var i =0; i< points.length; i++){
				var p = points[i];
				if(frames%3==0 && p.value <100)
					p.y--;
				if(frames%5==0 && p.value >=100)
					p.y++;
				p.t++;
				if(p.value>=100){
					ctx.save();
					ctx.font = "25px monospace";
					ctx.fillText(p.value, p.x, p.y);
					ctx.restore();

				}else{
					ctx.fillText(p.value, p.x, p.y);
					
				}
				ctx.fill();
				if(p.t > 60)
					points.splice(i--,1);
			}
			ctx.restore();
		}
	}

	;

	function main(){
		canvas = document.getElementById("invadersCanvas");
		width= window.innerWidth;
		height = window.innerHeight;

		width = 800;
		height  = width / 1.5;

		canvas.width = width;
		canvas.height= height;

		var game = document.getElementById("game");

		game.style.width = width+"px";
		game.style.height = height+"px";

		input = new InputHandler();
		currentstate = states.Splash;

		ctx = canvas.getContext("2d");

		img = new Image();
		img.src = "res/sprite_sheet.png";
		img.src = "res/sprite_sheet-transparent.png";

		volume = .05;

		sfx_explosion.volume = volume;
		sfx_shoot.volume = volume;
		sfx_ufo_highpitch.volume = volume;
		
		img.onload = function(){
			initSprites(this);

			background = generateBackground(50);

			frames = 0;
			score.init();
			ship.init();
			aliens.init();
			cities.init();

			run();
		};
	}

	function resetGame(){
		aliens.reset();
		cities.reset();
		
		aliens.init();
		cities.init();

		score.init();

		bullets=[];

	}

	function run(){
		var loop = function(){
			update();
			render();
			window.requestAnimationFrame(loop);
		}
		loop();
	}

	function update(){
		frames++;

		if(currentstate === states.Game){
			aliens.update();
		}
		ship.update();
		cities.update();
		score.update();
	}

	function render(){
		// Clear canvas
		// ctx.drawImage(background,0,0);
		ctx.fillStyle = "#333";
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = "#000";
		ctx.fillRect(5, 5, width-10, height-10);
		
		
		aliens.draw(ctx);
		ship.draw(ctx);
		cities.draw(ctx);
		score.draw();

		if(currentstate !== states.Game){
			ctx.fillStyle = "rgba(0, 0, 0, .8)";
			ctx.fillRect(0,0,width, height);
			
			s_title.draw(ctx,width/2-s_title.width/2,100 );

			if(currentstate === states.Splash){
				ctx.save();
				
				ctx.font ="25px monospace";
				ctx.fillStyle= "rgba(255,100,110,.7)";
				ctx.fillText("PAUSED", 330, 290);
				
				ctx.font ="20px monospace";
				ctx.fillStyle= "white";
				ctx.fillText("Press ENTER to continue", 250, 320);
				
				ctx.restore();
			}
			
			if(currentstate === states.End){
				ctx.save();
				
				ctx.font ="30px monospace";
				ctx.fillStyle= "rgba(200,0,0,1)";
				ctx.fillText("GAME OVER", 310, 290);
				
				ctx.font ="20px monospace";
				ctx.fillStyle= "white";
				ctx.fillText("Press ENTER to try again", 245, 320);
				
				ctx.restore();

			}
		}
	}

	function generateBackground(iter){
		var iterations = iter || 20;

		var loop = function(){
				ctx.fillStyle="rgba(255,255,255,.5)";
				ctx.fillRect(Math.random()*height,Math.random()*width,Math.random()*3,Math.random()*3);
				ctx.fill();
		}
		ctx.clearRect(0,0,width,height);
		ctx.fillStyle="rgba(0,0,0,1)"
		ctx.fillRect(0,0,width,height);

		for(var i=0; i<iterations; i++){
			loop();
		}
		// here is the most important part because if you dont replace you will get a DOM 18 exception.
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  
		background = image;

		var im = new Image();
		im.src = image;

		return im;
		


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
					console.log("velo: "+aliens.velocity);
					currentstate = states.Splash;
				}else if (currentstate === states.End){
					resetGame();
					currentstate = states.Game;
				}
			}
			self.down[evt.which] = true;

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