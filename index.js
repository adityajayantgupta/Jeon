const Discord = require('discord.js')
const fs = require('fs')
const colors = require('./config/colors.json')
const settingsTemplate = require('./config/settingsTemplate.json')
const handleError = require('./handlers/errorHandler.js')
const channelHandler = require('./handlers/channelHandler.js')
const reactionHandler = require('./handlers/reactionHandler.js')
require('dotenv').config()

const bot = new Discord.Client({
  autoReconnect: true
})

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`)
    let eventName = file.split('.')[0]
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
  })
})

bot.on('message', message => {
  if (message.author.bot) return

  let prefix = process.env.PREFIX
  if (message.guild) {
    let filepath = `${__dirname}/data/${message.guild.id}.json`
    try {
      let settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      prefix = settings.prefix
    } catch (e) {
      // IDK why but writing synchronusly doesn't work apparently.
      fs.writeFileSync(filepath, JSON.stringify(settingsTemplate))
      handleError.run(bot, message, `The bot prefix has been reset to \`${process.env.PREFIX}\` due to an internal error`, `The required server configuration data could not be found`)
      console.log(e)
    }
  } else if (!message.guild && message.content.startsWith(prefix)) {
    return message.channel.send({
      embed: {
        color: parseInt(colors.yellow),
        description: 'You need to [add me to a server](https://discordapp.com/oauth2/authorize?client_id=356369928426749952&scope=bot&permissions=1007119423) for any of my commands to work mate!'
      }
    })
  }
  if (!message.content.startsWith(prefix)) {
    channelHandler.run(bot, message)
    reactionHandler.run(message)
    return
  }

  let args = message.content.slice(prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  for (let i in args) {
    if (args[i].startsWith(prefix)) {
      args = 0
      command = 0
      return handleError.run(bot, message, `Incorrect Syntax for the command`, `You supplied the bot prefix as an parameter to the command. Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
    }
  }
  try {
    let commandFile = require(`./commands/${command}.js`)
    commandFile.run(bot, message, args)
  } catch (e) {
    console.log(e)
    handleError.run(bot, message, `Command not found`, `Please type \`${prefix}help\` to get the command guide delivered to your inbox.`)
  }
})

bot.login(process.env.TOKEN)
