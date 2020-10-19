import 'dotenv/config'
import { client } from './modules/client'
import { upTimeStamp } from './modules/upTime'
import badWordsRegExp from 'badwords/regexp'
import vox from './modules/vox'
import { keywords } from './keywords'
import { handleCommand } from './lib/handleCommand'
import { connectOverlay } from './lib/overlayEventSource'
import { castVote } from './lib/vote'
import { logger } from './lib/logger'
import { includesWord } from './lib/includesWord'
import { getCommands } from './lib/getCommands'

upTimeStamp()

connectOverlay()

client.on('connected', (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  // vox('beep boop')
})

client.on('message', (target, context, msg, self) => {
  const message = msg.trim()
  if (self) { return } // Ignore messages from the bot

  // find all commands
  const commands = getCommands('!', message)

  // Handle casting votes
  if (message === '1' || message === '2') {
    castVote(context.username, parseInt(message))
  }

  // Handle Commands
  if (commands.length > 0) {
    commands.forEach(({ command, args }) => {
      handleCommand(command, args, target, context)
    })

  // Handle Messages
  } else if (message !== undefined) {
    // User is saying something
    const textMessage = message.replace(badWordsRegExp, '****')
    console.log(`${context.username}: ${textMessage}`)
    logger('chat_log', `${context.username}: ${textMessage}`)

    // pick up on keywords
    Object.keys(keywords).forEach((word) => {
      if (includesWord(message, word)) {
        const { text, say } = keywords[word]
        if (Array.isArray(text)) {
          const randomIndex = Math.floor(Math.random() * text.length)
          client.say(target, `@${context.username} ${text[randomIndex]}`)
        } else if (text !== undefined) {
          client.say(target, `@${context.username} ${text}`)
        }
        if (say !== undefined) vox(say)
      }
    })
  }
  // Handle Emoticons
})

client.connect()
