import fetch from 'node-fetch';

// Insira sua chave da API do OpenAI DALL-E aqui
const OPENAI_API_KEY = 'SUA_CHAVE_API_OPENAI_DALLE';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🤔 *Exemplo:* ${usedPrefix + command} Um astronauta na lama.`;
  }

  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  const rwait = '⏱️'; // Defina rwait conforme necessário
  const done = '💬'; // Defina done conforme necessário

  try {
    m.react(rwait);
    const { key } = await conn.sendMessage(m.chat, {
      image: '',
      caption: '_*Criando uma imagem*_...'
    }, {quoted: m});
    conn.sendPresenceUpdate('composing', m.chat);
    
    // Verifique se a chave da API do OpenAI DALL-E está configurada
    if (!OPENAI_API_KEY) {
      throw 'Você não configurou a chave da API do OpenAI DALL-E.';
    }

    const apiUrl = 'https://api.openai.com/v1/images/generations';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'image-dalle-000',
        prompt: text,
        size: '256x256',
        response_format: 'url'
      })
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      const imageUrl = responseData.url;
      
      await conn.sendFile(m.chat, imageUrl, 'image-dalle.jpg', '', m, 0, { thumbnail: Buffer.alloc(0) });
      
      m.react(done);
    } else {
      throw new Error('Erro na solicitação para a API OpenAI DALL-E');
    }
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.help = ['dalle <text>']
handler.tags = ['ia', 'prime']
handler.command = ['dalle', 'dall-e']

export default handler;
