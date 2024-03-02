
let war = global.maxwarn
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `❗️ ${mssg.noMention}\n\n📌 ${mssg.example}: ${usedPrefix + command} @user`
        if (conn.user.jid.includes(who)) return m.reply(`🚫 Você não pode usar no Bot.`)
        if (!(who in global.db.data.users)) throw `✳️ ${mssg.userDb}`
        let txt = text.replace('@' + who.split`@`[0], '').trim()
        let name = conn.getName(m.sender)
        let warn = global.db.data.users[who].warn
        if (warn < war) {
            global.db.data.users[who].warn += 1
            m.reply(`
⚠️ *${mssg.userWarn}* ⚠️

> *${mssg.admin}:* ${name}
> *${mssg.user}:* @${who.split`@`[0]}
> *${mssg.warns}:* ${warn + 1}/${war}
> *${mssg.with}:* ${txt}`, null, { mentions: [who] }) 
            m.reply(`
⚠️ *${mssg.warn.toUpperCase()}* ⚠️
${mssg.warnRec}

> *${mssg.warns}:* ${warn + 1}/${war} 
${mssg.wningUser(war)}`, who)
        } else if (warn == war) {
            global.db.data.users[who].warn = 0
            m.reply(`⛔ ${mssg.warnMaxU(war)}`)
            await time(3000)
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
            m.reply(`♻️ Você foi removido do grupo *${groupMetadata.subject}* porque passou do limite de aviso de *${war}* vezes`, who)
        }
}
handler.help = ['advertir @user']
handler.tags = ['group', 'prime']
handler.command = ['warn', 'avisar', 'advertir', 'advertencia'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
