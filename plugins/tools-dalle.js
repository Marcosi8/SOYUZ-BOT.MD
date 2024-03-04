import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  const apiKey = 'sk-NbvK4EiYGquxKRLfmdbd3aJQjFR3xNIkLKNbbZCHdek4z4Aj';

  await conn.sendMessage(m.chat, { text: '*⌛ ESPERE UM MOMENTO, POR FAVOR...*' }, { quoted: m });

  try {
    const formData = new FormData();
    formData.append('prompt', text);
    formData.append('mode', 'search');
    formData.append('search_prompt', 'dog');
    formData.append('output_format', 'webp');
    formData.append('image', fs.createReadStream('./husky-in-a-field.png'));

    const response = await axios.post(
      'https://api.stability.ai/v2alpha/generation/stable-image/inpaint',
      formData,
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          accept: 'image/*',
          ...formData.getHeaders() // inclui o cabeçalho necessário para o FormData
        },
      }
    );

    if (response.status === 200) {
      const tempFilePath = 'generated_image.webp';
      fs.writeFileSync(tempFilePath, Buffer.from(response.data));
      await conn.sendFile(m.chat, tempFilePath, 'generated_image.webp', '', m);
      fs.unlinkSync(tempFilePath);
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error('Erro:', error);
    throw `*ERRO*: ${error.message}`;
  }
}

handler.command = ['dalle', 'genimg', 'imggen'];
export default handler;
