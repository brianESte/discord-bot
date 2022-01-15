// display_credits.js
// Displays te credits of/for the bot

module.exports = {
	name: 'credits',
	description: 'Displays the bot credits',
	args: false,
	level: 0,
	usage: 'credits',
	helpMsg: '',
	execute(msg, args){
		msg.channel.send("Want to know how the bot works in detail? Check out the code here: https://github.com/brianESte/discord-bot");
	}
}
