# Discord bot

This bot borrows / has features from other better known bots, such as [Echo](https://discord.bots.gg/bots/249891250117804032), and the sokoban-Bot. Current point of work is code cleanliness and naming consistency.
May rename some commands to something more linuxy.

Current Commands
---------------------------------------------
* botInfo
  - Acts as a setup function to be run by the server owner / administrator
  - Explains the basics of the bot
* delMsg
  - Deletes messages determined by the given arguments
* playSokoban
  - Starts a game of emoji-Sokoban
  - Based on the bot / project [seen here](https://www.youtube.com/watch?v=0fWdU8JCT6Y)
  - Improvements include:
	- Message edit on game update, instead of new message
	- Variable playfield
* setClearance
  - set the clearance level for different server roles
  - used to allow certain roles / members access to more commands
* listRCL
  - List clearance levels and the roles assocaited with them
* updateTR
  - Set / remove / clear a trigger response pair
  - List the stored trigger response pairs
* treac
  - Set / remove / clear / list trigger reaction pairs
  - accepts multiple emoji reactions
