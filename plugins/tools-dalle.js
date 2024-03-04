import fetch from 'node-fetch';

const engineId = 'stable-diffusion-v1-6';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = 'sk-NbvK4EiYGquxKRLfmdbd3aJQjFR3xNIkLKNbbZCHdek4z4Aj'; // Substitua 'SUA_CHAVE_DE_API' pela sua chave de API

const generateImageFromText = async (prompt) => {
  try {
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON = await response.json();

    return responseJSON.artifacts.map((imageGroup, index) => {
      return imageGroup.map((image, i) => {
        return { base64: image.base64, filename: `v1_txt2img_${index}_${i}.png` };
      });
    });
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Erro ao gerar imagem: ${error}`);
  }
};

const handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🤔 *Exemplo:* ${usedPrefix + command} Fale sobre a música Mr blue sky!`;
  }

  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }

  const rwait = '⏱️'; // Defina rwait conforme necessário
  const done = '💬'; // Defina done conforme necessário
  
  try {
    m.react(rwait);
    const { key } = await conn.sendMessage(m.chat, {
      caption: '_*Buscando uma resposta*_...'
    }, {quoted: m});
    conn.sendPresenceUpdate('composing', m.chat);
    
    const images = await generateImageFromText(text);
    
    // Envia as imagens geradas de volta ao remetente
    images.forEach(async (imageGroup) => {
      imageGroup.forEach(async (image) => {
        const imgData = Buffer.from(image.base64, 'base64');
        await conn.sendMessage(m.chat, imgData, 'imageMessage', { filename: image.filename });
      });
    });
    
    m.react(done);
  } catch (error) {
    console.error('Error:', error);
    throw `*ERROR*: ${error.message}`; // Retorna a mensagem de erro específica
  }
};

handler.help = ['dalle <text>'];
handler.tags = ['ia', 'prime'];
handler.command = ['dalle', 'aiimg'];

export default handler;
