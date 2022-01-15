// updateTrigReaction.js

const fs = require('fs');

module.exports = {
	name: 'treac',		// short for Trigger Reaction. Does it need a better name?
	description: 'Modify the trigger reaction pair list',
	args: true,
	level: 1,
	usage: 'treac <action> ["<trigger>" [msg reaction]]',
	helpMsg:
"	Set or remove a trigger reaction pair, or clear all reaction pairs. To add or update the reaction to a trigger, react to your sent message with the desired reaction(s). The reaction(s) will overwrite any existing reaction for that trigger. The command times out 15s after the last reaction.\n\
\n\
	action options\n\
clear   		remove all triggers from listing. Requires confirmation\n\
list			list the current trigger reaction pairs\n\
remove  		remove the trigger and associated reactions\n\
set     		set the reactions to the provided trigger. Overwrites any existing reactions.\n\
	remove / set options\n\
<trigger>   	The trigger phrase to be modified\n\
reaction(s)     The bot's response to the given trigger phrase",
	execute(msg, args) {
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {			// if for some reason the guild file was not yet initialized...
				var emptyGob = {clearance:{1:[]},info:{},TReac:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the gob from file
				if(!Object.keys(gob).includes('TReac'))	gob.TReac = {};
				
				var action = args.shift().toLowerCase();	// get the action from the first word in the args list
				var trigger = args.join(' ');		// join the args into a single trigger phrase
				
				if(action === 'set'){									// *****	set		*****
					var reactionList = [];			// array to store the reactions
					
					// create a reactionCollector with a time limit of 15 seconds and no filter
					const collector = msg.createReactionCollector(() => true, {time: 15000});
					collector.on('collect', reac => {
						console.log(`Collected ${reac.emoji.name}`);
						if(reac.emoji.id)	reactionList.push(reac.emoji.id);		// if it has an id (indicates custom emoji) store it
						else 				reactionList.push(reac.emoji.name);		// otherwise store the name
						collector.resetTimer();										// reset the timer for the next emoji
					});
					collector.on('end', collected => {
						gob.TReac[trigger] = reactionList;			// store the array in the gob
						fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
						msg.channel.send('Server file updated');
						console.log('Collected '+collected.size+' item(s)');
					});
				} else if(action === 'remove'){							// *****	remove	*****
					delete(gob.TReac[trigger]);
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'clear' && trigger === 'YES'){		// *****	clear	*****
					gob.TReac = {};
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'list'){							// *****	list	*****
					for(const trigger in gob.TReac){
						msg.channel.send(trigger)			// send the trigger to the channel
							.then(sent => {
								for(const reaction of gob.TReac[trigger]){	// react with each reaction in the reactList
									sent.react(reaction)
								}
							});	
					}
				}
			}
		});
	}
}
