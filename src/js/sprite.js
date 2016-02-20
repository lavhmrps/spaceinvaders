var

s_alien,
s_bgColor,
s_ufo,
s_bulletAlien,
s_bulletShip,
s_city,
s_credit,
s_hiscore,
s_number = [],
s_score,
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
					[new Sprite(img,   9, 223, 16, 16), new Sprite(img,  42, 223, 16, 16)],
					[new Sprite(img,  76, 223, 22, 16), new Sprite(img, 109, 223, 22, 16)],
					[new Sprite(img, 149, 224, 24, 16), new Sprite(img, 181, 224, 24, 16)]
				 ];

		s_bgColor = "#1f282d";

		s_ufo = new Sprite(img, 216,222,50,22);
		
		s_bulletAlien = [
							new Sprite(img, 320,267,4,9),
							new Sprite(img, 320,280,4,9)
						];
		//s_bulletAlien = new Sprite(img, 302,266,2,2);

		s_bulletShip = [
						new Sprite(img, 302, 264,2,2),
						new Sprite(img, 302, 264,2,2)
					   ];
		
		s_city  = 	[
						new Sprite(img, 317, 211, 46, 34),
						new Sprite(img, 481, 207, 46, 34),
						new Sprite(img, 481, 262, 46, 34),
						new Sprite(img, 374, 208, 46, 34),
						new Sprite(img, 429, 207, 46, 34),
						new Sprite(img, 361, 256, 46, 34),
					];
		
		s_credit = new Sprite(img,24,296,90,14);

		s_hiscore = new Sprite(img, 10,262,123,14);

		s_score = new Sprite(img,58,262,74,14);

		s_ship 	= new Sprite(img, 278, 225, 28, 18);

		s_title = new Sprite(img, 17, 7, 592, 166);

		var width = 10, offsetLeft = 9, offsetDown=20;
		for(var i=0; i<5; i++){
				s_number[i] = new Sprite(img,158+19*i,264,10,14);
				s_number[i+5] = new Sprite(img,158+19*i,264+offsetDown,10,14);
		}


}
