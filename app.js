// my discoBot!
// note: 'guild' means server
// addbot: discord.com/oauth2/authorize?scope=bot&permissions=354368&client_id=752...

const fs = require('fs');
const {clientID, token, grFname} = require('./config.json');	// store sensitive/config data separately
// This {a, b} = sth(); is an example of destructuring

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();	// a collection of commands?
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of cmdFiles){
	const command = require(`./commands/${file}`);
	// set a new item in the collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

var botMsgID = 0;
var botMsg;
var globalResps = {};

fs.readFile(grFname, 'utf8', (err, data) => {
	if(err) {
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
});

// var botRepl;

client.on('message', async msg => {
	if(msg.author.bot) return;	// if a bot sent the message, ignore it.
	
	var serv = msg.channel.guild;
	const adminFilter = role => role.name.toLowerCase() === 'admin';

	
	//console.log('author info:');
	//console.log(msg.author.username+': '+msg.author.id);
	//console.log('roles info:');
	/*
	for(let [key, value] of msg.channel.guild.roles.cache){
		if(value.name.toLowerCase() === 'admin'){
			//console.log(value);
			adminID = value.id;
		}
	}*/
	
	/*
	console.log('member (author) info:');
	console.log(serv.members.cache.get(msg.author.id).roles.cache.some(adminFilter));
	for(let [key, value] of serv.members.cache){
		//console.log(value);
		//if(value.roles.cache.has(adminID))	console.log(`${value.user.username} is an admin`);
		
		if(value.roles.cache.some(adminFilter)) console.log('admin.'); 
	}*/
	
	// var chan = msg.channel;
	
	//console.log(chan.guild.members);
	//console.log(msg);
	console.log(`${msg.author.id}: ${msg.content}`);
	/*
	botRepl = await msg.channel.send('Message editi');
	setTimeout(() => {
		botRepl.edit('Message editing in progress');
	}, 5000);
	*/
	
	//console.log(client.users.cache);
	
	// if someone accidently uses the role-mention...
	if(msg.content.startsWith('<@&752547390871044218>')) msg.reply('Looks like you used the role-mention instead of the std mention!');
	// from bluedrgnfire: &757964913523163187
	
	// if the message is a command to the bot...
	if(msg.content.match(new RegExp('^<@!?'+clientID))){
		if( msg.author.id != serv.ownerID && !serv.members.cache.get(msg.author.id).roles.cache.some(adminFilter)){
			return msg.reply('Apologies, you do not have the necessary clearance to command me');
		}
		
		const args = msg.content.trim().split(/ +/).slice(1);	// remove spaces..
		
		if(!args.length){	// if no args are provided, display a summary of all commands
			var lenMax = 'Command name'.length;
			var helpMsg = '```';
			for(let cmd of client.commands.keys()){
				if(cmd.length > lenMax) lenMax = cmd.length;
			}
			helpMsg += 'Command name'+' '.repeat(lenMax-12)+'   '+'Command description\n';
			helpMsg += '-'.repeat(lenMax)+'-+-'+'-'.repeat(20)+'\n';
			for(let [cmd, value] of client.commands){
				helpMsg += cmd+' '.repeat(lenMax-cmd.length)+' : '+value.description+'\n';
			}
			msg.channel.send(helpMsg+'```');
			return;
		}
				// this section feels like it could be cleaner
		const cmdName = args.shift(); //.toLowerCase();
		console.log(`Command: ${cmdName} with args: ${args}`);	// what exactly does this do?
		
		if(!client.commands.has(cmdName)) return;	// if no valid cmd given, return nothing.
		
		const command = client.commands.get(cmdName);
		
		if(command.args && !args.length){	// if the command requires arguments, but none are provided, say so.
			return msg.channel.send(`You did not provide enough arguments, ${msg.author}!`);
		}
		// command help message
		if(args.length && args[0].toLowerCase() === 'help'){
			return msg.channel.send(command.usage);
		}		
		
		try {						// finally, execute the requested command
			command.execute(msg, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command');
		}
    } else {
		// check if the msg contents match any Response Triggers
		const fname = './guilds/' + msg.guild.id + '.json';
		
		fs.readFile(fname, 'utf8', (err, data) => {
			if(err) {
				var emptyGob = {info:{},Trob:{}};
				fs.appendFile(fname, JSON.stringify(emptyGob), (err) => {
					if(err) throw err;
					console.log('New file created');
				});
			} else {
				var localTrob = JSON.parse(data).Trob;
				//console.log(localTrob);
				var resp = check4Trigs(localTrob, msg.content);
				if(resp){
					msg.channel.send(resp);
					// return 'local';
				}
			}
			var resp = check4Trigs(globalResps, msg.content);
			if(resp){
				msg.channel.send(resp);
				// return 'global';
			}
		});	
	}
})

//console.log(client.presence);

// Log in bot using the token
client.login(token)