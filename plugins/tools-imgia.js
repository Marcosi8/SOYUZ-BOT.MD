import fetch from 'node-fetch';

const engineId = 'stable-diffusion-v1-6';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = 'sk-NbvK4EiYGquxKRLfmdbd3aJQjFR3xNIkLKNbbZCHdek4z4Aj'; // Sua chave de API

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

const handler = async (message) => {
  const { body, quotedMsg } = message;
  const command = body.toLowerCase();

  if (command.startsWith('!gerarimagem')) { // Comando para gerar imagem
    try {
      let prompt = body.slice(12).trim(); // Remova o comando "!gerarimagem" do prompt
      if (!prompt && quotedMsg && quotedMsg.type === 'chat') {
        prompt = quotedMsg.body; // Use a mensagem citada como prompt, se disponível
      }
      
      if (!prompt) {
        throw new Error('É necessário fornecer um prompt para gerar a imagem.');
      }

      const images = await generateImageFromText(prompt);
      return images;
    } catch (error) {
      console.error('Error handling command:', error);
      throw new Error(`Erro ao processar comando: ${error}`);
    }
  }
};

handler.help = ['!gerarimagem <descrição>']; // Ajuda do comando
handler.tags = ['ia', 'gerar']; // Tags relacionadas ao comando
handler.command = ['gerarimagem']; // Comando para acionar o manipulador

export default handler;
