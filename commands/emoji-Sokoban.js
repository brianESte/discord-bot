// this will be the embed exmaple cmd

const Discord = require('discord.js');

module.exports = {
	name: 'showEmbed',
	description: 'an embeded message example',
	args: false,
	usage: 'showEmbed',
	async execute(msg, args){
		
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
				2: ':radio_button:',		// button
				3: ':white_circle:',		// stone
				4: ':red_circle:'},			// player
			active: false,
			startGame(){ return 'idk what this should do..';}
		}
		
		const updatePlayerPos = () => {
			// first check that the player wont go into a boundary
			var newC = gameSys.player.c + gameSys.player.dc;
			gameSys.player.c = (newC && newC < gameSys.field.cols+1) ? newC : gameSys.player.c;
			var newR = gameSys.player.r - gameSys.player.dr;
			gameSys.player.r = (newR && newR < gameSys.field.rows+1) ? newR : gameSys.player.r;
			// later stones will be added and collision/contact checking will become necessary.
			gameSys.player.dc = 0;
			gameSys.player.dr = 0;
		}
		const updateField = () => {
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 0;
			updatePlayerPos();
			gameSys.field.space[gameSys.player.r][gameSys.player.c] = 4;
		}
		
		for(var r = 0; r < gameSys.field.rows+2; r++){
			gameSys.field.space.push([]);
			for(var c = 0; c < gameSys.field.cols+2; c++){
				gameSys.field.space[r].push(0)
			}
		}
		for(var r = 0; r < gameSys.field.rows+2; r++){
			for(var c = 0; c < gameSys.field.cols+2; c++){
				if(!r || !c || r === gameSys.field.rows+1 || c === gameSys.field.cols+1) gameSys.field.space[r][c] = 1;
			}
		}

		gameSys.player.c = Math.floor(Math.random()*gameSys.field.cols)+1;
		gameSys.player.y = Math.floor(Math.random()*gameSys.field.rows)+1;
		updateField();

		
		const fieldGen = () => {	
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
			console.log('game started');
			
			while(gameSys.active){
				//console.log('while loop...');
				var collected = await gameMsg.awaitReactions(filter, {max: 1, time: 10000, errors: ['time'] })
				//.then(collected => {
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
							gameSys.player.dr = 1;
							break;
						case '\u2B07':	// down
							console.log('Down arrow');
							gameMsg.reactions.cache.get('\u2B07').users.remove(msg.author.id);
							gameSys.player.dr = -1;
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
					embedOb.setDescription(fieldGen());	// update the embeded object
					gameMsg.edit(embedOb);	// edit the embeded message
				//}).catch(collected => {
				//	gameSys.active = false;
				//	console.log(collected);
				//	msg.reply('something went wrong with the reaction catching... ');
				//});
			}
			console.log('** Game complete **');
		}
				
		//var tempField = (':white_large_square:'.repeat(10)+'\n').repeat(5);
		
		var gameMsg;
		let embedOb = new Discord.MessageEmbed()
			.setTitle('Game window?')			// set the title of the field
			.setColor(0xff0000)					// Set the color of the embed
			.addField('Player', msg.author.username)
			.setDescription(fieldGen());		// Set the main content of the embed
		gameMsg = await msg.channel.send(embedOb);	// send the embed to the channel
		
		
		gameMsg.react('\u2B05');	// left arrow
		gameMsg.react('\u2B06');	// up arrow
		gameMsg.react('\u2B07');	// down arrow
		gameMsg.react('\u27A1');	// right arrow		await 
		
		
		const filter = (reaction, user) => {
			//console.log('user:');
			//console.log(user);
			return ['\u2B05','\u2B06','\u2B07','\u27A1'].includes(reaction.emoji.name) && !user.bot && user.id == msg.author.id;
		}
		
		
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
				embedOb.setDescription(fieldGen());	// update the embeded object
				gameMsg.edit(embedOb);	// edit the embeded message
			}).catch(collected => {
				console.log(collected);
				msg.reply('something went wrong with the reaction catching... ');
			});
			*/
		gameLoop(gameMsg).catch(collected => {
			gameSys.active = false;
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
