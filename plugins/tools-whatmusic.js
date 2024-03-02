import fs from 'fs';
import acrcloud from 'acrcloud';
import axios from 'axios';

let acr = new acrcloud({
    host: 'identify-us-west-2.acrcloud.com',
    access_key: '402013e26582c7f23f3fbd4814100759',
    access_secret: 'tvRsiOyDPi8BcmlDUEbWueGG716zUASNJsQHKXjp'
});

let handler = async (m) => {
    let q = m.quoted ? m.quoted : m;
    m.react('⚡️');
    let mime = (q.msg || q).mimetype || '';
    if (/audio|video/.test(mime)) {
        let media = await q.download();
        let ext = mime.split('/')[1];
        fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media);
        let res = await acr.identify(fs.readFileSync(`./tmp/${m.sender}.${ext}`));
        let { code, msg } = res.status;
        if (code !== 0) throw msg;

        let txt = '';
        if (res.metadata && res.metadata.music && res.metadata.music.length > 0) {
            let { title, artists, album, genres, release_date, external_metadata } = res.metadata.music[0];
            let youtubeUrl = external_metadata && external_metadata.youtube && external_metadata.youtube.video_url ? external_metadata.youtube.video_url : '';
            let genre = genres !== undefined ? genres.map(v => v.name).join(', ') : 'NOT FOUND';

            txt = `
> 𝘙𝘌𝘚𝘜𝘓𝘛𝘈𝘋𝘖 𝘋𝘖 𝘉𝘈𝘕𝘊𝘖 𝘋𝘌 𝘋𝘈𝘋𝘖𝘚 📥

📀 *MÚSICA:* ${title}

👨‍🎤 *_ARTISTA:_* ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'NOT FOUND'}
💾 *_ÁLBUM:_* ${album.name || 'NOT FOUND'}
🌐 *_GÊNERO:_* ${genre}
📆 *DATA DE UPLOAD:* ${release_date || 'NOT FOUND'}

🔗 *YouTube:* ${youtubeUrl || '_Sem Retorno_'}
`.trim();

            if (youtubeUrl) {
                m.reply(txt);
            } else {
                txt += "\n *😞 Link do YouTube não encontrado*";
                m.reply(txt);
            }
        } else {
            txt = "*😞 Não consegui identificar a música, por favor use uma de melhor qualidade!*";
            m.reply(txt);
        }

        fs.unlinkSync(`./tmp/${m.sender}.${ext}`);
    } else {
        throw '*😉 Responda o áudio e vou descobrir a música para você!*';
    }
};

handler.help = ['shazam'];
handler.tags = ['tools', 'prime'];
handler.command = /^quemusica|shazam|whatmusic|find$/i;

export default handler;
