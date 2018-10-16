const helpArray = require('../config/help.json')
const colors = require('../config/colors.json')

exports.run = (bot, message, helpFor) => {
  helpFor = helpFor.join(' ').toLowerCase()
  if (!helpFor) {
    let fields = []
    for (let i = 0; i < helpArray.length - 1; i++) {
      fields.push({
        name: `${parseInt(i) + parseInt(1)}. ${helpArray[i].name}`,
        value: `${helpArray[i].description}
                \nSyntax: \`\`\`${helpArray[i].syntax}\`\`\` Example: \`\`\`${helpArray[i].example}\`\`\`
               `
      })
    }
    message.author.send({
      embed: {
        color: parseInt(colors.blue),
        description: `Here's the command guide\n\n`,
        author: {
          name: `COMMAND GUIDE`
        },
        fields: fields
      }
    }).then(
        message.channel.send({
          embed: {
            color: parseInt(colors.blue),
            description: `${message.author}, have a look at your inbox.`
          }
        })
      ).catch(e => { return message.reply(`Couldn't complete the operation due to ${e}`) })
  }
  if (helpFor) {
    let helpIndex = helpArray.findIndex(help => help.command === helpFor)

    if (helpIndex > -1) {
      message.channel.send({
        embed: {
          color: parseInt(colors.blue),
          description: `${helpArray[helpIndex].description}`,
          author: {
            name: `${helpArray[helpIndex].name}`
          },
          fields: [
            {
              'name': 'Syntax',
              'value': `\`\`\`${helpArray[helpIndex].syntax}\`\`\``
            },
            {
              'name': 'Example',
              'value': `\`\`\`${helpArray[helpIndex].example}\`\`\``
            }
          ]
        }
      })
    }
  }
}
