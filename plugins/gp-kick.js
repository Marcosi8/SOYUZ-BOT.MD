
let handler = async (m, { conn, usedPrefix, command }) => {
	
if (!m.mentionedJid[0] && !m.quoted) return m.reply(`❗️ ${mssg.useCmd}\n\n*${usedPrefix + command}* @user`) 
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
if (conn.user.jid.includes(user)) return m.reply(`🤔 *Como vou banir a mim mesmo?*`)

await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
m.reply(`✅ ${mssg.kick}`) 

}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'k', 'expulsar', 'ban'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
