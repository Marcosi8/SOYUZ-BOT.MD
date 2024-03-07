import { download, search } from 'aptoide-scraper';

let handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    if (command === 'modapk', 'apk', 'app') {
      if (!text) throw `*[❗] Forneça o nome do APK que você deseja baixar!*`;
      m.react(rwait)
      await conn.reply(m.chat, global.wait, m);
      let searchResults = await search(text);
      let apkData = await download(searchResults[0].id);

      let response = `
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃💫 Nome do Aplicativo: ${searchResults[0].name}: ${apkData.name}
┃📦 Pacote: ${apkData.package}
┃🕒 Última Atualização: ${apkData.lastup}
┃💪 Tamanho: ${apkData.size}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ Download concluído. 🚀🚀🚀`;

      if (apkData.size.replace(' MB', '') > 200) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito grande.*' }, { quoted: m });
      }

      if (apkData.size.includes('GB')) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] O arquivo é muito pesado.*' }, { quoted: m });
      }

      await conn.sendMessage(
        m.chat,
        { document: { url: apkData.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: apkData.name + '.apk', caption: response },
        { quoted: m }
      )
    }
    m.react(done)
  } catch {
    throw `*[🪩] Certifique-se de fornecer um nome/link válido.*`;
  }
};

handler.help = ['apk', 'app']
handler.tags = ['dl', 'prime']
handler.command = ['modapk', 'apk', 'app'];
export default handler;
