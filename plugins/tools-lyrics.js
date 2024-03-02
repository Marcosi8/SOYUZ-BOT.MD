
import fg from 'api-dylux'
let handler = async (m, {conn, text }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
  m.react('❤️‍🔥');
if (!teks) throw `🫠 _De que música você quer a letra?_`
   try {
 let res = await fg.lyrics(text);
 let mes = `> *${res.title}* 
> *${res.artist}*

${res.lyrics}`;
    conn.sendFile(m.chat, res.thumb, 'img.png', mes, m);
} catch (e) {
	m.react(error)
} 

}
handler.help = ['letra']
handler.tags = ['tools', 'prime']
handler.command = ['letra', 'lyrics', 'letras'] 

export default handler
