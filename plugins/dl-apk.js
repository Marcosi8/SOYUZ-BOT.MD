import * as aptoideScraper from 'aptoide-scraper';

let handler = async (m, { conn, command, text }) => {
  try {
    let appName = text.trim(); // Capturar o nome do aplicativo sem espaços extras

    if (!appName) throw `*[❗] Forneça o nome do APK que você deseja baixar!*`;

    m.react(rwait);
    await conn.reply(m.chat, global.wait, m);

    let data = await aptoideScraper.download(appName);
    let info = await aptoideScraper.appInfo(appName);

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
    
    m.react(done);
  } catch {
    throw `*[🪩] Certifique-se de fornecer um nome/link válido.*`;
  }
};

handler.help = ['apk', 'app'];
handler.tags = ['dl', 'prime'];
handler.command = ['modapk', 'apk', 'app'];
export default handler;
