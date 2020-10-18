// list levels and roles associated with each

const fs = require('fs');

module.exports = {
	name: 'listRCL',
	description: 'List clearance levels and the roles associated',
	args: false,
	level: 2,
	usage: 'listRCL',
	// a space is needed before the '\n\'.. not sure why exactly..
	helpMsg: "listRCL \n\
\n\
	List each level and the roles associated with it. No arguments required",
	execute(msg, args){
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {
				var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the guild object from file
				var roleCount = 0;		// count how many roles have been given a clearance level
				// Lvl   Roles
				//  1  : Admin, Bot user, ...
				var response = '```Lvl   Roles\n';
				for(const th in gob.clearance){
					//console.log(' '+th+' : '+gob.clearance[th].join(', '));
					response += ' '+th+'  : '+gob.clearance[th].join(', ')+'\n';
					roleCount += gob.clearance[th].length;
				}
				if(roleCount)	msg.channel.send(response+'```');
				else msg.channel.send('No roles have been assigned a clearance level.\nAdd one with the setRoleClearance command');
			}
		});
	}
}