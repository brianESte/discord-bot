// args-info.js
// the command file for the args info discobot cmd

module.exports = {
	name: 'args-info',
	description: 'Replies with information about the provided arguments',
	args: true,
	usage: '<args>',
	execute(msg, args) {		
		msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
}