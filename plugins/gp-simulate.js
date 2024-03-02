
let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {

  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) throw `✳️ Para usar este comando deve ativar a função welcome com\n\n *${usedPrefix}on* welcome`
  let te = `
  ┌─⊷ *EVENTOS*
  ▢ welcome
  ▢ bye
  ▢ promover
  ▢ rebaixar
  └───────────
  
  📌 Exemplo:
  
  *${usedPrefix + command}* welcome @user`

if (!event) return await m.reply(te) 

let mentions = text.replace(event, '').trimStart()
let who = mentions ? conn.parseMention(mentions) : []
let part = who.length ? who : [m.sender]
let act = false
m.reply(`✅ Simulando ${event}...`)
switch (event.toLowerCase()) {
        case 'add':
        case 'bemvindo':
        case 'invite':
        case 'welcome':
           act = 'add'
         break 
        case 'bye':
        case 'despedida':
        case 'leave':
        case 'remove':
         act = 'remove'
        break

        case 'promote':
        case 'promover':
          act = 'promote'
        break

        case 'demote':
        case 'rebaixar':
         act = 'demote'
        break

default:

throw te
}
if (act) return conn.participantsUpdate({
id: m.chat,
participants: part,
action: act
})
}
handler.help = ['simulate <event> @user']
handler.tags = ['group']
handler.command = ['simular', 'simulate'] 
handler.admin = true
handler.group = true

export default handler
