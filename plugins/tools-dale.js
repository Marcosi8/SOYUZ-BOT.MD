import { Configuration, OpenAIApi, OpenAIApiException } from 'openai';
import fetch from 'node-fetch';

// Configure a biblioteca com sua chave de API
const configuration = new Configuration({
  apiKey: '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'
});
const openai = new OpenAIApi(configuration);

let handler = async (m, { text, conn }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🤔 *Exemplo:* !dalle Um astronauta na lama.`;
  }

  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  const rwait = '⏱️' // Defina rwait conforme necessário
  const done = '💬' // Defina done conforme necessário

  try {
    m.react(rwait)

    const response = await openai.images.create({
      prompt: text
    });

    const imageUrl = response.data.url;

    // Faça o download da imagem
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    // Envie a imagem no WhatsApp
    await conn.sendFile(m.chat, imageBuffer, 'image-dalle.jpg', '');

    m.react(done);
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.command = ['m']
handler.tags = ['m']
handler.help = ['dalle <texto>']
export default handler
