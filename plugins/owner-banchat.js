
let handler = async (m, { conn, isOwner, isAdmin, isROwner }) => {
    if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    m.reply(`✅ ${mssg.banChat}`)
}
handler.help = ['offbot']
handler.tags = ['owner', 'group']
handler.command = ['banchat', 'offbot', 'botoff'] 
handler.group = true
handler.admin = true

export default handler
 
