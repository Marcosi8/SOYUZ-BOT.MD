
let handler = async (m, { conn, text }) => {
    function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

    text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

    if(!text && !m.quoted) return m.reply(`*❏ RESETEAR A USUARIO*\n\nMencione o usuário, escreva o número ou responda à mensagem do usuário que deseja REINICIAR`)
    if(isNaN(number)) return m.reply(`❏ O número que você digitou não é válido`)

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
        delete global.global.db.data.users[user]
        conn.reply(m.chat, `*❏ USUARIO REINICIADO*\n\n✅ Registro de @${number} foi apagado da *BASE DE DADOS*`, null, { mentions: [user] })
    }
    
}
handler.help = ['reset-user']
handler.tags = ['owner']
handler.command = ['reset-user', 'resetuser', 'deluser'] 
handler.rowner = true

export default handler
