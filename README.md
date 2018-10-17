# ReactorBot

A simple bot made for some very specific tasks.

## Features

- Automatic reactions
  Add automatic reactions to specified keywords so the bot reacts to those keywords whenever they pop up in a message with the set emoji.
- Channel Modes
  Restrict your channel's content to either just text or just attachments (vidoes, images, files etc.). Useful for image-only or text-only channels.
  
## Usage
Execute the `help` command to view the complete command guide with examples

## Self Hosting Instructions
If you want to self-host the bot, you'll need to set up a few things beforehand.
 
- Download the bot's source code as a .zip archive or clone it via your git client
- Create a bot from your Discord account by heading over to the [Discord Developer Portal](https://discordapp.com/developers)
- Open the folder containing the bot's source files. Copy your bot token and then create a new file named `.env` in the downloaded source folder. Paste your token in the following manner `TOKEN=YourTokenHere` and save the file
- Run `npm install` to install any and all dependencies
- Run `node .` to run the bot. If you see a prompt saying 'Online!', you're good to go. If you don't have node installed, install node and npm first.

To invite the bot to your server: 
- Copy your bot's client ID and paste it at the specified position in this URL to generate an invite link
`https://discordapp.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=322624`
- Click on the invite link and select the server to add the bot.
