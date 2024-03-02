import axios from 'axios'
import cheerio from 'cheerio'


let handler = async (m, { text }) => {
	if (!text) throw `📌 ${mssg.search('Wikipedia')}` 
	
    try {
	const link =  await axios.get(`https://pt.wikipedia.org/wiki/${text}`)
	const $ = cheerio.load(link.data)
	let wik = $('#firstHeading').text().trim()
	let resulw = $('#mw-content-text > div.mw-parser-output').find('p').text().trim()
	m.reply(`▢ *Wikipedia*

‣ ${resulw}`)
} catch (e) {
  m.reply(`⚠️ ${mssg.searchError}`)
}
}
handler.help = ['wikipedia']
handler.tags = ['tools', 'prime']
handler.command = ['wiki','wikipedia'] 


export default handler
