// TriggerReaction.js
// default is literal: haha -> /haha/

const fs = require('fs');

module.exports = {
	name: 'TReaction',		// short for Trigger Reaction. Does it need a better name?
	description: 'Modify the trigger reaction pair list',
	args: true,
	level: 1,
	usage: 'TReaction <action> "<trigger>" [msg reaction]',
	helpMsg: '\n\
\n\
	Set or remove a trigger reaction pair, or clear all reaction pairs. To add or update the reaction to a trigger, react to your sent message with the desired reaction. The reaction will overwrite any existing reaction for that trigger. The command times out in 30s.\n\
\n\
<trigger>   	The trigger phrase to be modified\n\
reaction		The bot\'s response to the given trigger phrase\n\
	action options\n\
set				set a reaction to the provided trigger. Overwrites any existing reaction.\n\
remove			remove the trigger and associated reaction\n\
clear			remove all triggers from listing. Requires confirmation\n\
list			list the current trigger reaction pairs',
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
				
				// what state do the args come in?
				var action = args.shift().toLowerCase();	// get the action from the first word in the args list
				var trigger = args.join(' ');		// join the args into a single trigger phrase
				
				if(action === 'set'){									// *** set ***
					msg.awaitReactions(() => true, {max: 1, time: 20000, errors: ['time'] })
						.then(collected => {
							var emoji = collected.first().emoji;
							if(emoji.id)	gob.TReac[trigger] = emoji.id;		// if it has an id (indicates custom emoji) store it
							else 			gob.TReac[trigger] = emoji.name;	// otherwise store the name
							
							fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
							msg.channel.send('Server file updated');
							// console.log(emoji);
						})
						.catch(collected => {
							console.log('This collected caught..:'+collected)
						});
				} else if(action === 'remove'){							// *** remove ***
					delete(gob.TReac[trigger]);
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'clear' && trigger === 'YES'){		// *** clear ***
					gob.TReac = {};
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'list'){							// *** list ***
					for(const th in gob.TReac){
						msg.channel.send(th)			// send the trigger in a message
						  .then(sent => sent.react(gob.TReac[th]));	// then react to it with the associated reaction
					}
				}
			}
		});
	}
}