
let handler = async function (m, { conn, text, usedPrefix }) {
  
let m2 = `
> Lista de Opções

> *ADMIN*

 ${usedPrefix}captcha
 ${usedPrefix}welcome/bemvindo
 ${usedPrefix}setbye
 ${usedPrefix}antilink (com kick user)
 ${usedPrefix}antilink2 (sem kick user)
 ${usedPrefix}detect 
 ${usedPrefix}document
 ${usedPrefix}nsfw
 ${usedPrefix}autosticker
└───────────── 
> *USERS*

 ${usedPrefix}autolevelup
 ${usedPrefix}chatbot 
└─────────────
> *OWNER*

 ${usedPrefix}public
 ${usedPrefix}sopv
 ${usedPrefix}sogp
└─────────────
*📌 Exemplo:*
*${usedPrefix}on* antilink2
*${usedPrefix}off* antilink2
`
   let pp = './src/WhatsApp Video 2024-02-08 at 16.59.44.mp4' 
   /* conn.sendButton(m.chat, m2, mssg.ig, pp, [
      ['⏍ Info', `${usedPrefix}botinfo`],
      ['⌬ Grupos', `${usedPrefix}gpdylux`]
    ],m, rpyt)*/
    conn.sendFile(m.chat, pp, 'menu.jpg', m2, m, null, rpl)
   
}

handler.help = ['menu2']
handler.tags = ['main']
handler.command = ['menu2', 'setmenu'] 

export default handler
