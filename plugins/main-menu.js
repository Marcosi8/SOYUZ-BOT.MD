//import db from '../lib/database.js'
import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
//import { plugins } from '../lib/plugins.js'
let tags = {
  'main': 'SOBRE 🇧🇷',
  'prime': 'MAIS USADOS 🥳',
  'chat': 'CHAT ANÔNIMO 👻',
  'ia': '%readmore IA/CHATGPT 🤖',
  'group': 'GRUPO 👮‍',
  'econ': 'NIVEL & ECONOMIA 💵',
  'rg': 'REGISTRO 🗂',
  'sticker': 'STICKER 🎉',
  'img': 'IMAGEM 📷',
  'maker': 'MAKER 🌇',
  'prem': 'PREMIUM 🎖',
  'game': 'JOGOS 🎲',
  'On/Off': 'ATIVA/DESATIVA OPÇÕES 🔑', 
  'nime': 'ANIME 🥷',
  'rnime': 'ANIME REACT 👮‍♀️',
  'dl': 'BAIXAR 📥',
  'tools': 'TOOLS/UTILITARIOS ⚒️',
  'fun': 'FUN 🤡',
  'cmd': 'DATABASE 💾',
  //'nsfw': 'NSFW +18 🔞',
  //'ansfw': 'NSFW ANIME 🔞', 
  'owner': 'OWNER 👑', 
  'advanced': 'AVANÇADO 💻',
  //'bebot': 'BEBOT',
}
const defaultMenu = {
  before: `
  *Soyuzᴮᴼᵀ*
 
> 🌎 *Oi!* %name
> 📅 %week %date

> 🚀 *Usuários:* %totalreg 
> 🗂 *Registros:* %rtotalreg
> ♻️ *Tempo Ativo:* %muptime 
%sbot
> 💎 %diamond
> 🎰 *Nivel:* %role *XP:* %level

┗│ [❗️] *Versão:* 1.4.0

> *Lista de Comandos* ↙️
              %readmore

🪙 = *REQUER PREMIUM*
💎 = *REQUER DIAMANTES*
`.trimStart(),
  header: '> *%category*',
  body: '```%cmd``` %isdiamond %isPremium',
  footer: '└───────────\n',
  after: `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ᴍᴀʀᴄᴏsᴋᴢ_*
`,
}
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, diamond, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'pt'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        diamond: plugin.diamond,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `⭐ Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%isdiamond/g, menu.diamond ? '💎' : '')
                .replace(/%isPremium/g, menu.premium ? '🪙' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      sbot: (conn.user.jid == global.conn.user.jid ? '' : `\n▢ ✨ *Sub-Bot de:*\nwa.me/${global.conn.user.jid.split`@`[0]}`), 
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      level, diamond, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    let pp = marcosMenu.getRandom()

    /*conn.sendButton(m.chat, text.trim(), `▢ DyLux  ┃ ᴮᴼᵀ\n${mssg.ig}`, pp, [
      ['ꨄ︎ Apoyar', `${_p}donate`],
      ['⏍ Info', `${_p}botinfo`],
      ['⌬ Grupos', `${_p}gpdylux`]
    ], m, rpl)*/
    conn.sendFile(m.chat, pp, 'menu.jpg', text.trim(), m, null, rcanal)
  
   m.react('🇦🇿'), m.react('🇦🇼'), m.react('🇧🇸'), m.react('🇧🇩'), m.react('🇧🇪'), m.react('🇧🇷'), m.react('🇨🇦'), m.react('🇨🇳'), m.react('🇩🇰'), m.react('🇩🇪'), m.react('🇪🇸'), m.react('🇫🇷'), m.react('🇬🇧'), m.react('🇮🇳'), m.react('🇮🇹'), m.react('🇯🇵'), m.react('🇲🇽'), m.react('🇳🇱'), m.react('🇳🇴'), m.react('🇵🇱'), m.react('🇵🇹'), m.react('🇷🇺'), m.react('🇸🇪'), m.react('🇹🇷'), m.react('🇺🇸'), m.react('🇦🇷'), m.react('🇦🇹'), m.react('🇦🇺'), m.react('🇨🇭'), m.react('🇨🇿'), m.react('🇩🇿'), m.react('🇪🇬'), m.react('🇬🇷'), m.react('🇭🇷'), m.react('🇭🇺'), m.react('🇮🇱'), m.react('🇮🇩'), m.react('🇯🇲'), m.react('🇰🇷'), m.react('🇲🇾'), m.react('🇵🇰'), m.react('🇵🇭'), m.react('🇸🇬'), m.react('🇹🇭'), m.react('🇹🇳'), m.react('🇺🇦'), m.react('🇿🇦'), m.react('🇧🇴'), m.react('🇨🇷'), m.react('🇨🇺'), m.react('🇩🇴'), m.react('🇪🇨'), m.react('🇪🇪'), m.react('🇫🇮'), m.react('🇬🇹'), m.react('🇭🇳'), m.react('🇭🇰'), m.react('🇮🇪'), m.react('🇰🇪'), m.react('🇰🇼'), m.react('🇱🇻'), m.react('🇱🇧'), m.react('🇱🇰'), m.react('🇲🇦'), m.react('🇲🇰'), m.react('🇲🇲'), m.react('🇳🇬'), m.react('🇵🇪'), m.react('🇵🇳'), m.react('🇷🇸'), m.react('🇷🇴'), m.react('🇸🇦'), m.react('🇸🇰'), m.react('🇸🇮'), m.react('🇹🇼'), m.react('🇹🇿'), m.react('🇺🇾'), m.react('🇻🇦'), m.react('🇻🇪'), m.react('🇿🇼'), m.react('🇦🇴'), m.react('🇦🇱'), m.react('🇦🇩'), m.react('🇧🇾'), m.react('🇧🇭'), m.react('🇧🇧'), m.react('🇧🇿'), m.react('🇧🇲'), m.react('🇧🇬'), m.react('🇨🇲'), m.react('🇨🇫'), m.react('🇨🇩'), m.react('🇨🇮'), m.react('🇩🇯'), m.react('🇪🇹'), m.react('🇫🇯'), m.react('🇬🇲'), m.react('🇬🇭'), m.react('🇬🇮'), m.react('🇬🇳'), m.react('🇬🇼'), m.react('🇬🇾'), m.react('🇦🇫'), m.react('🇦🇱'), m.react('🇩🇿'), m.react('🇦🇸'), m.react('🇦🇩'), m.react('🇦🇴'), m.react('🇦🇶'), m.react('🇦🇷'), m.react('🇦🇲'), m.react('🇦🇼'), m.react('🇦🇺'), m.react('🇦🇹'), m.react('🇦🇿'), m.react('🇧🇭'), m.react('🇧🇩'), m.react('🇧🇧'), m.react('🇧🇾'), m.react('🇧🇪'), m.react('🇧🇿'), m.react('🇧🇯'), m.react('🇧🇲'), m.react('🇧🇹'), m.react('🇧🇴'), m.react('🇧🇦'), m.react('🇧🇼'), m.react('🇧🇷'), m.react('🇮🇴'), m.react('🇻🇬'), m.react('🇧🇳'), m.react('🇧🇬'), m.react('🇧🇫'), m.react('🇧🇮'), m.react('🇰🇭'), m.react('🇨🇲'), m.react('🇨🇦'), m.react('🇮🇨'), m.react('🇨🇻'), m.react('🇧🇶'), m.react('🇰🇾'), m.react('🇨🇫'), m.react('🇹🇩'), m.react('🇨🇱'), m.react('🇨🇳'), m.react('🇨🇴'), m.react('🇰🇲'), m.react('🇨🇬'), m.react('🇨🇩'), m.react('🇨🇰'), m.react('🇨🇺'), m.react('🇨🇾'), m.react('🇨🇿'), m.react('🇩🇰'), m.react('🇩🇯'), m.react('🇩🇲'), m.react('🇩🇴'), m.react('🇪🇨'), m.react('🇪🇬'), m.react('🇸🇻'), m.react('🇬🇶'), m.react('🇪🇷'), m.react('🇪🇪'), m.react('🇪🇹'), m.react('🇫🇰'), m.react('🇫🇴'), m.react('🇫🇯'), m.react('🇫🇮'), m.react('🇫🇷'), m.react('🇬🇫'), m.react('🇵🇫'), m.react('🇹🇫'), m.react('🇬🇦'), m.react('🇬🇲'), m.react('🇬🇪'), m.react('🇩🇪'), m.react('🇬🇭'), m.react('🇬🇮'), m.react('🇬🇷'), m.react('🇬🇱'), m.react('🇬🇩'), m.react('🇬🇹'), m.react('🇬🇳'), m.react('🇬🇼'), m.react('🇬🇾'), m.react('🇭🇹'), m.react('🇭🇳'), m.react('🇭🇰'), m.react('🇭🇺'), m.react('🇮🇸'), m.react('🇮🇳'), m.react('🇮🇩'), m.react('🇮🇷'), m.react('🇮🇶'), m.react('🇮🇪'), m.react('🇮🇲'), m.react('🇮🇱'), m.react('🇮🇹'), m.react('🇯🇲'), m.react('🇯🇵'), m.react('🇯🇪'), m.react('🇯🇴'), m.react('🇰🇿'), m.react('🇰🇪'), m.react('🇰🇮'), m.react('🇰🇭'), m.react('🇰🇮'), m.react('🇰🇵'), m.react('🇰🇷'), m.react('🇰🇼'), m.react('🇰🇬'), m.react('🇱🇦'), m.react('🇱🇻'), m.react('🇱🇧'), m.react('🇱🇸'), m.react('🇱🇷'), m.react('🇱🇾'), m.react('🇱🇮'), m.react('🇱🇹'), m.react('🇱🇺'), m.react('🇲🇴'), m.react('🇲🇬'), m.react('🇲🇼'), m.react('🇲🇾'), m.react('🇲🇻'), m.react('🇲🇱'), m.react('🇲🇹'), m.react('🇲🇭'), m.react('🇲🇶'), m.react('🇲🇷'), m.react('🇲🇺'), m.react('🇲🇽'), m.react('🇫🇲'), m.react('🇲🇩'), m.react('🇲🇨'), m.react('🇲🇳'), m.react('🇲🇪'), m.react('🇲🇦'), m.react('🇲🇿'), m.react('🇲🇲'), m.react('🇳🇦'), m.react('🇳🇷'), m.react('🇳🇵'), m.react('🇳🇱'), m.react('🇳🇨'), m.react('🇳🇿'), m.react('🇳🇮'), m.react('🇳🇪'), m.react('🇳🇬'), m.react('🇳🇺'), m.react('🇳🇫'), m.react('🇰🇵'), m.react('🇲🇵'), m.react('🇳🇴'), m.react('🇴🇲'), m.react('🇵🇰'), m.react('🇵🇼'), m.react('🇵🇸'), m.react('🇵🇦'), m.react('🇵🇬'), m.react('🇵🇾'), m.react('🇵🇪'), m.react('🇵🇭'), m.react('🇵🇳'), m.react('🇵🇱'), m.react('🇵🇹'), m.react('🇵🇷'), m.react('🇶🇦'), m.react('🇷🇪'), m.react('🇷🇴'), m.react('🇷🇺'), m.react('🇷🇼'), m.react('🇧🇱'), m.react('🇸🇭'), m.react('🇰🇳'), m.react('🇱🇨'), m.react('🇲🇫'), m.react('🇵🇲'), m.react('🇻🇨'), m.react('🇼🇸'), m.react('🇸🇲'), m.react('🇸🇹'), m.react('🇸🇦'), m.react('🇸🇳'), m.react('🇷🇸'), m.react('🇸🇨'), m.react('🇸🇱'), m.react('🇸🇬'), m.react('🇸🇽'), m.react('🇸🇰'), m.react('🇸🇮'), m.react('🇸🇧'), m.react('🇸🇴'), m.react('🇿🇦'), m.react('🇰🇷'), m.react('🇸🇸'), m.react('🇪🇸'), m.react('🇱🇰'), m.react('🇸🇩'), m.react ('🇸🇪'), m.react('🇨🇭'), m.react('🇸🇾'), m.react('🇹🇼'), m.react('🇹🇯'), m.react('🇹🇿'), m.react('🇹🇭'), m.react('🇹🇱'), m.react('🇹🇬'), m.react('🇹🇰'), m.react('🇹🇴'), m.react('🇹🇹'), m.react('🇹🇳'), m.react('🇹🇷'), m.react('🇹🇲'), m.react('🇹🇨'), m.react('🇹🇻'), m.react('🇺🇬'), m.react('🇺🇦'), m.react('🇦🇪'), m.react('🇬🇧'), m.react('🇺🇸'), m.react('🇺🇾'), m.react('🇺🇿'), m.react('🇻🇺'), m.react('🇻🇦'), m.react('🇻🇪'), m.react('🇻🇳'), m.react('🇼🇫'), m.react('🇪🇭'), m.react('🇾🇪'), m.react('🇿🇲'), m.react('🇿🇼') 
  } catch (e) {
    conn.reply(m.chat, '❌️ Erro ao exibir o menu', m)
    throw e
  }
}
//handler.help = ['help']
//handler.tags = ['main']
handler.command = ['menu', 'help', 'comandos', 'menus', 'lista'] 
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'd ', h, 'h ', m, 'm '].map(v => v.toString().padStart(2, 0)).join('')
}
