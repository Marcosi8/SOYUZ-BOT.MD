import speed from 'performance-now';
import { spawn, exec, execSync } from 'child_process';
import moment from 'moment-timezone';

let handler = async (m, { conn }) => {
    let timestamp = speed();
    let latensi = speed() - timestamp;
    let start = Date.now(); // Início da execução do comando

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

        // Horário e local do servidor
        let serverInfo = `💻 \`\`\`Servidor:\`\`\`\n\`\`\`[ ${Intl.DateTimeFormat().resolvedOptions().timeZone} ]\n${moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY HH:mm:ss')}\`\`\``;

        m.reply(`\`\`\`Velocidade: ${latensi.toFixed(4)} ms\`\`\`\n\`\`\`Uptime: ${muptime}\`\`\`\n\n${serverInfo}`);
        m.react('🏓')
    });
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed', 'teste']

export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
}
