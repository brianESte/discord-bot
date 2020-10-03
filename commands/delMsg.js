// delMsg

module.exports = {
	name: 'delMsg',
	description: 'Deletes messages determined by the arguments',
	args: true,
	level: 1,
	usage: 'delMsg <quantity> [user:<user> | bot]',
	helpMsg: '\
delMsg <quantity> [user:<user> | bot]\n\
		Delete messages starting with the most recent one, filtered by the given arguments.\n\
	<quantity>		Number of messages to delete.\n\
	user:<user>		Target the specified user\'s messages\n\
	<bot>			Target messages from bots',
	execute(msg, args){
		if(!parseFloat(args[0])){
			return msg.reply('First argument must be a number');
		}
		
		// generate a flake/id from a date
		const date2flake = (dateDec) => {
			var flakeBinarry = [];
			for(var b = 0; b < 44; b++){
				flakeBinarry.unshift(dateDec%2);
				dateDec = Math.floor(dateDec/2);
			}
			flakeBinarry.push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
			var flake = 0;
			flakeBinarry.reverse();
			for(var b = 0; fLen = flakeBinarry.length, b < fLen; b++){
				if(flakeBinarry[b]) flake += 2**b
			}
			return flake
		}
		// filter function
		var filter = (msg) => {
			for(var criterion of qualifiers){ // var i = 0; i < 2; i++
				if(!eval(criterion)){
					console.log(criterion);
					return false;
				}
			}
			return true
		}
		
		var quantity = Math.round(args[0]);
		var qualifiers = [true];
		
		// process the qualifiers:
		for(var i = 1; len = args.length, i < len; i++){
			if(args[i].toLowerCase().startsWith('user:')){
				
				// this will likely need a check that the user exists in the channel/server
				
				qualifiers.push('msg.author.username === "'+args[i].slice(5)+'"');
			} else if(args[i].includes('bot')){
				qualifiers.push('msg.author.bot')					
			} /*else if(args[i].toLowerCase().startsWith('after:')){
				qualifiers.push('msg.cTimestamp > '+args[i].slice(6));
			} else if(args[i].toLowerCase().startsWith('before:')){
				qualifiers.push('msg.cTimestamp < '+args[i].slice(7));
			}*/
		}
		
		const wLoop = async quantity => {
			var delCt = 0;
			// fake starting msg id:
			var startMsgID = date2flake(new Date() - new Date(2015,0,1,1));
			// Date(2015, 0, 1, 0) is the discord epoch
			
			while(delCt < quantity){
				// this will return a promise, and then wait for it to be resolved
				var messages = await msg.channel.messages.fetch({ limit: quantity, before:startMsgID });	
				
				console.log(`${messages.size} messages fetched`);
				
				for(let [key, value] of messages){
					if(value.id < startMsgID) startMsgID = value.id
					
					if(filter(value)){	//value.author.id === authorID){
						value.delete();
						delCt++;
						console.log(`Deleting message "${value.content}" from ${value.author.username}`);
						if(delCt >= quantity) break;
					}
				}
			}
			console.log('** Message deletion complete **');
		}
		wLoop(quantity);	//.then(() => console.log('all done'));
	}
}