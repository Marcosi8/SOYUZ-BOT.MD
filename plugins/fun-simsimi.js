
import fetch from 'node-fetch'
let handler = async (m, { conn, text, usedPrefix, command }) => {

 let lang = global.db.data.users[m.sender].language
  if (!text) throw `❗️ ${mssg.notext}`
  m.react('🗣️'), m.react('🌎'), m.react('🥸'), m.react('⚒️')
  try { 
  //let res = await fetch(`https://api.simsimi.vn/v2/?text=${text}&lc=${lang}`)
  let res = await fetch('https://api.simsimi.vn/v1/simtalk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `text=${encodeURIComponent(text)}&lc=${lang}&key=`
  })
  let json = await res.json()
  m.reply(json.message.replace('simsimi', `${botName}`).replace('Simsimi', `${botName}`).replace('sim simi', `${botName}`))
} catch {
  m.reply(`❗️ Por favor, tente novamente mais tarde A API SimSimi está inativa`)
}

}
handler.help = ['bot', 'simi']
handler.tags = ['ia']
handler.command = ['bot', 'simi'] 

export default handler
