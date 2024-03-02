let handler = async (m, { conn, text, usedPrefix, command }) => {

let time = global.db.data.users[m.sender].lastrob + 720000
if (new Date - global.db.data.users[m.sender].lastrob < 720000) throw `*⏱️ ESPERE* ${msToTime(time - new Date())}\n*NÃO USE ESTE COMANDO COMO SPAMMER, 1 USO POR VEZ.*`
let [nomor, pesan, jumlah] = text.split('+')
if (!nomor) throw `*DIGITE O NÚMERO QUE DESEJA ENVIAR SPAM* \n*🎰 ${usedPrefix + command} numero+texto+quantidade*\n*EXEMPLO* \n*🎰 ${usedPrefix + command} 999999999999 + marco+10*\n\n 𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙏𝙊 𝘽𝙀 𝙎𝙋𝘼𝙈𝙀𝘿\n*🎰 ${usedPrefix + command} number + text+amount*\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*🎰 ${usedPrefix + command} 999999999999 + Hi!!+35*`
if (!pesan) throw `*DIGITE O NÚMERO QUE DESEJA ENVIAR SPAM* \n*🎰 ${usedPrefix + command} numero+texto+quantidade*\n*EXEMPLO* \n*🎰 ${usedPrefix + command} 999999999999 + marco+10*\n\n 𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙏𝙊 𝘽𝙀 𝙎𝙋𝘼𝙈𝙀𝘿\n*🎰 ${usedPrefix + command} number + text+amount*\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*🎰 ${usedPrefix + command} 999999999999 + Hi!!+35*`
if (jumlah && isNaN(jumlah)) throw `*QUANTAS MENSAGENS EMVIAR?* \n*🎰 ${usedPrefix + command} numero+texto+quantidade*\n*EXEMPLO* \n*🎰 ${usedPrefix + command} 999999999999 + marco+10*\n\n 𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙏𝙊 𝘽𝙀 𝙎𝙋𝘼𝙈𝙀𝘿\n*🎰 ${usedPrefix + command} number + text+amount*\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*🎰 ${usedPrefix + command} 999999999999 + Hi!!+35*`
await delay(5000)
let fixedNumber = nomor.replace(/[-+<>@]/g, '').replace(/ +/g, '').replace(/^[0]/g, '62') + '@s.whatsapp.net'
await delay(5000)
let fixedJumlah = jumlah ? jumlah * 1 : 10
if (fixedJumlah > 10) throw `❗️ _MÁXIMO DE *10* MENSAGENS PARA FAZER UM SPAM_ \n\n𝙈𝙄𝙉𝙄𝙈𝙐𝙈 *10* 𝙈𝙀𝙎𝙎𝘼𝙂𝙀𝙎 𝙏𝙊 𝙎𝙋𝘼𝙈`
await delay(5000)
await m.reply(`*SPAM ENVIADO PARA* ${nomor} *QUANTIDADE:* ${fixedJumlah}\n\n𝙏𝙃𝙀 𝙎𝙋𝘼𝙈 𝙒𝘼𝙎 𝙎𝙀𝙉𝙏 *${nomor}* 𝙏𝙄𝙈𝙀𝙎 𝙏𝙊 ${fixedJumlah}`)
await delay(5000)
for (let i = fixedJumlah; i > 1; i--) {
await delay(5000)
if (i !== 0) conn.reply(fixedNumber, pesan.trim(), m)
}
global.db.data.users[m.sender].lastrob = new Date * 1
}
handler.help = ['spam']
handler.tags = ['prime']
handler.command = ['spamar', 'spam'] 
export default handler 
const delay = time => new Promise(res => setTimeout(res, time))

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds
return hours + " Hora(s) " + minutes + " Minuto(s)"}
