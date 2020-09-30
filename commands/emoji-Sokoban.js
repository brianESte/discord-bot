// this will be the embed exmaple cmd

const Discord = require('discord.js');

module.exports = {
	name: 'play', // Sokoban
	description: 'Starts a game of emoji-Sokoban',
	args: false,		// are arguments required? no.
	level: 0,
	usage: 'playSokoban [safe]',
	async execute(msg, args){
		
		const reacFilter = (reaction, user) => {
			//console.log('user:');
			//console.log(user);
			if(args[0] && args[0].toLowerCase() === 'safe'){		// This may be an inneficient / inelegant way of handling this...
				return ['\u2B05','\u2B06','\u2B07','\u27A1'].includes(reaction.emoji.name) && !user.bot && user.id == msg.author.id
			} else {
				return ['\u2B05','\u2B06','\u2B07','\u27A1'].includes(reaction.emoji.name) && !user.bot
			}
		}
		
		// the button and stone classes... 
		class gButton{		
			constructor(newR, newC){
				this._r = newR;
				this._c = newC;
			}
			get r(){ return this._r }
			get c(){ return this._c }
		}
		class gStone extends gButton{	// it might be cleaner / more efficient to store these as objects
			constructor(newR, newC){	// instead of classes... not sure.
				super(newR, newC);
				this._dr = 0;
				this._dc = 0;
			}
			get r(){ return this._r }
			get c(){ return this._c }
			get dr(){ return this._dr }
			get dc(){ return this._dc }
			set r(r){	this._r = r;	}
			set c(c){	this._c = c;	}
			set dr(dr){	this._dr = dr;	}
			set dc(dc){	this._dc = dc;	}
		}
		
		var gameSys = {
			player:{
				id: 0,
				c: 1, 
				r: 1,
				dc: 0,
				dr: 0},
			buttons: [],
			stones: [],
			field: {
				rows: 6, 
				cols: 10,
				space: [[]],
			},
			iconList: {
				0: ':black_large_square:',	// empty space
				1: ':green_square:',		// wall
				2: ':white_circle:',		// stone
				3: ':radio_button:',		// button
				4: ':jack_o_lantern:'},			// player
			active: false,
			setupGame(nStone){
				// initialize field to 0's
				for(var r = 0; rLim = this.field.rows+2, r < rLim; r++){
					this.field.space.push([]);
					for(var c = 0; cLim = this.field.cols+2, c < cLim; c++){
						this.field.space[r].push(0)
					}
				}
				
				// set stone locations
				while(this.stones.length < nStone){	// sth to work on, a clean method of checking that there are no doubles
					var stoneR = Math.floor(Math.random()*(this.field.rows-2))+2;
					var stoneC = Math.floor(Math.random()*(this.field.cols-2))+2;
					if(!this.field.space[stoneR][stoneC]){
						this.stones.push(new gStone(stoneR, stoneC));
						this.field.space[stoneR][stoneC] = 2;
					}
				}
				// set button locations
				while(this.buttons.length < nStone){	// sth to work on, a clean method of checking that there are no doubles
					var buttonR = Math.floor(Math.random()*this.field.rows)+1;
					var buttonC = Math.floor(Math.random()*this.field.cols)+1;
					if(!this.field.space[buttonR][buttonC]){
						this.buttons.push(new gButton(buttonR, buttonC));
						this.field.space[buttonR][buttonC] = 3;
					}
				}
				// set player location
				while(!this.player.id){		// using player.id as a check var here. may replace later
					this.player.r = Math.floor(Math.random()*this.field.rows)+1;
					this.player.c = Math.floor(Math.random()*this.field.cols)+1;
					if(!this.field.space[this.player.r][this.player.c]){
						this.player.id = 1;
						this.field.space[this.player.r][this.player.c] = 4;
					}
				}
				
				// add boundary of 1's to play field
				for(var r = 0; r < this.field.rows+2; r++){
					for(var c = 0; c < this.field.cols+2; c++){
						if(!r || !c || r === this.field.rows+1 || c === this.field.cols+1) this.field.space[r][c] = 1;
					}
				}
			},
			checkMovement(){
				var pdR = this.player.dr, pdC = this.player.dc;
				//console.log(this.field.space[this.player.r + pdR][this.player.c + pdC]);
				if(this.field.space[this.player.r + pdR][this.player.c + pdC] === 1){
					this.player.dc = 0;
					this.player.dr = 0;
				} else if(this.field.space[this.player.r + pdR][this.player.c + pdC] === 2){
					var s = 0;
					for(s; sLen = this.stones.length, s < sLen; s++){		// search the stones for the right one..
						if(this.stones[s].r === this.player.r + pdR && this.stones[s].c === this.player.c + pdC){
							//console.log('stone found?');
							break;
						}
					}
					if(this.field.space[this.stones[s].r + pdR][this.stones[s].c + pdC] === 1){	// if stone against wall
						// this will need to be expanded to for stone against stone
						this.player.dc = 0;
						this.player.dr = 0;
						return 
					} else {
						//console.log('update stone pos');
						this.stones[s].dr = pdR;
						this.stones[s].dc = pdC;
					}
				}
			},
			updatePos(){
				// update player position
				this.player.r += this.player.dr;		
				this.player.c += this.player.dc;
				this.player.dc = 0;
				this.player.dr = 0;
				// update stone positions
				for(var stone of this.stones){		
					stone.r += stone.dr;
					stone.c += stone.dc;
					stone.dr = 0;
					stone.dc = 0;
				}
			},
			checkButtons(){		// a function to check the win condition
				for(var button of this.buttons){
					if(this.field.space[button.r][button.c] != 2) return
				}
				this.active = false;
				msg.channel.send('Winner! Congratulations!');
			}
		}
		
		const updateField = () => {
			gameSys.checkMovement();		// check movement, update deltas
			// place 0's on player and stones,
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 0;
			for(var stone of gameSys.stones){
				gameSys.field.space[stone.r][stone.c] = 0;
			}
			gameSys.updatePos()
			// place button, stone, and player numbers on field
			for(var button of gameSys.buttons){
				gameSys.field.space[button.r][button.c] = 3;
			}	
			for(var stone of gameSys.stones){
				gameSys.field.space[stone.r][stone.c] = 2;
			}
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 4;
		}
		
		const field2Str = () => {		// convert the matrix of numbers to a string of emojis
			var fieldString = '';
			for(var r = 0; r < gameSys.field.rows+2; r++){
				for(var c = 0; c < gameSys.field.cols+2; c++){
					fieldString += gameSys.iconList[gameSys.field.space[r][c]];
				}
				fieldString += '\n';
			}
			return fieldString;
		}
		
		const gameLoop = async gameMsg => {
			gameSys.active = true;
			console.log('*****  game started  *****');
			
			while(gameSys.active){
				//console.log('begin while loop...');
				var collected = await gameMsg.awaitReactions(reacFilter, {max: 1, time: 10000, errors: ['time'] })
					const reaction = collected.first();
					//console.log('there was a reaction');
					switch(reaction.emoji.name){
						case '\u2B05':			// left
							//console.log('Left arrow');
							gameMsg.reactions.cache.get('\u2B05').users.remove(msg.author.id);
							gameSys.player.dc = -1;
							break;
						case '\u2B06':			// up
							//console.log('Up arrow');
							gameMsg.reactions.cache.get('\u2B06').users.remove(msg.author.id);
							gameSys.player.dr = -1;	// negative because strings are displayed L->R, T->B
							break;
						case '\u2B07':			// down
							//console.log('Down arrow');
							gameMsg.reactions.cache.get('\u2B07').users.remove(msg.author.id);
							gameSys.player.dr = 1; // positive because strings are displayed L->R, T->B
							break;
						case '\u27A1':			// right
							//console.log('Right arrow');
							gameMsg.reactions.cache.get('\u27A1').users.remove(msg.author.id);
							gameSys.player.dc = 1;
							break;
						default:		// default?
							console.log('Somehow a reaction other than a cardinal dir was allowed through the filter...');
					}
					
					updateField();
					gameSys.checkButtons();
					embedOb.setDescription(field2Str());	// update the embeded object
					gameMsg.edit(embedOb);	// edit the embeded message
				//}).catch(collected => {
				//	gameSys.active = false;
				//	console.log(collected);
				//	msg.reply('something went wrong with the reaction catching... ');
				//});
			}
			console.log('** Game complete **');
		}
		
		gameSys.setupGame(1);
		updateField();
		
		var gameMsg;
		let embedOb = new Discord.MessageEmbed()
			.setTitle('Game window?')				// set the title of the field
			.setColor(0xff0000)						// Set the color of the embed
			.addField('Player', msg.author.username)
			.setDescription(field2Str());			// Set the main content of the embed
		gameMsg = await msg.channel.send(embedOb);	// send the embed to the channel
		
		gameMsg.react('\u2B05');	// left arrow
		gameMsg.react('\u2B06');	// up arrow
		gameMsg.react('\u2B07');	// down arrow
		gameMsg.react('\u27A1');	// right arrow
		
		// start game
		gameLoop(gameMsg).catch(collected => {
			gameSys.active = false;
			console.log('*****  Game ended  *****');
			console.log('The last reaction collected was:');
			console.log(collected);
			msg.reply('It seems the game has ended... ');
		});
	}
}

/*
botMsg = await msg.channel.send('0123456789');
setTimeout(() => {
	// edit msg 0.5 seconds later
	botMsg.edit(botMsg.content.slice(1) + botMsg.content[0]);
}, 3000);
*/
