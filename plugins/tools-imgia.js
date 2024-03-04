import fetch from 'node-fetch';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;
  }

  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  const rwait = '⏱️'; // Defina rwait conforme necessário
  const done = '💬'; // Defina done conforme necessário
  
  try {
    m.react(rwait);
    conn.sendPresenceUpdate('composing', m.chat);
    const prompt = encodeURIComponent(text);

    const aiImgAPI = `https://api.vihangayt.me/tools/aiimg?q=${prompt}`;
    
    try {
      let response = await fetch(aiImgAPI);
      let data = await response.json();

      if (data.status === true && data.data && data.data.length > 0) {
        let imageUrls = data.data.slice(0, 4); // Obter os primeiros 4 URLs
        for (let imageUrl of imageUrls) {
          await conn.sendFile(m.chat, imageUrl, 'generated_image.jpg', `Imagem gerada com base em: ${text}`, m, false);
        }
        m.react(done);
      } else {
        throw new Error('No valid data in the API response');
      }
    } catch (error) {
      console.error('Error from the API:', error);
      throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
    }
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.help = ['aiimg <descrição>']
handler.tags = ['ia', 'prime']
handler.command = ['aiimg']

export default handler;
