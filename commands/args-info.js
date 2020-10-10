// args-info.js
// the command file for the args info discobot cmd

module.exports = {
	name: 'botInfo',
	description: 'Run Me. Tutorial command that explains what the bot can do',
	args: false,
	level: 0,
	usage: 'botInfo',
	helpMsg:'botInfo\n\
	A tutorial sort of command. Designed to walk the server owner through setting the bot up and continued usage.',
	execute(msg, args) {
		
		msg.channel.send('Hello and welcome! Most likely, you are the server owner here to learn the ins and outs of your shiny new bot! \
As you have learned by now, commands follow the basic format of:\n\n\
		@<bot name> <command name> [<command relevant arguments>]\n\n\
To see a list of possible commands, its level, and a short description of what it does, send a bot mention with neither command nor argument:\n\n\
		@<bot name>\n\n\
To receive a command\'s full help message, type the command followed by "help":\n\n\
		@<bot name> <command name> help \n\n\
When you see the list of commands, you may wonder what the level of a command indicates. A command\'s level indicates who (or more accurately, which roles) \
can use that command. Level 0 commands can be used by anyone. Beyond that, for a user to use a non-0 level command, they must have a role that affords them \
the clearance level to do so. The server owner however, is above all in this regard, and retains the highest level of clearance. \
At this point, you may be wondering, how do I assign a level to a role? There is a command for that! Reserved only for the server owner, \
setClearance will allow you to give others access to the bot\'s more entertaining but also dangerous (?) commands.')
		//msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
}