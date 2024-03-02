import { toDataURL } from 'qrcode'
let handler = async (m, { text, conn }) => {
if (!text) throw `❗️ *ESCREVA O TEXTO PARA CRIAR UM QRCODE*\n\n𝙒𝙍𝙄𝙏𝙀 𝘼 𝙏𝙀𝙓𝙏 𝙏𝙊 𝘾𝙊𝙉𝙑𝙀𝙍𝙏 𝙄𝙉𝙏𝙊 𝙌𝙍 𝘾𝙊𝘿𝙀`
conn.sendFile(m.chat, await toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', '*Seu qrcode personalizado 🗃*', m)
}
handler.help = ['code'].map(v => 'qr' + v + ' <text>')
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
export default handler
