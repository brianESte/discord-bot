// addTrigResp.js
// default is literal: haha -> /haha/

const fs = require('fs');

module.exports = {
	name: 'updateTR',
	description: 'Set/remove/clear/list a trigger response pair',
	args: true,
	level: 1,
	usage: 'updateTR <action> "<trigger>" ["<response>"]',
	helpMsg: '\n\
\n\
	Add, update, or remove a trigger response pair. If a response phrase is included, the pair will be added or if there is already a response for the given trigger, it will be overwritten with the new response. Omitting the response removes the pair indicated by the given trigger.\n\
\n\
<trigger>   	The trigger phrase to be modified\n\
<response>  	The bot\'s response to the given trigger phrase\n\
	action options\n\
set				set a response to the provided trigger. Overwrites any existing response.\n\
remove			remove the trigger and associated response\n\
clear			remove all triggers from listing. Requires confirmation\n\
list			list the current trigger response pairs',
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
				
				var action = args.shift().toLowerCase();	// get the action from the first word in the args list

				//console.log(args);
				args = args.join(' ');
				//console.log(args);
				args = args.split('"');
					
				if(action === 'list'){									// *** list ***
					var lenMax = 0;					// find the longest trigger string
					for(const th in gob.Trob){	if(th.length > lenMax) lenMax = th.length;	}
					
					var response = '```';
					for(const th in gob.Trob){
						//console.log(th+' '.repeat(lenMax-th.length)+' => '+gob.Trob[th]);
						response += th+' '.repeat(lenMax-th.length)+' => '+gob.Trob[th]+'\n';
					}
					if(lenMax)	msg.channel.send(response+'```');
					else msg.channel.send('No trigger response pairs saved.\nAdd one with the updateTrigResp command');
				} else if(action === 'clear' && args === 'YES'){		// *** clear ***
					gob.Trob = {};
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'remove'){							// *** remove ***
					delete(gob.Trob[args[1]]);
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} else if(action === 'set'){							// *** set ***
					gob.Trob[args[1]] = args[3];
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				} 
			}
		});
	}
}