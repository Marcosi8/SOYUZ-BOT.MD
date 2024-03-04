import fetch from 'node-fetch';
import FormData from 'form-data';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  const apiKey = 'sua_chave_de_api';

  await conn.sendMessage(m.chat, { text: '*⌛ ESPERE UM MOMENTO, POR FAVOR...*' }, { quoted: m });

  try {
    const form = new FormData();
    form.append('prompt', text);
    form.append('mode', 'search');
    form.append('search_prompt', 'dog');
    form.append('output_format', 'webp');
    form.append('image', fs.createReadStream('./husky-in-a-field.png'));

    const response = await fetch('https://api.stability.ai/v2alpha/generation/stable-image/inpaint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      throw new Error(`Erro ao chamar a API: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.buffer();

    // Enviar a imagem como mensagem de mídia
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m });
  } catch (error) {
    console.error('Erro:', error);
    throw `*ERRO*: ${error.message}`;
  }
}

handler.command = ['dalle', 'genimg', 'imggen'];
export default handler;
