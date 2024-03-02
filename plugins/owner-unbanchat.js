//import db from '../lib/database.js'

let handler = async (m, { conn, isOwner, isAdmin, isROwner} ) => {
    if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    m.reply(`✅ ${mssg.unBanChat}`)   
}
handler.help = ['onbot']
handler.tags = ['owner', 'group']
handler.command = ['chaton', 'onbot', 'unbanchat'] 
handler.group = true
handler.admin = true

export default handler
