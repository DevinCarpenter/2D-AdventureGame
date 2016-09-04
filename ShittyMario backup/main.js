var intval = null;
var intval2 = null;
var intval3 = null;
var pos = 0;
var pos2 = 0;
var running = true;
var logNum=1;
var everyother = 0;

//============================================================//
//============================================================//
//						Shitty Mario!
// This game consists of mario running around in a 2d platformer game
// environment constantly moving. He runs away from shittily
// pasted zombies. He can shoot at them, but if he is touched
// by one, then he dies. Also, if he gets pulled all the way
// past the left edge of the screen, he dies. Good luck!
//
// Game Variant 1: Mario has a "ripper" bullet where he
// activates a control to send the object flying to him,
// ripping through all objects in its path as it soars to 
// his location. Can be thrown, or not.
//
// Game Variant 2: Mario can shoot bullets at enemies. nuff said.
//
// Game Variant 3: 
//
//objects in game: 
//Player,Zombie,Bullet
//Methods:
//  Player: Shoot,Coords
//  Bullet: Coords
//Functions:
// genRandom(biggestNum)
// genOneToTwenty()
// main()
// playerShoot()
// bringBulletToPlayer()
// getBulletCoords()
// 
//============================================================//
//============================================================//

$(document).ready(function() {


	
	var pi= Math.PI;
	main();



	//$('#mario').attr("left", "500");
	//$('#mario').attr("top", "500");

	//============================//
	// EVENT LISTENER ON KEYDOWN
	// On keydown we do a check and perform actions
	//============================//
    $(document).keydown(function(key) {
    	
    	//$('#mario').clearQueue();
    	var mario_left_1 = "mario-left-1.png";
    	var mario_left_2 = "mario-left-2.png";
    	var mario_right_1 = "mario-right-1.png"
    	var mario_right_2 = "mario-right-2.png";
    	var mario_up_1 = "mario-up-1.png";
    	var mario_up_2 = "mario-up-2.png";
    	var mario_down_1 = "mario-down-1.png";
    	var mario_down_2 = "mario-down-2.png";
        switch(parseInt(key.which,10)) {
			// Left arrow key pressed
			case 37:

				if($('#' + player.id).attr("src") == mario_left_1){$('#' + player.id).attr("src", mario_left_2);} 
				else if($('#' + player.id).attr("src") == mario_left_2){$('#' + player.id).attr("src", mario_left_1);} 
				else { $('#' + player.id).attr("src", mario_left_1);}
				$('#' + player.id).animate({left: "-=20px"}, 10);
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			// Up Arrow Pressed
			case 38:

				//if($('#mario').attr("src") == mario_up_1){$('#mario').attr("src", mario_up_2);} 
				//else if($('#mario').attr("src") == mario_up_2){$('#mario').attr("src", mario_up_1);} 
				//else { $('#mario').attr("src", mario_up_1);}
				$('#' + player.id).attr("src", mario_up_1);
				$('#' + player.id).animate({top: "-=20px"}, 10);
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			// Right Arrow Pressed
			case 39:

				if($('#' + player.id).attr("src") == mario_right_1){$('#' + player.id).attr("src", mario_right_2);} 
				else if($('#' + player.id).attr("src") == mario_right_2){$('#' + player.id).attr("src", mario_right_1);} 
				else { $('#' + player.id).attr("src", mario_right_1);}
				$('#' + player.id).animate({left: "+=20px"}, 10);
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			// Down Arrow Pressed
			case 40:
				
				//if($('#mario').attr("src") == mario_down_1){$('#mario').attr("src", mario_down_2);} 
				//else if($('#mario').attr("src") == mario_down_2){$('#mario').attr("src", mario_down_1);} 
				//else { $('#mario').attr("src", mario_down_1);}
				$('#' + player.id).attr("src", mario_down_1);
				$('#' + player.id).animate({top: "+=20px"}, 10);
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;


			//WASD controls
			//A(left) key pressed
			case 65:

				$('#' + player.id).finish().clearQueue();
				if($('#' + player.id).attr("src") == mario_left_1){$('#' + player.id).attr("src", mario_left_2);} 
				else if($('#' + player.id).attr("src") == mario_left_2){$('#' + player.id).attr("src", mario_left_1);} 
				else { $('#' + player.id).attr("src", mario_left_1);}
				player.moveleft();
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			// W(Up) Arrow Pressed
			case 87:

				$('#' + player.id).finish().clearQueue();
				//if($('#mario').attr("src") == mario_up_1){$('#mario').attr("src", mario_up_2);} 
				//else if($('#mario').attr("src") == mario_up_2){$('#mario').attr("src", mario_up_1);} 
				//else { $('#mario').attr("src", mario_up_1);}
				$('#' + player.id).attr("src", mario_up_1);
				player.moveup();
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			// D(Right) Arrow Pressed
			case 68:

				$('#' + player.id).finish().clearQueue();
				if($('#' + player.id).attr("src") == mario_right_1){$('#' + player.id).attr("src", mario_right_2);} 
				else if($('#' + player.id).attr("src") == mario_right_2){$('#' + player.id).attr("src", mario_right_1);} 
				else { $('#' + player.id).attr("src", mario_right_1);}
				player.moveright();
				$('#' + player.id).text("Last Key: " + key.which);
				break;

			// S(Down) Arrow Pressed
			case 83:

				$('#' + player.id).finish().clearQueue();
				//if($('#mario').attr("src") == mario_down_1){$('#mario').attr("src", mario_down_2);} 
				//else if($('#mario').attr("src") == mario_down_2){$('#mario').attr("src", mario_down_1);} 
				//else { $('#mario').attr("src", mario_down_1);}
				$('#' + player.id).attr("src", mario_down_1);
				player.movedown();
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;


			//Other Actions for character
			//Jump
			case 70:
				//$('#mario').clearQueue();
				
				$('#' + player.id).effect('bounce', {times:1}, 400);
				$('#lastKeyPress').text("Last Key: " + key.which);
				break;

			default:
				console.log("KeyPress:" + key.which);

		}

		//============================//
		// EVENT LISTENER ON CLICK
		// On click we create a bullet object, set it to players coords, then animate it in direction of mouse click
		// On click we call player.shoot, this creates a new bullet object, the bullet sets its coordinates to that 
		//============================//

		
	});

	/*
		$(document).click(function(e){
			var xClickCoord = e.pageX; //mouse click x coord
			var yClickCoord = e.pageY; //mouse click y coord
			//console.log("e: " + e.which);
			$('#clickCoords').text("Click Coords: (" + xClickCoord + ","+ yClickCoord + ")");

			var bullet = new Bullet("ZombieSlayer",player.xCoord,player.yCoord);

			var travelX = bullet.xCoord - (xClickCoord); // gets distance
			var travelY = bullet.yCoord - (yClickCoord);
			if (travelX < 0) {travelX = '+=' + Math.abs(travelX);} else {travelX = '-=' + Math.abs(travelX)}
			if (travelY < 0) {travelY = '+=' + Math.abs(travelY);} else {travelY = '-=' + Math.abs(travelY);}

			var bullet_id = $("#" + bullet.id);
			var id = document.getElementById(bullet.id);
			var game = document.getElementById("game");
			//console.log(bullet_id);
			//console.log(xClickCoord);
			//console.log(yClickCoord);
			document.getElementById("demo2").innerHTML = ("Bullet name: " + bullet.name + ", id: " + bullet.id + ", X: " + bullet.xCoord + ", Y: " + bullet.yCoord);
			//$("#" + bullet.id).animate({left: xClickCoord, top: yClickCoord}, 1000);
			bullet_id.animate({left: xClickCoord, top: yClickCoord}, 1000,  function() {console.log("complete");id.parentElement.removeChild(id);});
			//bullet_id.animate({left: travelX, top: travelY}, 1000,  function() {console.log("complete");});

			console.log("BulletID: " + bullet.id);
			//if( $("#" + bullet.id).is(':animated') ){console.log("1");}   
			
			//this.parentElement.removeChild(id);
			//id.parentElement.removeChild(id);
			//game.parentElement.removeChild(game);



	
			//b = [];
			//b = travelDirection(50,a);
			//console.log(typeof b[0]);
			//for(var i = 0; i < 4;i++){
			//	if(i % 2 === 0){console.log("arr["+i+"] = " + b[i]);}
			//	else {console.log("Negative: " + b[i]);}
				
			//}

		});
	*/
		$(document).mousedown(function(event) {
		    switch (event.which) {
		        case 1:
		            //alert('Left Mouse button pressed.');
		            var xClickCoord = event.pageX; //mouse click x coord
					var yClickCoord = event.pageY; //mouse click y coord
		            var bullet = new Bullet("ZombieSlayer",player.xCoord,player.yCoord);
		            var bullet_id = $("#" + bullet.id);
					var id = document.getElementById(bullet.id);
					bullet_id.animate({left: xClickCoord, top: yClickCoord}, 1000,  function() {
						console.log("complete");
						id.parentElement.removeChild(id);
					});
		            break;
		        case 2:
		        	//Middle Mouse Button
		        	genRandomZombie();
		            break;
		        case 3:
		        //Right Mouse Button Pressed
		        	document.addEventListener('contextmenu', function(e) {
		            	//opens custom or no context menu at all
		            	e.preventDefault();
		            }, false);
		        	var xClickCoord = event.pageX; //mouse click x coord
					var yClickCoord = event.pageY; //mouse click y coord
		            var a = getDirection(player.xCoord,player.yCoord,xClickCoord,yClickCoord)
					console.log("typeof a: "+typeof a);
					console.log("bearing a: " + a);
					player.movedirection(a);
		            break;
		        default:
		            alert('You have a strange Mouse!');
    	}
});
	


 // START GAME

//================================================================//
//================================================================//
//							Constructors
//================================================================//
//================================================================//

var size=0;



// Player Object Constructor
function Player(name) {
	if(typeof name === "undefined") { this.name = "bullet";}
	else{this.name = name;}
    this.id = PlayerID();
    this.xCoord = 0;
    this.yCoord = 0;
    this.health = 100;
	this.img = "images/mario-right-1.png";
	$('body').append('<img class="player unselectable" id="' + this.id + '" src="' + this.img +'" />')
	//this.xCoord = $('.player').css('left').split("px");
    //this.yCoord = $('.player').css('top').split("px");
    this.xCoord = 500;
    this.yCoord = 500;
    $("#" + this.id).attr("left", this.xCoord + "px");
    $("#" + this.id).attr("top", this.yCoord + "px");
    this.coords = function() {

 	//this.xCoord = $('#' + this.id).css('left').split("px");
 	//this.xCoord = parseInt(this.xCoord[0] , 10 );
	//this.yCoord = $('#' + this.id).css('top').split("px");
	//this.yCoord = parseInt(this.yCoord[0] , 10 );

	return this.xCoord + "," + this.yCoord;

 	}

 	this.moveleft = function() {
 		$("#" + this.id).animate({left: "-=20px"}, 10);
 		this.xCoord -= 20;
 		//console.log("(left)player x: " + this.xCoord);
 	}
 	this.moveright = function() {
 		$("#" + this.id).animate({left: "+=20px"}, 10);
 		this.xCoord += 20;
 		//console.log("(right)player x: " + this.xCoord);
 	}
 	this.movedown = function() {
 		$("#" + this.id).animate({top: "+=20px"}, 10);
 		this.yCoord += 20;
 		//console.log("(down)player y: " + this.yCoord);
 	}
 	this.moveup = function() {
 		$("#" + this.id).animate({top: "-=20px"}, 10);
 		this.yCoord -= 20;
 		//console.log("(up)player y: " + this.yCoord);
 	}
 	this.movedirection = function(bear) {
 		var speed = 50;
 		var b = [];
 		var sign1,sign2 = "";
 		var xValue,yValue = 0;
		var b = travelDirection(speed,bear);
		if(b[1] == false){sign1 = "+="}
			else if (b[1] == true){sign1 = "-="}
		if(b[3] == false){sign2 = "+="}
			else if (b[3] == true){sign2 = "-="}
		xValue = b[0];
		yValue = b[2];
		$('#' + this.id).animate({left: sign1+xValue+"px", top: sign2+yValue+"px"}, 10);

		if(b[1] == false){this.xCoord += xValue;console.log("x-changePOS");}
			else if (b[1] == true){this.xCoord -= xValue;console.log("x-changeNEG");}
		if(b[3] == false){this.yCoord += yValue;console.log("y-changePOS");}
			else if (b[3] == true){this.yCoord -= yValue;console.log("y-changeNEG");}
 	}
 	this.slide = function() {
 		$("#" + this.id).animate({left: "-=3px"}, 10);
 		this.xCoord = this.xCoord - 3;
 		//console.log("(slide)player x: " + this.xCoord);
 	}



 	this.shoot = function(e) {
	 		// bullet should start at same coords as shooter (left,top)
		//var playerArr = player.coords();
		//var xPlayerCoord = parseInt(playerArr[0],10) + 60;
		//var yPlayerCoord = parseInt(playerArr[1],10) + 100;
		//console.log(" Haix! " + PlayerCoord);
		//console.log(" Haiy! " + yPlayerCoord);d
		//player coords
		//var xshooterCoord = this.coords[0];
		//var yshooterCoord = this.coords[1];
		//shooter bullet coords
		//var xBulletCoord = this.coords[0];
		//var yBulletCoord = this.coords[1];
		//sets bullet coords
		//object.coords[0] = xPlayerCoord;
		//object.coords[1] = yPlayerCoord;
		//displays bullet on screen


		$(object).addClass('active');
		
		$(object).attr("display", "inline");
		// turn coords to ints
		var xBulletCoord = xPlayerCoord;
		var yBulletCoord = yPlayerCoord;
		//console.log("xBulletCoord 1: " + xBulletCoord);
		//console.log("yBulletCoord 1: " + yBulletCoord);
		var xtargetCoord = xCoord;
		var ytargetCoord = yCoord;

		var travelX = xPlayerCoord - xBulletCoord; // gets distance
		var travelY = yPlayerCoord - yBulletCoord;
		console.log("travelX 1: " + travelX);
		console.log("travelY 1: " + travelY);

		var travelX = parseInt(travelX,10);
		var travelY = parseInt(travelY,10);
		if (travelX > 0) {travelX = '+=' + Math.abs(travelX);} else {travelX = '-=' + Math.abs(travelX)}
		if (travelY > 0) {travelY = '+=' + Math.abs(travelY);} else {travelY = '-=' + Math.abs(travelY);}
		console.log("travelX 2: " + travelX);
		console.log("travelY 2: " + travelY);

		$(".bullet").animate({left: travelX, top: travelY}, 1000);
		//target coords
		//var xtargetCoord = target[0];
		//var ytargetCoord = target[1];
		
		var xBulletCoord = $('.bullet').css('left').split("px");
		var yBulletCoord = $('.bullet').css('top').split("px");
		// target is coords, animate a bullet (trail, square dot)  by calculating rise over run to the target.
		// try animating pixels equivalent to rise over run for smooth trail

 	}
};


 // Zombie Object Constructor
 function Zombie(name,x,y,img,speed,health) {

	this.id = ZombieID();
	if(name !== undefined) { this.name = name;} else{this.name ="Zombie";}
	if(health !== undefined) { this.health = health;} else{this.health = 100;}
	if(speed !== undefined) { this.speed = speed;} else{this.speed = 5;}
	if(img !== undefined) { this.img = img;} else{this.img = "images/zombie1.png";}
	$('body').append('<img class="zombie unselectable" id="' + this.id + '" src="' + this.img +'" />');
	if(x !== undefined){
		this.xCoord = x;
		$("#" + this.id).css({left: this.xCoord+'px'});
	}
		else{ this.xCoord = $('.zombie').css('left').split("px"); console.log("undefined zombie x");  }
	if(y !== undefined){
		this.yCoord = y;
		$("#" + this.id).css({ top: this.yCoord+'px' });
	}
		else {this.yCoord = $('.zombie').css('top').split("px"); console.log("undefined zombie y");}
    

    this.coords = function() {

 	//this.xCoord = $('#' + this.id).css('left').split("px");
 	//this.xCoord = parseInt(this.xCoord[0] , 10 );
	//this.yCoord = $('#' + this.id).css('top').split("px");
	//this.yCoord = parseInt(this.yCoord[0] , 10 );
	return this.xCoord + "," + this.yCoord;
 	}

 	this.bite = function(player) {
 		player.health -= 10;
 	}

 	this.moveleft = function(add) {
 		size=this.speed;
 		console.log(typeof add);
 		if(add !== undefined){size += parseInt(add,10);}
 		$("#" + this.id).animate({left: "-="+size+"px"}, 10);
 		this.xCoord = this.xCoord - size;
 	}
 	this.moveright = function(add) {
 		size=this.speed;
 		if(add !== undefined){size += parseInt(add,10);};
 		$("#" + this.id).animate({left: "+="+size+"px"}, 10);
 		this.xCoord = this.xCoord + size;
 	}
 	this.movedown = function(add) {
 		size=this.speed;
 		if(add !== undefined){size += parseInt(add,10);}
 		$("#" + this.id).animate({top: "+="+size+"px"}, 10);
 		this.yCoord = this.yCoord + size;
 	}
 	this.moveup = function(add) {
 		size=this.speed;
 		if(add !== undefined){size += parseInt(add,10);}
 		$("#" + this.id).animate({top: "-="+size+"px"}, 10);
 		this.yCoord = this.yCoord - size;
 	}
 	this.slide = function() {
 		$("#" + this.id).animate({left: "-=3px"}, 10);
 		this.xCoord = this.xCoord - 3;

 	}
 };

// Bullet Object Constructor
function Bullet(name,x,y) {
	if(typeof name === "undefined") { this.name = "bullet";}
	else { this.name = name; }
	if(this.id === undefined){this.id = BulletID();}
	this.xCoord = x;
    this.yCoord = y;
    $('.bullets').append('<div class="bullet class="unselectable" " id="' + this.id + '"></div>');
    $("#" + this.id).css({ top: y+'px' });
    $("#" + this.id).css({ left: x+'px' });
};



//================================================================//
//================================================================//
//							Methods
//================================================================//
//================================================================//




//================================================================//
//================================================================//
//							Functions
//================================================================//
//================================================================//

function main() {
	var hasPressed = false;
	$(document).keydown(function(e) {
		if((e.keyCode != null) && (hasPressed === false)) {
	        alert("Let The Game Begin!");
	        player = new Player("SorrMario");
	        //console.log("player.xCoord: " + player.xCoord);
	        //console.log("player.yCoord: " + player.yCoord);
	        console.log("Player " + player.name + " has entered the game.");
	        document.getElementById("demo").innerHTML = ("Player name: " + player.name + ", id: " + player.id + ", coords: " + player.coords());
	        genRandomZombie();
			intval = window.setInterval(moveBg, 30);
			intval2 = window.setInterval(movePlayer, 30);
			intval3 = window.setInterval(moveZombie, 30);
			intval4 = window.setInterval(function(){

				//var array = getPlayerCoords();
			    if (player.xCoord < 0) {
			    	$('#gameEnd').text("You've Lost at Shitty Mario!");
			    	//$('#mario').css({"left": "500px"});
			    	//$('#mario').css({"top": "500px"});
			    	confirm("You've Lost at Shitty Mario!");
			    	location.reload();

			    	
			    }



			},30);
			
			//console.log("Zombie Name: " + zombie.name);
			//console.log("Zombie Health: " + zombie.health);
			//console.log("Zombie Image: " + zombie.image);

			//CreatureSpawn(zombie);
			
			//console.log("LOG: creature "+ zombie.name + "Left: " + $('.creature').css('left'));
			//console.log("LOG: creature "+ zombie.name + "Top: " + $('.creature').css('top'));
			//var zomLeft = $('.creature').css('left').split("px");
			//var zomCoords = [];
			//zomCoords[0] = zomLeft[0];d
			//console.log(zomCoords[0]);
			
			hasPressed = true;
			console.log(logNum);
			console.log("STARTUP: Game has Started");
			logNum++;

    	}
    return false;

	});
};

//Get the direction between two objects
//Px and Py are the point of focus
// P for position, D for destination 
function getDirection(Px,Py,Dx,Dy){
	var dx=dy=dysign=dxsign=theta=radian=0;

	dx = Dx - Px;
	dy = Dy - Py;

	// Get Negatives and Positives
	// 1=neg; 0=pos
	if(dx >= 0){dxsign = 0}
	else{dxsign=1}
	if(dy >= 0){dysign = 0}
	else{dysign=1}

	//Get Absolute Values
	dx = Math.abs(dx);
	dy = Math.abs(dy);

	//quadrants 2 and 3
	if(dxsign === 1){
		if(dysign === 1){//Quadrant Q2
			radian =  Math.atan((dx/dy));
			theta = 90 + (radian * (180/pi));
			return theta;
		}
			else if(dysign === 0){//Quadrant Q3
				radian =  Math.atan((dy/dx));
				theta = 180 + (radian * (180/pi));
				return theta;
			}
			else{//error
				console.log("ERROR: problem with dxsign and or dysign");
			}

	}
		// quadrants 1 & 4
		else if (dxsign === 0){
			if(dysign===1){//Quadrant 1
				radian = Math.atan((dy/dx));
				theta = radian * (180/pi); // radians to degrees
				return theta;
			}
				else if(dysign===0){//Quadrant 4
					radian = Math.atan((dx/dy));
					theta = 270 + (radian * (180/pi));
					return theta;
				}
				else{//error
					console.log("ERROR: problem with dxsign and or dysign");
				}
		}
		else{//Error
			console.log("ERROR: problem with dxsign and or dysign");
		}

}

	// Returns an array of a point at given bearing and distance
	// Array is [x-coord,xSign, y-coord, ySign]
function travelDirection(dist, bear){
	//return coordinates and pos/neg signs of a point, given a distance and bearing from a point
	var distance = dist;
	var bearing = bear;
	var dy,dx,dxsign,dysign,radian=0;
	dy,dx = false;
	var array = [];
	//degree = radians * 180/pi

	// Q1
	if((bearing <= 90) && (bearing > 0)){ // Quadrant 1
		radian = Math.sin(bearing);
		radian *= (180/pi);
		dx = distance * Math.cos(bearing);
		radian = Math.sin(bearing);
		radian *= (180/pi);
		dy = distance * Math.sin(bearing);
		dxsign = false;
		dysign = true;
	}
	else if((bearing >90) && (bearing <= 180)){ //Quadrant 2
		dy= distance * (Math.cos(bearing));
		dx = distance * Math.sin(bearing); 
		dysign = dxsign = true;

	}
	else if((bearing >180) && (bearing <= 270)){ //Quadrant 3
		dy= distance * Math.sin(bearing);
		dx = distance * Math.cos(bearing);
		dxsign = true;
		dysign = false;

	}
	else if((bearing >270) && (bearing <= 360)){ //Quadrant 4
		dy= distance * Math.cos(bearing);
		dx = distance * Math.sin(bearing);
		dysign = dxsign = false;
	}
	else{//error
		console.log("ERROR: bearing has been corrupted");
	}
	dx = Math.abs(dx);
	dy = Math.abs(dy);
	array.push(dx,dxsign,dy,dysign); 
	return array;

}

// generates a player ID
function PlayerID() {
	//this.id = ("D" + genRandom(10000)); //This works
	return ("P" + genRandom(10000));
	console.log("LOG: PlayerID Created");
};

// generates a zombie ID
function BulletID() {
	//this.id = ("F" + genRandom(10000)); //This works
	return ("B" + genRandom(10000));
	console.log("LOG: BulletID Created");
};

// generates a zombie ID
function ZombieID() {
	//this.id = ("F" + genRandom(10000)); //This works
	return ("Z" + genRandom(10000));
	console.log("LOG: ZombieID Created");
};

// Generate a number between 1 and 20
function genOneToTwenty() {
	var randomNum = Math.ceil(Math.random() * 20);
	return randomNum;
};

// Generate a random 16-digit number, between 1 and given target number
function genRandom(num) {

	var randomNum = Math.ceil(Math.random() * num);
	return randomNum;
};

function genRandomCoords(arg) {

	//TODO: Get viewport height & width, generate coords for things spawning in based on screen size
};

function genRandomZombie(){
	var x=y=0;
	var width = screen.width;
	var height = screen.height;

	var xPad = width/2;
	var yPad = height/2;

	x = width + xPad;
	x = genRandom(x);
	x = x - (xPad/2);
	//Generate coords for new zombie within a range that is outside the window view
	if((x < 0) || (x > width)){
		//if x is to left or right of viewport, than y can be a number inbetween +-200 of y-view size
		//console.log("y-coord1: "+y);
		y = height + yPad;
		y = genRandom(y); //anywhere Between -200y and +200 screen height);
		y = y - (yPad/2);
		//console.log("y-coord2: "+y);
		
	}
	else if ((x >= 0) && (x <= width)) { // generate y that is < 0 or > height
		//console.log("y-coord3: "+y);
		y = genRandom(yPad); 
		y = y - (yPad/2);
		if((y - (yPad/2)) < 0){ y = y - (yPad/2); }
		else {y = height + y;}
		//console.log("y-coord4: "+y);
	}
	else {console.log("ERROR: x-random generation error has occured, out of range");}
	console.log("screen width: "+width);
	console.log("screen height: "+height);
	console.log("zomb-x: "+x);
	console.log("zomb-y: "+y);


	// randomly pick a zombie from different types
	var imgNum = genRandom(7);
	var img = "";
	switch (imgNum) {
		case 1:
			img = "images/zombie1.png";
			name="Joe";
			speed = 5;
			health=100;
			break;
		case 2:
			img = "images/zombie1_glow.jpg";
			name="Glowie Joey";
			speed = 7;
			health=75;
			break;
		case 3:
			img = "images/zombie1_green_glow.jpg";
			name="Green Glen"
			speed = 7;
			health=75;
			break;
		case 4:
			img = "images/zombie1_winter.jpg";
			name="William The White"
			speed = 7;
			health=75;
			break;
		case 5:
			img = "images/zombie1_black.jpg";
			name="Beelzebub"
			speed = 3;
			health=150;
			break;
		case 6:
			img = "images/zombie1_dark.jpg";
			name="Dirty Dan"
			speed = 3;
			health=150;
			break;
		case 7:
			img = "images/zombie1_darker.jpg";
			name="Dark Fright"
			speed = 3;
			health=150;
			break;
		default:
			img = "images/zombie1.png";
			name="Joe";
			speed = 5;
			health=100;
			break;
	}



	//args are: name,x-pos,y-pos,image,speed,health
	zombie = new Zombie(name,x,y,img,speed,health);
	document.getElementById("demo2").innerHTML = ("Zombie name: " + zombie.name + ", id: " + zombie.id
	 + ", speed: " + zombie.speed + ", health: " + zombie.health + ", coords: " + zombie.coords());
};





// This is the AI that moves the zombie towards the player
var moveZombie = function () {
	var slopeX=0,slopeY=0,num=0,movementSpeed=5,deltaX=0,deltaY=0,
		denominator=0,numerator=0,slope=0,distance=0,dYSign=1,dXSign=1,disBuffer=5,disSlide=3;
	// X and Y distance from player
	deltaX = player.xCoord - zombie.xCoord;
	deltaY = player.yCoord - zombie.yCoord;

	// Check for negative values in X & Y
	if (deltaY < 0) {dYSign = 0;} 
	if (deltaX < 0) {dXSign = 0;}

	//Change dx and dy to abs value, so that if theres change(neg or pos), we know
	deltaY = Math.abs(deltaY);
	deltaX = Math.abs(deltaX);

	// Calculate distance from player
	distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
	// Calculate slope for advanced AI movement
	slope = deltaY/deltaX;
	//console.log("zombie.xCoord: "+zombie.xCoord);
	//console.log("zombie.yCoord: "+zombie.yCoord);
	//console.log("deltaX: "+deltaX);
	//console.log("deltaY: "+deltaY);

	// Display Data on Screen
	//$('#playerPos').text("Player coords: "+  player.xCoord + "," + player.yCoord);
	//$('#zomPos').text("Zombie coords: "+  zombie.xCoord + "," + zombie.yCoord);
	//$('#distancex').text("DeltaX: "+  deltaX);
	//$('#distancey').text("DeltaY: "+  deltaY);
	//$('#distance').text("Total Distance: "+  Math.ceil(distance));
	//$('#zomPos').text("Zombie coords: "+  zombie.xCoord + "," + zombie.yCoord);

	//========================================================//
	//Move Creature diagonal, left and right(Movement Method 1) 
	//========================================================//
	/*if (distance < 60) {
		// Slide the creature across the screen
		zombie.slide();
	} 
	else {
		// Move creature towards player
		if(deltaX >= 5) {
			if(dXSign===1){ //pos
				zombie.moveright();
			}
			else if(dXSign===0){ //neg
				zombie.moveleft(3);
			}
			else{console.log("ERROR: problem with dXSign(pos/neg of dX)");}
		}
		if(deltaY >= 5) {
			if(dYSign===1){ //pos
				zombie.movedown();
			}
			else if(dYSign===0){ //neg
				zombie.moveup();
			}
			else{console.log("ERROR: problem with dXSign(pos/neg of dX)");}
		}
	}*/



	//========================================================//
	// Move Creature in a direction(Advanced Movement Method 2) 
	//========================================================//
	if (distance < disBuffer) {
		// Slide the creature across the screen
		zombie.slide();
	} 
	else {

		// No change in y, but change in x
		if((deltaY < disBuffer) && (deltaX >= disBuffer)){ 
			denominator = movementSpeed;
			numerator = 0;
			// if change in X is neg, move left
			if (dXSign === 0){
				denominator += disSlide;
				$('#' + zombie.id).animate({left: "-="+denominator+"px"}, 10);
				zombie.xCoord -= denominator;
				//console.log("MOVE: WEST");
			}
			// if change in X is pos, move right
			else if (dXSign === 1){
				$('#' + zombie.id).animate({left: "+="+denominator+"px"}, 10);
				zombie.xCoord += denominator;
				//console.log("MOVE: EAST");
			}
			else{console.log("ERROR: problem with dXSign(pos/neg of dX)");}
		}

		// No change in y, and no change in x (NOMOVE)
		else if ((deltaY < disBuffer) && (deltaX < disBuffer)){
			//console.log("NOMOVE: dY < 15 and dX < 15")
		}

		// Change in y, but no change in x
		else if ((deltaY >= disBuffer) && (deltaX < disBuffer)){
			numerator = movementSpeed;
			denominator = 0;
			// if change in Y is neg, move up
			if (dYSign === 0){
				$('#' + zombie.id).animate({top: "-="+numerator+"px"}, 10);
				zombie.yCoord -= numerator;
				//console.log("MOVE: NORTH");
			}
			// if change in Y is pos, move down
			else if (dYSign === 1){
				$('#' + zombie.id).animate({top: "+="+numerator+"px"}, 10);
				zombie.yCoord += numerator;
				//console.log("MOVE: SOUTH");
			}
			else{console.log("ERROR: problem with dYSign(pos/neg of dY)");}
		}

		//change in x and y is greater than movement speed, so get new movement coords based off slope
		else{
			//Get Numerator && Denominator
			if (Math.abs(slope) < 1){
	    	denominator = movementSpeed;
	    	numerator = movementSpeed * slope;
	    	//console.log("SLOPE<1: denom: "+denominator);
	    	//console.log("SLOPE<1: numer: "+numerator);
		    }
		    else if (Math.abs(slope) >= 1){
		    	numerator = movementSpeed;
		    	denominator = movementSpeed / slope;
		    	//console.log("SLOPE>=1: denom: "+denominator);
	    		//console.log("SLOPE>=1: numer: "+numerator);
		    }
		    else{console.log("ERROR: Problem with abs val of slope");}


		    if((dYSign===1) && (dXSign===1)){
				$('#' + zombie.id).animate({left: "+="+denominator+"px", top: "+="+numerator+"px"}, 10);
				zombie.xCoord += denominator;
				zombie.yCoord += numerator;
				//console.log("MOVE: SE");
			}
			else if((dYSign===1) && (dXSign===0)){
				denominator += disSlide
				$('#' + zombie.id).animate({left: "-="+denominator+"px", top: "+="+numerator+"px"}, 10);
				zombie.xCoord -= denominator;
				zombie.yCoord += numerator;
				//console.log("MOVE: SW");
			}
			else if((dYSign===0) && (dXSign===1)){
				$('#' + zombie.id).animate({left: "+="+denominator+"px", top: "-="+numerator+"px"}, 10);
				zombie.xCoord += denominator;
				zombie.yCoord -= numerator;
				//console.log("MOVE: NE");
			}
			else if((dYSign===0) && (dXSign===0)){
				denominator += disSlide
				$('#' + zombie.id).animate({left: "-="+denominator+"px", top: "-="+numerator+"px"}, 10);
				zombie.xCoord -= denominator;
				zombie.yCoord -= numerator;
				//console.log("MOVE: NW");
			}
			else{console.log("ERROR: Problem with dYSign or dXSign");}
		}
	}
		//========================================================//
		// 					End Movement Method 2
		//========================================================//

};



// Spawns a Creature Object
/*function CreatureSpawn(creature){
	var num = genOneToTwenty();
	setTimeout(function() {
		//var toAdd = $("input[name=message]").val();
        //$('.creature').append('<img src="' + creature.image + '"></img>');
        $('.creature').prepend('<img id="theImg" src="' + creature.image +'" />')
        console.log("LOG: New " + creature.name + " has spawned");

        //$('.creature').prepend('<img id="theImg" src="' + creature.image + '" />');
	}, 1000);

};*/

//Function that moves the background
function moveBg() {
    
    pos -= 3;
    
    $(".moving-background").css({backgroundPosition: (pos * 1) + "px 0px"});
    
    if (logNum == 1) {
    	console.log(logNum);
    	console.log("STARTUP: Background has started moving");
    	logNum++;
    }
};



function movePlayer() {

	pos2--;

	//$("#mario").css({backgroundPosition: (pos * 1) + "px 0px"});
    //$('#mario').css({left: (pos2 * 1) + "px"}); // This works
    //$('#mario').animate({left: "-=1px"}); // This works
    player.slide(); //This work flawlessly!! 
    if (logNum == 2) {
    	console.log(logNum);
    	console.log("STARTUP: Player has started moving");
    	logNum++;
    }

    /*var array = getPlayerCoords();
    if (array[0] < 0) {
    	$('#game').text("You've Lost at Shitty Mario!");
    	alert("You've Lost at Shitty Mario!");
    }*/

};

//Take in a creature type to start the moving of given creature
/*function moveCreature(creature) {
	//If class of Object == zombie, the execute zombie move function over zombie object 
	creature.move();

	creature = creature.name;
	console.log("Creature to start moving: " + creature));
	switch (creature) {
		case "zombie":
			this.move();
		break;

		default:
		break;


	}
		

};*/

// Takes a target parameter. Could be recieved by click or by player current position.
// Shooter is object calling method, no need to pass it as an arg
function playerShoot(object,xCoord, yCoord) {
	// bullet should start at same coords as shooter (left,top)
	var playerArr = player.coords();
	var xPlayerCoord = parseInt(playerArr[0],10) + 60;
	var yPlayerCoord = parseInt(playerArr[1],10) + 100;
	console.log(" Haix! " + PlayerCoord);
	console.log(" Haiy! " + yPlayerCoord);d
	//player coords
	//var xshooterCoord = this.coords[0];
	//var yshooterCoord = this.coords[1];
	//shooter bullet coords
	//var xBulletCoord = this.coords[0];
	//var yBulletCoord = this.coords[1];
	//sets bullet coords
	object.coords[0] = xPlayerCoord;
	object.coords[1] = yPlayerCoord;
	//displays bullet on screen
	$(object).addClass('active');
	
	$(object).attr("display", "inline");
	// turn coords to ints
	var xBulletCoord = xPlayerCoord;
	var yBulletCoord = yPlayerCoord;
	//console.log("xBulletCoord 1: " + xBulletCoord);
	//console.log("yBulletCoord 1: " + yBulletCoord);
	var xtargetCoord = xCoord;
	var ytargetCoord = yCoord;

	var travelX = xPlayerCoord - xBulletCoord; // gets distance
	var travelY = yPlayerCoord - yBulletCoord;
	console.log("travelX 1: " + travelX);
	console.log("travelY 1: " + travelY);

	var travelX = parseInt(travelX,10);
	var travelY = parseInt(travelY,10);
	if (travelX > 0) {travelX = '+=' + Math.abs(travelX);} else {travelX = '-=' + Math.abs(travelX)}
	if (travelY > 0) {travelY = '+=' + Math.abs(travelY);} else {travelY = '-=' + Math.abs(travelY);}
	console.log("travelX 2: " + travelX);
	console.log("travelY 2: " + travelY);

	$(".bullet").animate({left: travelX, top: travelY}, 1000);
	//target coords
	//var xtargetCoord = target[0];
	//var ytargetCoord = target[1];
	
	var xBulletCoord = $('.bullet').css('left').split("px");
	var yBulletCoord = $('.bullet').css('top').split("px");
	// target is coords, animate a bullet (trail, square dot)  by calculating rise over run to the target.
	// try animating pixels equivalent to rise over run for smooth trail
};

/*function Bullet(){
	// create unique bullet ID between 1 and 10000
	var uniqueID = genRandom(10000);
	//initialize coords, but no need to set. coords will equal coords of object shooting bullet
	this.coords = [];
	$('#mario').append('<div class="bullet" id="' + uniqueID + '"></div>');
	// Want bullet to be active AFTER coords are set, not before.
	//$bullet.addClass('active');
	// returns the bullet Id, so it can be tracked
	var bulletID = parseInt(uniqueID,10) + 10;
	console.log("Bullet(" + bulletID + ") Created");
	return bulletID;
};*/

// When called, brings the element with class .bullet to the player coords
function bringBulletToPlayer() {
		var playerArr = getPlayerCoords();
		var bulletArr = getBulletCoords();
		var xPlayerCoord = parseInt(playerArr[0],10) + 60;
		var yPlayerCoord = parseInt(playerArr[1],10) + 100;
		var xBulletCoord = parseInt(bulletArr[0],10);
		var yBulletCoord = parseInt(bulletArr[1],10);



		//console.log("xBulletCoord 1: " + xBulletCoord);
		//console.log("yBulletCoord 1: " + yBulletCoord);
		var travelX = xPlayerCoord - xBulletCoord; // Get x difference
		var travelY = yPlayerCoord - yBulletCoord; // Get y difference
		travelX = parseInt(travelX,10);
		travelY = parseInt(travelY,10);
		//console.log("travelX 1: " + travelX);
		//console.log("travelY 1: " + travelY);
		if (travelX > 0) {travelX = '+=' + Math.abs(travelX);} else {travelX = '-=' + Math.abs(travelX)}
		if (travelY > 0) {travelY = '+=' + Math.abs(travelY);} else {travelY = '-=' + Math.abs(travelY);}
		//console.log("travelX 2: " + travelX);
		//console.log("travelY 2: " + travelY);
		$(".bullet").animate({left: travelX, top: travelY}, 1000);

};

/*function getBulletCoords() {
	//Gets the initial coords defined in CSS
	var xBulletCoord = $('.bullet').css('left').split("px");
	var yBulletCoord = $('.bullet').css('top').split("px");
	// Makes the coords an int
	xBulletCoord = parseInt(xBulletCoord,10);
	yBulletCoord = parseInt(yBulletCoord,10);
	var coords = [];
	coords[0] = xBulletCoord;
	coords[1] = yBulletCoord;
	
	console.log("Bullet Coords Gotten: (" + coords[0] + "," + coords[1] + ")");
	//returns an array of ints
	return coords;
};*/

// Creates a new Zombie object
/*function Zombie() {
	// health is determined by n(1-20) * 5
	this.name = "zombie";
	var health = genOneToTwenty();
	this.health *= 5;
	this.image = 'zombie1.png';
	// Creates the bite method to be used on target
	var bite = function (target) {
		target.health -= 10;
		return target.health;
	}; 
	
};*/


/*var getPlayerCoords = function() {
	var playerLeft = $('#mario').css('left').split("px");
	var playerTop = $('#mario').css('top').split("px");
	var playerCoords = [];
	playerCoords[0] = playerLeft[0];
	playerCoords[1] = playerTop[0];
	return playerCoords;
};*/




//END DOCUMENT READY
});



