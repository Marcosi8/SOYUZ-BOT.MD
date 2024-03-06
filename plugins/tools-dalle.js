import { Configuration, OpenAIApi, OpenAIApiException } from 'openai';

// Configure a biblioteca com sua chave de API
const configuration = new Configuration({
  apiKey: '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'
});
const openai = new OpenAIApi(configuration);

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

    const response = await openai.images.create({
      prompt: text,
      apiKey: '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'
    });

    const imageUrl = response.data.url;
    await conn.sendFile(m.chat, imageUrl, 'image-dalle.jpg', '', m, 0, { thumbnail: Buffer.alloc(0) });
      
    m.react(done);
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.help = ['dalle <text>']
handler.tags = ['ia', 'prime']
handler.command = ['dalle', 'dall-e']

export default handler;
