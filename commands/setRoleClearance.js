// A set permissions / level command is necessary

const fs = require('fs');

module.exports = {
	name: 'setClearance',
	description: 'set clearance level for various roles',
	args: true,
	level: 2,
	usage: 'setClearance <level> <+|-> <role>',
	helpMsg: 'setClearance <level> <+|-> <role>\n\
\n\
	Allows server owner to set a role\'s clearance level.\n\
\n\
<level> 	The clearance level whose roles will be updated\n\
<+|->   	+ assigns the given role to the given level\n\
			- removes the given role from the given level\n\
<role>  	The role to be assigned/lose a level',
	execute(msg, args){
		// args: [1, '+', 'name', 'spaces', 'role']
		
		var level = args.shift();	// level should* be the first element
		var plusMinus = args.shift();	// +/- should* be the second element
		if(!parseFloat(level) || (plusMinus != '+' && plusMinus != '-'))	return msg.reply('Incorrect format, please see cmd help')
		
		var role = args.join(' ');
		
		const checkRole = name => {
			for(let [id, role] of msg.channel.guild.roles.cache){
				if(role.name === name) return true
			}
			return false
		}
		
		if(!checkRole(role)) return msg.reply('that role was not found...');
		
		fs.readFile('./guilds/'+msg.guild.id+'.json', 'utf8', (err, data) => {
			if(err) {
				var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
				fs.appendFile('./guilds/'+msg.guild.id+'.json', JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var gob = JSON.parse(data);	// read the Trob from file
				
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
		});
	}
}