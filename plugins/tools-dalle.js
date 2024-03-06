import { Configuration, OpenAIApi, OpenAIApiException } from 'openai';
import fetch from 'node-fetch';
import fs from 'fs';

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

    // Faça o download da imagem para um arquivo local temporário
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    const tempImagePath = 'image-dalle.jpg';
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Envie o arquivo local temporário
    await conn.sendFile(m.chat, {file: tempImagePath, mimetype: 'image/jpeg', filename: 'image-dalle.jpg'});

    // Remova o arquivo temporário
    fs.unlinkSync(tempImagePath);

    m.react(done);
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.help = ['dalle <text>']
handler.tags = ['ia', 'prime']
handler.command = ['dalle', 'dall-e']

export default handler
