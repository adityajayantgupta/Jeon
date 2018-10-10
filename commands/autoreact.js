const fs = require('fs')
const path = require('path')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')

exports.run = (bot, message, [trigger]) => {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) return handleError.run(bot, message, `You do not have the permissions to alter my configuration`, `Contact your server owner/administrator to obtain an "Administrator" level permission`)

  if (typeof trigger !== 'string') return handleError.run(bot, message, `Incorrect parameter`, `Please provide a valid trigger keyword`)

  const messageAuthorID = message.author.id

  message.channel.send({
    embed: {
      title: `Autoreact`,
      description: `React with an emoji to set it for the trigger word`,
      color: parseInt(colors.blue),
      fields: [
        {
          name: 'Trigger',
          value: trigger
        },
        {
          name: 'Emoji',
          value: 'None'
        }
      ]
    }
  }).then((message)=> {
    message.awaitReactions((reaction, user) => {
      return user.id === messageAuthorID
    }, { max: 1, time: 6000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first()
        const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)
        let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
        let triggerIndex = settings.autoreact.findIndex(react => react.trigger === trigger)
        if (triggerIndex > -1) {
          settings.autoreact[triggerIndex].emoji = reaction.emoji.name
        } else {
          settings.autoreact.push({
            trigger, emoji: reaction.emoji.name
          })
        }
        fs.writeFile(filepath, JSON.stringify(settings), (e) => {
          if (e) {
            handleError(bot, message, 'An error occurred', 'A critical error occurred while saving the settings. Please try executing the command again')
            console.log(e)
          } else {
            message.edit({
              embed: {
                title: `Autoreact set successfully`,
                description: `I will react with ${reaction.emoji.name} on "${trigger}"`,
                color: parseInt(colors.green),
                fields: [
                  {
                    name: 'Trigger',
                    value: trigger
                  },
                  {
                    name: 'Emoji',
                    value: reaction.emoji.name
                  }
                ]
              }
            })
          }
        })
    })
    .catch(collected => {
        message.reply(`Timeout for adding a reaction.`);
    })
  })

}