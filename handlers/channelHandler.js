const fs = require('fs')
const path = require('path')
const download = require ('download-file')
const handleError = require('../handlers/errorHandler.js')
const colors = require('../config/colors.json')
const modes = {
  0: 'None',
  1: 'Text only',
  2: 'Attachments only',
}

exports.run = (bot, message) => {
  const filepath = path.normalize(`${__dirname}/../data/${message.guild.id}.json`)

  let settings = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  let activatedChannelIndex = settings.activatedChannels.findIndex(channel => channel.id === message.channel.id)
  if (activatedChannelIndex > -1) {
    if (settings.activatedChannels[activatedChannelIndex].mode === 1) {
      if (message.attachments.size > 0) {
        message.delete().then(
          message.author.send({
            embed: {
              color: parseInt(colors.red),
              title: 'Your message has been deleted',
              description: `The channel "${message.channel.name}" does not allow sending images or videos`,
              thumbnail: {
                url: 'https://res.cloudinary.com/daemonad/image/upload/v1536387310/32x32_xizb2s.png'
              },
              author: {
                iconUrl: bot.user.avatarURL
              }
            }
          })
        )        
      }
    } else if (settings.activatedChannels[activatedChannelIndex].mode === 2) {
      if (message.attachments.size <= 0) {
        message.delete().then(
          message.author.send({
            embed: {
              color: parseInt(colors.red),
              title: 'Your message has been deleted',
              description: `The channel "${message.channel.name}" only allows sending images or videos`,
              thumbnail: {
                url: 'https://res.cloudinary.com/daemonad/image/upload/v1536387310/32x32_xizb2s.png'
              },
              author: {
                iconUrl: bot.user.avatarURL
              }
            }
          })
        )
      } else if (message.attachments.size >= 0) {
        message.attachments.forEach(function(attachment) {
          let directory = path.normalize(`${__dirname}/../tmpFiles/`)
          let filename = `${message.channel.id}_${message.member.id}_${attachment.filename}`
          let filepath = directory + filename
          let options = {
            directory, filename
          }
          download(attachment.url, options, (e) => {
            if (e) {
              console.log(e)
            } else {
              message.channel.send({
                embed: {
                  color: parseInt(colors.blue),
                  title: `Posted by ${message.author.username}`,
                  image: {
                    url: `attachment://${attachment.filename}`
                  }
                },
                files: [{ attachment: filepath, name: attachment.filename }]
              }).then(message.delete()).catch((e) => {
                handleError(bot, message, 'An error occurred while processing the request', 'Please try uploading your attachment again')
              })
            }
          })
        })
      }
    } else return
  }
}