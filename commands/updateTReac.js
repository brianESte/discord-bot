// addTrigResp.js
// default is literal: haha -> /haha/

const fs = require('fs');

module.exports = {
	name: 'updateTReac',
	description: 'Add/remove/update a trigger reaction pair',
	args: true,
	level: 1,
	usage: 'updateTReac "<trigger>" [msg reaction]',
	helpMsg: 'updateTReac "<trigger>" [msg reaction]\n\n\
	Add, update, or remove a trigger reaction pair. To add or update the reaction to a trigger, react to your sent message with the desired reaction. The reaction will overwrite any existing reaction for that trigger. If there are no reactions within 30s, the trigger reaction pair will be removed.\n\n\
<trigger>   	The trigger phrase to be modified\n\
reaction		The bot\'s response to the given trigger phrase',
	execute(msg, args) {
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {			// if for some reason the guild file was not yet initialized...
				var emptyGob = {clearance:{1:[]},info:{},TReac:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the Trob from file
				if(!Object.keys(gob).includes('TReac'))	gob.TReac = {};
				
				var trigger = args[0];

				msg.awaitReactions(() => true, {max: 1, time: 20000, errors: ['time'] })
					.then(collected => {
						var emoji = collected.first().emoji;
						if(emoji.id)	gob.TReac[trigger] = emoji.id;
						else 			gob.TReac[trigger] = emoji.name;
						
						fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
						msg.channel.send('Server file updated');
						// console.log(emoji);
					})
					.catch(collected => {
						delete(gob.TReac[trigger]);
						fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
						msg.channel.send('Server file updated');
						console.log('This was collected however..:'+collected)
					});
			}
		});
	}
}