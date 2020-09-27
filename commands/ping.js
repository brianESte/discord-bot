// ping.js

module.exports = {
	name: 'ping',
	description: 'Pong! to user\'s ping',
	args: false,
	usage: 'ping',
	execute(message, args){
		message.channel.send('Pong!');
	}
}
