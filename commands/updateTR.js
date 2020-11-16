// addTrigResp.js
// default is literal: haha -> /haha/

const fs = require('fs');

module.exports = {
	name: 'updateTR',
	description: 'Add/remove/update a trigger response pair',
	args: true,
	level: 1,
	usage: 'updateTR "<trigger>" ["<response>"]',
	helpMsg: '\n\
\n\
	Add, update, or remove a trigger response pair. If a response phrase is included, the pair will be added or if there is already a response for the given trigger, it will be overwritten with the new response. Omitting the response removes the pair indicated by the given trigger.\n\
\n\
<trigger>   	The trigger phrase to be modified\n\
<response>  	The bot\'s response to the given trigger phrase',
	execute(msg, args) {
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {			// if for some reason the guild file was not yet initialized...
				var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the Trob from file

				//console.log(args);
				args = args.join(' ');
				//console.log(args);
				args = args.split('"');
				
				if(args.length < 4){	// this is to delete a TR
					delete(gob.Trob[args[1]]);
				} else {				// add/update a TR
					gob.Trob[args[1]] = args[3];
				}
				
				fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
				msg.channel.send('Server file updated');
			}
		});
	}
}