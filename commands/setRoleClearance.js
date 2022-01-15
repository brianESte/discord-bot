// setRoleClearance.js
// A set permissions / level command is necessary

const fs = require('fs');

module.exports = {
	name: 'cl',
	description: 'set clearance level for various roles',
	args: true,
	level: 2,
	usage: 'cl <action> [<level> <+|-> <role>]',
	helpMsg: 
"	Server owner may list or change role clearance levels.\n\
\n\
	action options\n\
list			List each level and the roles associated with it\n\
set     		Set a role's clearance level\n\
	set level options\n\
<level> 		The clearance level whose roles will be updated\n\
<+|->   		+ assigns the given role to the given level\n\
				- removes the given role from the given level\n\
<role>  		The role to be assigned/lose a level",
	execute(msg, args){
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {
				var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the Trob from file
				var action = args.shift().toLowerCase();	// get the action from the args list
				
				if(action === "list"){
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
				} else if(action === "set"){
					// args: [1, '+', 'name', 'spaces', 'role']
		
					var level = args.shift();	// level should* be the first element
					var plusMinus = args.shift();	// +/- should* be the second element
					if(!parseFloat(level) || (plusMinus != '+' && plusMinus != '-'))	return msg.reply('Incorrect format, please see cmd help')
					
					var role = args.join(' ');
					
					// Perhaps there is a better way to handle this...
					const checkRole = name => {
						for(let [id, role] of msg.channel.guild.roles.cache){
							if(role.name === name) return true
						}
						return false
					}
					
					if(!checkRole(role)) return msg.reply('that role was not found...');
		
					// may want to change this to describe the bounds once there are more than 3 cmd levels..
					if(!Object.keys(gob.clearance).includes(String(level)))	return msg.reply('that level is out of bounds')
					
					if(plusMinus === '+'){
						gob.clearance[level].push(role)
					} else if(plusMinus === '-'){
						var index = gob.clearance[level].indexOf(role);
						if(index > -1) gob.clearance[level].splice(index, 1)
					}
					fs.writeFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(gob), (err) => {if(err) throw(err)});
					msg.channel.send('Server file updated');
				}
			}
		});
	}
}
