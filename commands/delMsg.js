// delMsg command

module.exports = {
	name: 'delmsg',
	description: 'Deletes messages determined by the arguments',
	args: true,
	level: 1,
	usage: 'delmsg <quantity> [user:<user> | bot]',
	helpMsg: 
"	Delete messages starting with the most recent one, filtered by the given arguments.\n\
\n\
<quantity>   	Number of messages to delete.\n\
user:<user>  	Target the specified user\'s messages\n\
<bot>			Target messages from bots",
	execute(msg, args){
		if(!parseFloat(args[0]) || parseFloat(args[0]) < 1){
			return msg.reply('First argument must be a number greater than 0');
		}

		// not totally a fan of using eval like this...
		// filter function
		const filter = msg => {
			for(let criterion of qualifiers){		// cycle through the qualifiers
				if(!eval(criterion)){				// if a criterion evaluates to false..
					console.log(`Searching for msgs that match ${criterion}`);			// log the criterion
					return false;					// and return false
				}
			}
			return true								// otherwise return true
		}

		// channel member search function
		const chMemberSearch = name => {
			for(let [id, m] of msg.channel.members){		// cycle through this channel's members
				if(m.user.username === name)	return true	// if found, return true
			}
			return false							// if not found, return false
		}
		
		var quantity = Math.round(args[0]);		// in case anyone tries to delete 1.6 messages...
		var qualifiers = [true];
		
		// process the qualifiers:
		for(let i = 1; len = args.length, i < len; i++){
			if(args[i].toLowerCase().startsWith('user:')){		// if trying to filter messages by user..
				// check that the given user exists, and if not, return with a message that says so
				if(!chMemberSearch(args[i].slice(5))) return msg.reply('username "'+args[i].slice(5)+'" not found.')
				// if given username is found, add a condition to qualifiers
				qualifiers.push('msg.author.username === "'+args[i].slice(5)+'"');
			} else if(args[i].includes('bot')){
				qualifiers.push('msg.author.bot')					
			} /*else if(args[i].toLowerCase().startsWith('after:')){
				qualifiers.push('msg.cTimestamp > '+args[i].slice(6));
			} else if(args[i].toLowerCase().startsWith('before:')){
				qualifiers.push('msg.cTimestamp < '+args[i].slice(7));
			}*/
		}
		
		// asynchronous while loop
		const wLoop = async quantity => {
			var delCt = 0;
			var delPromises = [];

			// take the sent msg id, increase it by 1 ms, and use it as the starting msg id:
			var startMsgID = String(Number(msg.id) + 2**23);
			
			while(delCt < quantity){
				// this will return a promise, and then wait for it to be resolved
				var messages = await msg.channel.messages.fetch({ limit: Math.max(10, quantity), before:startMsgID });
				
				console.log(`${messages.size} messages fetched`);
				
				for(let [key, value] of messages){
					if(value.id < startMsgID) startMsgID = value.id
					
					if(filter(value)){	//value.author.id === authorID){
						// tell each message to be deleted, and push each returned promise onto the promise array
						delPromises.push(value.delete());		
						delCt++;
						console.log(`Deleting message "${value.content}" from ${value.author.username}`);
						if(delCt >= quantity) break;
					}
				}
			}
			await Promise.all(delPromises)
				.then(() => {	console.log('*****  Message deletion complete  *****')	});
			//console.log('*****  Message deletion complete  *****');
		}
		wLoop(quantity);	//.then(() => console.log('all done'));
	}
}
