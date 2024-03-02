import yts from 'yt-search'
import fg from 'api-dylux'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
let limit = 320
let handler = async (m, { conn, text, args, isPrems, isOwner, usedPrefix, command }) => {
  
    if (!text) throw `🤔 Você quer ouvir que música? ${mssg.example}: *${usedPrefix + command}* don't stop me now, queen`
  let chat = global.db.data.chats[m.chat]
  let res = await yts(text)
  //let vid = res.all.find(video => video.seconds < 3600)
  let vid = res.videos[0]
  if (!vid) throw `🚫 Vídeo/Audio não encontrado`
  let isVideo = /vid$/.test(command)
  m.react('💿') 
  
  let play = `
> *YT MUSIC*
┌──────────────
▢ 🎧 *${mssg.title}:* ${vid.title}
▢ 📆 *${mssg.aploud}:* ${vid.ago}
▢ ⏱️ *${mssg.duration}:* ${vid.timestamp}
▢ ♻️ *${mssg.views}:* ${vid.views.toLocaleString()}
└──────────────

_Enviando..._` 
conn.sendFile(m.chat, vid.thumbnail, 'play', play, m, null, rcanal)
  
  let q = isVideo ? '360p' : '128kbps' 
try {
  let yt = await (isVideo ? fg.ytv : fg.yta)(vid.url, q)
  let { title, dl_url, quality, size, sizeB } = yt
  let isLimit = limit * 1024 < sizeB 

     await conn.loadingMsg(m.chat, '📥 Baixando', ` ${isLimit ? `≡  *YTDL*\n\n▢ *⚖️${mssg.size}*: ${size}\n▢ *🎞️${mssg.quality}*: ${quality}\n\n▢ _${mssg.limitdl}_ *+${limit} MB*` : '🎉 Download Completo!' }`, ["▬▭▭▭▭▭", "▬▬▭▭▭▭", "▬▬▬▭▭▭", "▬▬▬▬▭▭", "▬▬▬▬▬▭", "▬▬▬▬▬▬"], m)
     
	  if(!isLimit) conn.sendFile(m.chat, dl_url, title + '.mp' + (3 + /vid$/.test(command)), `
> 💿 *MP3*
_Use /song para ouvir a música diretamente no WhatsApp!_
 
▢ *🎞️Qualidade* : ${quality}
▢ *⚖️Tamanho* : ${size}
`.trim(), m, false, { mimetype: isVideo ? '' : 'audio/mpeg', asDocument: chat.useDocument })
		m.react(done) 
  } catch {
  try {
//  let q = isVideo ? '360p' : '128kbps' 
  let yt = await (isVideo ? fg.ytmp4 : fg.ytmp3)(vid.url, q)
  let { title, dl_url, quality, size, sizeB } = yt
  let isLimit = limit * 1024 < sizeB 

     await conn.loadingMsg(m.chat, '📥 baixando', ` ${isLimit ? `≡  *YTDL*\n\n▢ *⚖️${mssg.size}*: ${size}\n▢ *🎞️${mssg.quality}*: ${quality}\n\n▢ _${mssg.limitdl}_ *+${limit} MB*` : '🎉 Download Completo!' }`, ["▬▭▭▭▭▭", "▬▬▭▭▭▭", "▬▬▬▭▭▭", "▬▬▬▬▭▭", "▬▬▬▬▬▭", "▬▬▬▬▬▬"], m)
	  if(!isLimit) conn.sendFile(m.chat, dl_url, title + '.mp' + (3 + /2$/.test(command)), `
 > *YTDL 2*
  
*📌${mssg.title}* : ${title}
*🎞️${mssg.quality}* : ${quality}
*⚖️${mssg.size}* : ${size}
`.trim(), m, false, { mimetype: isVideo ? '' : 'audio/mpeg', asDocument: chat.useDocument })
		m.react(done) 
		
		 } catch (error) {
        m.reply(`🚫 ${mssg.error}`)
    }
}

}
handler.help = ['song']
handler.tags = ['prime', 'dl']
handler.command = ['musica', 'play2', 'song', 'playmp3']

export default handler
