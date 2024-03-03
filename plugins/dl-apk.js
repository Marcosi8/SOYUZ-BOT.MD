import { download } from 'aptoide-scraper';

let handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    if (['modapk', 'apk', 'app'].includes(command)) {
      if (!text) throw `*[❗] Forneça o nome do APK que você deseja baixar!*`;
      
      m.react(rwait);
      await conn.reply(m.chat, global.wait, m);
      
      let data = await download(text);

      if (data.size.replace(' MB', '') > 200) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito grande.*' }, { quoted: m });
      }

      if (data.size.includes('GB')) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito pesado.*' }, { quoted: m });
      }

      await conn.sendFile(
        m.chat,
        data.dllink,
        data.name + '.apk',
        `*Nome do APK:* ${data.name}\n*Tamanho:* ${data.size}\n*Versão:* ${data.version}\n*Ícone:* ${data.icon}`,
        m
      );
    }
    m.react(done);
  } catch {
    throw `*[🪩] Certifique-se de fornecer um nome/link válido.*`;
  }
};

handler.help = ['apk', 'app'];
handler.tags = ['dl', 'prime'];
handler.command = ['modapk', 'apk', 'app'];
export default handler;
