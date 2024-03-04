import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  const apiKey = 'sk-NbvK4EiYGquxKRLfmdbd3aJQjFR3xNIkLKNbbZCHdek4z4Aj';

  await conn.sendMessage(m.chat, { text: '*⌛ ESPERE UM MOMENTO, POR FAVOR...*' }, { quoted: m });

  try {
    const response = await fetch(`https://platform.stability.ai/api/generate-image?text=${encodeURIComponent(text)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao chamar a API: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.image_url) {
      throw new Error('Não foi possível obter a URL da imagem gerada.');
    }

    await conn.sendMessage(m.chat, { image: { url: result.image_url } }, { quoted: m });
  } catch (error) {
    console.error('Erro:', error);
    throw `*ERRO*: ${error.message}`;
  }
}

handler.command = ['dalle', 'genimg', 'imggen'];
export default handler;
