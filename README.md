# Discord bot

This bot borrows / has features from other better known bots, such as [Echo](https://discord.bots.gg/bots/249891250117804032), and the sokoban-Bot. Current point of work is code cleanliness and naming consistency.
May rename some commands to something more linuxy.

Current Commands
---------------------------------------------
* welcome
  - Introduces the bot and its basic functions
* delMsg
  - Deletes messages determined by the given arguments
  - Can target messages from a specific user or bots
* playSokoban
  - Starts a game of emoji-Sokoban
  - Based on the bot / project [seen here](https://www.youtube.com/watch?v=0fWdU8JCT6Y)
  - Improvements include:
    - Message edit on game update, instead of new message
    - Variable playfield
* cl
  - List clearance levels and the roles assocaited with them
  - Set the clearance level for different server roles
  - Used to allow certain roles / members access to more commands
* tresp
  - Set / remove / clear a trigger response pair
  - List the stored trigger response pairs
* treac
  - Set / remove / clear / list trigger reaction pairs
  - Accepts multiple emoji reactions

