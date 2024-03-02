
let handler = async (m, { conn, text, usedPrefix, command, args, participants, isOwner }) => {
	
  let time = global.db.data.users[m.sender].lastjoin + 86400000
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let delay = time => new Promise(res => setTimeout(res, time))
 
  let name = m.sender 
  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) throw `✨️ Envie o link do Grupo\n\n 📌 Exemplo:\n *${usedPrefix + command}* <linkwa> <dias>\n\n_o número são os dias que o bot estará no grupo_` 
  if (!code) throw `✨️ Link inválido`
  if (!args[1]) throw `📌 Falta o número de dias\n\n Exemplo:\n *${usedPrefix + command}* <linkwa> 2`
  if (isNaN(args[1])) throw `✨️ Este número representa os dias que o bot estará no grupo!`
  let owbot = global.owner[1] 
  m.reply(`😎 Espere 3 segundos, estou entrando no grupo`)
  await delay(3000)
  try {
  let res = await conn.groupAcceptInvite(code)
  let b = await conn.groupMetadata(res)
  let d = b.participants.map(v => v.id)
  let member = d.toString()
  let e = await d.filter(v => v.endsWith(owbot + '@s.whatsapp.net'))
  let nDays = 86400000 * args[1]  
  let now = new Date() * 1
  if (now < global.db.data.chats[res].expired) global.db.data.chats[res].expired += nDays
  else global.db.data.chats[res].expired = now + nDays
  if (e.length) await m.reply(`✅ Entrei no grupo \n\n> Info do grupo \n\n *Nome:* ${await conn.getName(res)}\n\nO bot sairá automáticamente depois de \n\n${msToDate(global.db.data.chats[res].expired - now)}`)
 
 if (e.length) await conn.reply(res, `🤠 Olá camaradas

@${owbot} é meu administrador. fale com ele em caso de duvidas.
fui enviado por *${m.name}*`, m, {
    mentions: d
     }).then(async () => {
     await delay(7000)
     }).then( async () => {
     await conn.reply(res, `agora vamos todos relaxar... use /menu para ver os comandos.🌹`, 0)
     await conn.reply(global.owner[1]+'@s.whatsapp.net', `≡ *CONVITE AO GRUPO*\n\n@${m.sender.split('@')[0]} Foi convidado por *${conn.user.name}* ao grupo\n\n*${await conn.getName(res)}*\n\n*ID* : ${res}\n\n📌 Link : ${args[0]}\n\nE o bot sairá automáticamente depois de \n\n${msToDate(global.db.data.chats[res].expired - now)}`, null, {mentions: [m.sender]})
     })
     if (!e.length) await conn.reply(global.owner[1]+'@s.whatsapp.net', `≡ *CONVITE AO GRUPO*\n\n@${m.sender.split('@')[0]} Foi convidado por *${conn.user.name}* ao grupo\n\n*${await conn.getName(res)}*\n\n*ID* : ${res}\n\n📌 Link : ${args[0]}\n\nE o bot sairá automáticamente depois de\n\n ${msToDate(global.db.data.chats[res].expired - now)}`, null, {mentions: [m.sender]})
     if (!e.length) await m.reply(`✅ O bot foi convidado para o grupo\n\n${await conn.getName(res)}\n\nE o bot sairá automáticamente depois de \n${msToDate(global.db.data.chats[res].expired - now)}`).then(async () => {
     let mes = `oi a todos 👋🏻
     
*${conn.user.name}* é um dos bots multidispositivo de WhatsApp construido com Node.js, *${conn.user.name}* Recém construido por *${m.name}*

para ver os comandos do bot escreva

*${usedPrefix}help*

@${conn.user.jid.split('@')[0]} sairá automaticamente depois de \n\n${msToDate(global.db.data.chats[res].expired - now)}`
  await conn.reply(res, mes, m, {
        mentions: d
         })
     })
    } catch (e) {
      conn.reply(global.owner[1]+'@s.whatsapp.net', e)
      throw `🚫 Desculpe, o bot não conseguiu entrar, veja se algo deu errado.`
      }
}
handler.help = ['entrar <chat.whatsapp.com> <dias>']
handler.tags = ['owner']
handler.command = ['join', 'entrar'] 

handler.owner = true

export default handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'd ', h, 'h ', m, 'm ', s, 's '].map(v => v.toString().padStart(2, 0)).join('')
}
