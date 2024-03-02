//import db from '../lib/database.js'

let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text
    m.reply(`✏️ ${mssg.welMsgOn}`)
  } else throw `🏷 ${mssg.welMsg}`
}
handler.help = ['setwelcome', 'bemvindo']
handler.tags = ['group']
handler.command = ['setwelcome', 'bemvindo', 'setbv'] 
handler.admin = true
handler.owner = false
handler.group = true

export default handler
