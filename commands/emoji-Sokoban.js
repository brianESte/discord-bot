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
		
		class gStone {
			constructor(newR, newC){
				this._r = newR;
				this._c = newC;
			}
			get r(){ return this._r }
			get c(){ return this._c }
		}

		class gButton extends gStone{		
			constructor(newR, newC){
				super(newR, newC);	// can i set the r,c here to consts?
			}
			get r(){ return this._r }
			get c(){ return this._c }
		}
		
		var gameSys = {
			player:{		// a 'movePlayer' function will be needed
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
				4: ':red_circle:'},			// player
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
				while(!this.player.id){		// using player.id as a check var here. may repplace later				
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
				return 'idk what this should return.. maybe a statement that the game is initialized';
			},
			/*
			updatePlayerPos(){
				// first check that the player wont go into a boundary
				var newC = this.player.c + this.player.dc;
				this.player.c = (newC && newC < this.field.cols+1) ? newC : this.player.c;
				var newR = this.player.r - this.player.dr;
				this.player.r = (newR && newR < this.field.rows+1) ? newR : this.player.r;
				// later stones will be added and collision/contact checking will become necessary.
				this.player.dc = 0;
				this.player.dr = 0;
			},*/
			checkMovement(){
				var pdR = this.player.dr, pdC = this.player.dc;
				switch(this.field.space[this.player.r + pdR][this.player.c + pdC]){
					case 1:
						return;
						console.log('conlog between return and break');
						break;	// not sure if this break is necessary...
					case 2:	// if walking into a stone
						if(this.field.space[this.player.r + 2*pdR][this.player.c + 2*pdC] === 1){	// if stone against wall
							return //?
						} else {
							// update stone pos
							msg.channel.send('this would move the stone...');
						}
					default:	// if 
						this.player.r += pdR;
						this.player.c += pdC;
				}
				this.player.dc = 0;
				this.player.dr = 0;
			}
		}
		
		const updateField = () => {
			// place 0's on player and stones,
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 0;
			gameSys.checkMovement();		
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 4;
		}
		
		const field2Str = () => {	
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
				var collected = await gameMsg.awaitReactions(reacFilter, {max: 1, time: 10000, errors: ['time'] })
					const reaction = collected.first();
					//console.log('there was a reaction');
					switch(reaction.emoji.name){
						case '\u2B05':	// left
							console.log('Left arrow');
							gameMsg.reactions.cache.get('\u2B05').users.remove(msg.author.id);
							//console.log(gameMsg.reactions.cache.get('\u2B05').users.cache.get(msg.author.id));
							gameSys.player.dc = -1;
							break;
						case '\u2B06':	// up
							console.log('Up arrow');
							gameMsg.reactions.cache.get('\u2B06').users.remove(msg.author.id);
							gameSys.player.dr = -1;	// negative because strings are displayed L->R, T->B
							break;
						case '\u2B07':	// down
							console.log('Down arrow');
							gameMsg.reactions.cache.get('\u2B07').users.remove(msg.author.id);
							gameSys.player.dr = 1; // positive because strings are displayed L->R, T->B
							break;
						case '\u27A1':	// right
							console.log('Right arrow');
							gameMsg.reactions.cache.get('\u27A1').users.remove(msg.author.id);
							gameSys.player.dc = 1;
							break;
						default:		// default?
							console.log('Somehow a reaction other than a cardinal dir was allowed through the filter...');
					}
					//console.log(gameMsg.reactions.cache);
					/*for(let [key, value] of gameMsg.reactions.cache){
						if(value.count > 1){				// *** at some point i wil need to make this user specific
							value.users.remove();
						}
					}*/
					
					updateField();
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
		
		gameSys.setupGame(2);
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
		
		/*
		gameMsg.awaitReactions(filter, {max: 1, time: 20000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
				//console.log(collected);
				switch(reaction.emoji.name){
					case '\u2B05':	// left
						console.log('Left arrow');
						gameMsg.reactions.cache.get('\u2B05').users.remove();
						gameSys.player.dc = -1;
						break;
					case '\u2B06':	// up
						console.log('Up arrow');
						gameMsg.reactions.cache.get('\u2B06').users.remove();
						gameSys.player.dr = 1;
						break;
					case '\u2B07':	// down
						console.log('Down arrow');
						gameMsg.reactions.cache.get('\u2B07').users.remove();
						gameSys.player.dr = -1;
						break;
					case '\u27A1':	// right
						console.log('Right arrow');
						gameMsg.reactions.cache.get('\u27A1').users.remove();
						gameSys.player.dc = 1;
						break;
					default:		// default?
						console.log('Somehow a reaction other than a cardinal dir was allowed through the filter...');
				}
				//console.log(gameMsg.reactions.cache);
				/*for(let [key, value] of gameMsg.reactions.cache){
					if(value.count > 1){				// *** at some point i wil need to make this user specific
						value.users.remove();
					}
				}///
				
				updateField();
				embedOb.setDescription(field2Str());	// update the embeded object
				gameMsg.edit(embedOb);	// edit the embeded message
			}).catch(collected => {
				console.log(collected);
				msg.reply('something went wrong with the reaction catching... ');
			});
			*/
		gameLoop(gameMsg).catch(collected => {
			gameSys.active = false;
			console.log('*****  Game ended  *****');
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
