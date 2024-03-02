
let handler = async (m, { conn, text, usedPrefix, command }) => {
    function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

    text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

    if(!text && !m.quoted) return m.reply(`✳️ ${mssg.noMention}`)
    if(isNaN(number)) return m.reply(`🚫 Este número não é valido.`)

      try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
    	let number = user.split('@')[0]
        let num = global.db.data.users[user]
        num.banned = false
        conn.reply(m.chat, `
✅ DESBANIDO!

───────────
@${number} ${mssg.unBanUser}`, m, { mentions: [user] })
    }
    
}
handler.help = ['unban @user']
handler.tags = ['owner']
handler.command = ['unban', 'unbanbot'] 
handler.rowner = true

export default handler
