
const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;

export async function before(m, {conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[this.user.jid] || {}
    const isLink = linkRegex.test(m.text);

    if (chat.antiLink && isLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return !0
        }
        await conn.reply(m.chat, `> *[❗️] LINK DETECTED 🔗*
            
*We do not allow unknown links in our group.*\n\n_Não permitimos links desconhecidos em nosso grupo,_ @${m.sender.split('@')[0]}. _O banimento é automático, contate um administrador se acha que foi um erro._ ${isBotAdmin ? '' : '\n\n⚠️ *Eu não sou um administrador do grupo, então eu não posso expulsá-lo!*'}`, null, { mentions: [m.sender] } )
        if (isBotAdmin && chat.antiLink) {
        	await conn.sendMessage(m.chat, { delete: m.key })
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } else if (!chat.antiLink) return //m.reply('🚫')
    }
    return !0
}
