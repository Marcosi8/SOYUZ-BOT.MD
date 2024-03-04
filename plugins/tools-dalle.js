import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  const apiKey = 'sk-NbvK4EiYGquxKRLfmdbd3aJQjFR3xNIkLKNbbZCHdek4z4Aj';

  await conn.sendMessage(m.chat, { text: '*⌛ ESPERE UM MOMENTO, POR FAVOR...*' }, { quoted: m });

  try {
    const response = await fetch(`https://platform.stability.ai/api/generate-image?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao chamar a API: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.buffer();

    // Salvar a imagem temporariamente
    const tempFilePath = 'temp_image.tmp';
    fs.writeFileSync(tempFilePath, buffer);

    // Enviar a imagem como mensagem de mídia
    await conn.sendFile(m.chat, tempFilePath, 'generated_image.png', '', m);

    // Remover o arquivo temporário após o envio
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Erro:', error);
    throw `*ERRO*: ${error.message}`;
  }
}

handler.command = ['dalle', 'genimg', 'imggen'];
export default handler;
