let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    else who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    let user = global.db.data.users[who]
    if (!who) return m.reply(`Marque alguem para abraçar`)
   
   
let abrazo = await conn.reply(m.chat, `@${m.sender.split('@')[0]}  Deu um abraço cheio de carinho em @${who.split('@')[0]} `, m, { mentions: [who, m.sender] })

conn.sendMessage(m.chat, { react: { text: '🫂', key: abrazo.key }})
}
handler.help = ['abraço]
handler.tags = ['fun']
handler.command = /^abraço|abracar|abraçar$/i
export default handler
