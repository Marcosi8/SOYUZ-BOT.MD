import fetch from 'node-fetch';
import flagsData from './src/flags.json';

let handler = async (m, { conn, flagsGame, usedPrefix, command }) => {
    let te = `
🌍 *Adivinhe a Bandeira do País:* 
    
*📌 Exemplo de Uso:* _${usedPrefix+command}_
`
    let id = m.chat;
    
    flagsGame = flagsGame || {};
    
    if (m.text && !m.text.startsWith(usedPrefix+command)) return; // Ignorar mensagens que não são comandos
    
    if (id in flagsGame) {
        return conn.reply(m.chat, `⚠️ O jogo de bandeiras já está em andamento!`);
    }
    
    let { flagUrl, countryCode, countryName } = await getFlag();
    flagsGame[id] = [
        await conn.sendFile(m.chat, flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`),
        countryName
    ];
};

handler.all = async (m, { conn, flagsGame, usedPrefix }) => {
    let id = m.chat;
    flagsGame = flagsGame || {}; // Certificar-se de que flagsGame esteja inicializado
    if (!(id in flagsGame)) return;
    let answer = m.text.trim();
    let correctAnswer = flagsGame[id][1];
    if (!correctAnswer) return conn.reply(m.chat, `❌ Houve um erro interno. Tente novamente mais tarde.`);
    if (m.text && id in flagsGame) {
        if (answer.toLowerCase() === flagsData[correctAnswer.toLowerCase()].toLowerCase()) {
            conn.reply(m.chat, `✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`);
        } else {
            conn.reply(m.chat, `❌ Resposta incorreta! Tente novamente. Dica: use ${usedPrefix+command} para tentar novamente.`);
        }
        delete flagsGame[id];
    }
};

handler.help = ['bandeira'];
handler.tags = ['game'];
handler.command = ['bandeira', 'adivinha', 'guess'];

async function getFlag() {
    const response = await fetch('https://flagcdn.com/pt/codes.json');
    const data = await response.json();
    const countries = Object.keys(data);
    const randomCountryCode = countries[Math.floor(Math.random() * countries.length)];
    const flagUrl = `https://flagcdn.com/w320/${randomCountryCode.toLowerCase()}.png`;
    const countryName = data[randomCountryCode]?.name;
    return { flagUrl, countryCode: randomCountryCode, countryName };
}

export default handler;
