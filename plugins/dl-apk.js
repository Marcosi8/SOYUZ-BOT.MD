import * as aptoideScraper from 'aptoide-scraper';

let handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    if (command === 'modapk' || command === 'apk' || command === 'app') {
      if (!text) throw `*[❗] Forneça o nome do APK que você deseja baixar!*`;
      m.react(rwait);
      await conn.reply(m.chat, global.wait, m);

      let data = await aptoideScraper.download(text);
      let info = await aptoideScraper.appInfo(text);

      if (data.size.replace(' MB', '') > 200) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito grande.*' }, { quoted: m });
      }

      if (data.size.includes('GB')) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito pesado.*' }, { quoted: m });
      }

      await conn.sendMessage(
        m.chat,
        {
          document: { url: data.dllink },
          mimetype: 'application/vnd.android.package-archive',
          fileName: data.name + '.apk',
          caption: `*Nome do APK:* ${info.name}\n*Pacote:* ${info.package}\n*Versão:* ${info.version}\n*Ícone:* ${info.icon}`
        },
        { quoted: m }
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
