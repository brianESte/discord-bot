// args-info.js
// the command file for the args info discobot cmd

module.exports = {
	name: 'args-info',
	description: 'Replies with information about the provided arguments',
	args: true,
	level: 0,
	usage: 'args-info <args>',
	helpMsg:'\
args-info <args>\n\
		An early test command the merely returns the provided arguments.\n\
	<args>			arguments that will be returned by the command.',
	execute(msg, args) {		
		msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
}