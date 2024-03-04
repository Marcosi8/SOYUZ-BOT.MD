import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🤔 *Exemplo:* ${usedPrefix + command} Descreva a imagem que deseja gerar!`;

  // Substitua 'lolkeysapi' pela sua chave de API, se necessário
  const apiKey = 'GataDios';

  await conn.sendMessage(m.chat, { text: '*⌛ ESPERE UN MOMENTO POR FAVOR...*' }, { quoted: m });

  try {
    // Substitua 'conn.getFile' pela função ou método correto para obter arquivos na sua conexão do bot
    const response = await fetch(`https://api.lolhuman.xyz/api/dall-e?apikey=${apiKey}&text=${encodeURIComponent(text)}`);
    const result = await response.json();

    // Substitua 'conn.sendMessage' pela função ou método correto para enviar mensagens na sua conexão do bot
    await conn.sendMessage(m.chat, { image: { url: result.data } }, { quoted: m });
  } catch {
    // Substitua esta mensagem de erro pela que você deseja enviar
    throw 'Ocorreu um erro ao processar a solicitação. Por favor, tente novamente mais tarde.';
  }
}

handler.help = ['dalle']
handler.command = ['dall-e', 'dalle', 'ia2', 'cimg', 'openai3', 'a-img', 'aimg', 'imagine'];
handler.tag = ['prime']
export default handler;
