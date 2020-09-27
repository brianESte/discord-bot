// reset local bot trob
const fs = require('fs');

module.exports = {
	name: 'resetResponses',
	description: 'Resets the local trigger-response object',
	args: true,		// ill probably make the user confirm they wish to reset the trob
	usage: 'resetResponses <confirmation>',
	execute(msg, args) {
		if(args[0].toLowerCase() != 'yes') return;
		
		var gfname = msg.guild.id+'.json';
		console.log(gfname);
		
		fs.readFile(gfname, 'utf8', (err, data) => {
			if(err) { console.log(err);
			} else {
				gob = JSON.parse(data);
				
				gob.Trob = {};
				fs.writeFile(gfname, JSON.stringify(gob), (err) => {if(err) throw(err)});
			}
		});
		
	}
}