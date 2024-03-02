
let handler = async (m, { conn, text, usedPrefix, command }) => {

    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
     if (!teks) throw `📝 Quer escrever oque? Exemplo : *${usedPrefix + command}* Te odeio professor de matemática`
      m.react(rwait)
      let img = global.API('fgmods', '/api/maker/txt', { text: teks }, 'apikey')
      conn.sendFile(m.chat, img, 'img.png', `✅ Minha caligrafia é melhor! ✍🏻`, m)
      m.react(done)

  }
  handler.help = ['escrever']
  handler.tags = ['fun']
  handler.command = ['txt', 'escrever']
  
  export default handler
  
