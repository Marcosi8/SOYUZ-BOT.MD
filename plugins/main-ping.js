import speed from 'performance-now';
import { exec } from 'child_process';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let start = Date.now(); // Início da execução do comando
    let timestamp = speed();
    let latensi = speed() - timestamp;

    exec(`neofetch --stdout`, async (error, stdout, stderr) => {
        let child = stdout.toString("utf-8");
        let ssd = child.replace(/Memory:/, "Ram:");

        let end = Date.now(); // Fim da execução do comando
        let tempoAtivo;
        if (process.send) {
            process.send('uptime');
            tempoAtivo = await new Promise(resolve => {
                process.once('message', resolve);
                setTimeout(resolve, 1000);
            }) * 1000;
        }
        let muptime = clockString(tempoAtivo);

        m.reply(`🏓 *${mssg.ping}* : ${latensi.toFixed(4)} _ms_\nTempo Ativo: ${muptime}`);
    });
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, 'd ', h, 'h ', m, 'm ', s, 's '].map(v => v.toString().padStart(2, 0)).join('');
                 }
