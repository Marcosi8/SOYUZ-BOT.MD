let handler = async (m, { conn, args, usedPrefix, command }) => {
    let isClose = { // Switch Case Like :v
        'aberto': 'not_announcement',
        'fechado': 'announcement',
        'open': 'not_announcement',
        'close': 'announcement',
    }[(args[0] || '')]
    if (isClose === undefined)

    return m.reply(`
🛡️ ${mssg.gpSetting}

*${usedPrefix + command} fechado*
*${usedPrefix + command} aberto*
*${usedPrefix + command} close*
*${usedPrefix + command} open*
`)
    await conn.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['abrir/fechar']
handler.tags = ['group']
handler.command = ['group', 'grupo'] 
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
