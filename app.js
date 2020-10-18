// the main discord bot JS file
// note: 'guild' means server
// addbot: discord.com/oauth2/authorize?scope=bot&permissions=354368&client_id=752...

const fs = require('fs');
const {clientID, token, grFname} = require('./config.json');	// store sensitive/config data separately
// This {a, b} = sth(); is an example of destructuring. destructured object names must match those in containine object

const Discord = require('discord.js');

const actOb = {presence:{activity:{name: 'you ;)', type: 'WATCHING'}}}

const client = new Discord.Client(actOb);
client.commands = new Discord.Collection();	// a collection of commands?
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of cmdFiles){
	const command = require(`./commands/${file}`);
	// set a new item in the collection
	// with the key as the command name and the value as the exported module
	if(!Object.keys(command).includes('name')) continue // If for some reason i made a cmd stub, it should be omitted from the active command list
	client.commands.set(command.name, command);
}

var globalResps = {};

// read the global responses into an object.
fs.readFile(grFname, 'utf8', (err, data) => {
	if(err) {		// if there is no global response file, create one.
		fs.appendFile(grFname, "", (err) => {
			if(err) throw err;
			console.log('New file created');
		});
	} else {
		globalResps = JSON.parse(data);
	}
});

// this nifty function...
function check4Trigs(trob, content){	
	for(const nam in trob){
		var re = nam.split('/');
		// console.log(re);
		if(content.match(new RegExp(re[0], re[1]))){
			return trob[nam];
		}
	}
	return undefined;
}

client.once('ready', () => {
    console.log(`Logged in a ${client.user.tag}!`);
    // client.user.setActivity('name', {type: 'WATCHING'}).catch(console.error);
    // types: playing, streaming, listening, watching, custom_status (not for bots)
});

client.on('message', async msg => {
	if(msg.author.bot) return;	// if a bot sent the message, ignore it.
		
	var serv = msg.channel.guild;
	
	// check that the writer of the message is subject to @everyone... for lvl purposes...
	//for(var role of msg.channel.guild.members.cache.get(msg.author.id).roles.cache.values()){
	//	if(role.name === '@everyone') console.log('role: @everyone')
	//}
	// console.log(`${msg.author.id}: ${msg.content}`);	// for debugging purposes
	
	// if someone accidently uses the role-mention...
	if(msg.content.startsWith('<@&752547390871044218>') || msg.content.startsWith('<@&757964913523163187>')){
		msg.reply('Looks like you used the role-mention instead of the std mention!')
	}
	// from bdf: &757964913523163187
	
	// if the message starts by mentioning the bot...
	if(msg.content.match(new RegExp('^<@!?'+clientID))){
		
		const args = msg.content.trim().split(/ +/).slice(1);	// remove spaces..
		
		if(!args.length){	// if no args/cmd are provided, display a summary of all commands
			var lenMax = 'Command name'.length;
			var helpMsg = '```';
			for(let cmd of client.commands.keys()){
				if(cmd.length > lenMax) lenMax = cmd.length;
			}
			helpMsg += 'Command name'+' '.repeat(lenMax-12)+'  Level  Command description\n';
			helpMsg += '-'.repeat(lenMax)+'-+'+'-'.repeat(5)+'+'+'-'.repeat(20)+'\n';
			for(let [cmd, value] of client.commands){
				helpMsg += cmd+' '.repeat(lenMax-cmd.length)+' :  '+value.level+'  : '+value.description+'\n';
			}
			msg.channel.send(helpMsg+'```');
			return;
		}
				// this section feels like it could be cleaner
		const cmdName = args.shift(); //.toLowerCase();		// do i want the commands to be case sensitive?
		console.log(`Command: ${cmdName} with args: ${args}`);	// what exactly does the 'with' do?
		
		if(!client.commands.has(cmdName)) return;	// if no valid cmd given, return nothing. Might change this to also display valid commands
		
		const cmd = client.commands.get(cmdName);
		
		// If the cmd has a non-0 level, check the author's level...
		if(cmd.level){
			var userLvl = 0;
			// get user role, (if any), get level from that
		
			if(msg.author.id === serv.ownerID){		// if the user is the server owner, she is automatically highest level 
				userLvl = 2;		// may want to make this dynamixally the max known cmd lvl..
			} else {								// if not the server owner.. what level is the user?
				fs.readFile('./guilds/' + msg.guild.id + '.json', 'utf8', (err, data) => {
					if(err) {
						var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
						fs.appendFile(fname, JSON.stringify(emptyGob), (err) => {
							if(err) throw err;
							console.log('New file created');
						});
					} else {
						var clearances = JSON.parse(data).clearance;
						for(const lvl in clearances){
							// clearances[lvl].forEach(function(item, index, array){	// would it be better to loop this way?
							for(let [roleID, role] of msg.channel.guild.members.cache.get(msg.author.id).roles.cache){
								if(clearances[lvl].includes(role.name)){
									userLvl = Math.max(userLvl, lvl);
									break
								}
							}
						}				
					}
				});
				if(cmd.level > userLvl){		// compare cmd level to user level
					// Tell them they are not fit to use the chosen cmd.
					return msg.reply('Apologies, you do not have the necessary clearance to use that command.');
				}
			}
			// console.log(`userLvl: ${userLvl}`);
		}
		// If the user requests help with a command, or attempts to use a command improperly,
		// send the command's help message						*** considering removing the 'args' property... 
		if((cmd.args && !args.length) || (args.length && args[0].toLowerCase() === 'help')){
			// how to determine the msg sender's device within [mobile, web, desktop]
			if(Object.keys(msg.author.presence.clientStatus).every(k => k === 'mobile')){	// user is currently only on mobile...
				return msg.channel.send(cmd.usage)				// send the cmd usage
			} else {											// otherwise...
				return msg.channel.send('```'+cmd.helpMsg+'```')	// send the full help message
			}
		}		
		
		try {						// finally, execute the requested command
			cmd.execute(msg, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command');
		}
    } else {
		// check if the msg contents match any Response Triggers
		const fname = './guilds/' + msg.guild.id + '.json';
		
		fs.readFile(fname, 'utf8', (err, data) => {
			if(err) {
				var emptyGob = {clearance:{1:[]},info:{},Trob:{}};
				fs.appendFile(fname, JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var localTrob = JSON.parse(data).Trob;
				//console.log(localTrob);
				var resp = check4Trigs(localTrob, msg.content);
				if(resp)	return msg.channel.send(resp)	// return if local response
			}
			var resp = check4Trigs(globalResps, msg.content);
			if(resp)	msg.channel.send(resp)	// global response
		});	
	}
})

//console.log(client.presence);

// Log bot in using the token
client.login(token)