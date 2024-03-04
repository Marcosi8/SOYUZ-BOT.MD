import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  const apiKey = 'sua_chave_de_api';

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

    // Salvar a resposta como um arquivo binário
    const buffer = await response.buffer();
    const tempFilePath = 'generated_image.png';
    fs.writeFileSync(tempFilePath, buffer);

    // Enviar o arquivo como mensagem de mídia
    await conn.sendFile(m.chat, tempFilePath, 'imagem_gerada.png', '', m);

    // Remover o arquivo temporário após o envio
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Erro:', error);
    throw `*ERRO*: ${error.message}`;
  }
}

handler.command = ['dalle', 'genimg', 'imggen'];
export default handler;
