var

s_alien,
s_bgColor,
s_bonusAlien,
s_bulletAlien,
s_bulletShip,
s_city,
s_ship,
s_title;

function Sprite(img,x,y,width,height){
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Sprite.prototype.draw = function(ctx, x, y) {
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		 x, y,this.width,  this.height);
};

function initSprites(img){
		s_alien= [
					[new Sprite(img,   2, 223, 30, 16), new Sprite(img,  35, 223, 30, 16)],
					[new Sprite(img,  72, 223, 30, 16), new Sprite(img, 105, 223, 30, 16)],
					[new Sprite(img, 146, 224, 30, 16), new Sprite(img, 178, 224, 30, 16)]
				 ];

		s_bgColor = "#1f282d";

		// s_bulletAlien = [
		// 					new Sprite(img, 320,271,4,9),
		// 					new Sprite(img, 320,280,4,9)
		// 				];
		s_bulletAlien = new Sprite(img, 302,266,2,2);

		s_bulletShip = new Sprite(img, 302, 264,2,2);
		
		s_city  = 	[
						new Sprite(img, 318, 211, 44, 32)
					];

		s_ship 	= new Sprite(img, 278, 225, 28, 18);

		s_title = new Sprite(img, 17, 7, 592, 166);
	

}