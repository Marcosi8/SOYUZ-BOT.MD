import fetch from 'node-fetch';

let flagsGame = {}; // Variável externa para armazenar o estado do jogo

async function handler(m, { usedPrefix, command }) {
    let id = m.chat;

    if (m.text && !m.text.startsWith(usedPrefix + command)) return; // Ignorar mensagens que não são comandos

    if (id in flagsGame) {
        return m.reply(`⚠️ O jogo de bandeiras já está em andamento!`);
    }

    let { flagUrl, countryCode, countryName } = await getFlag();
    flagsGame[id] = [
        await m.reply(`🚩 Qual é o país desta bandeira?`),
        countryName
    ];
}

async function handleAll(m) {
    let id = m.chat;
    if (!(id in flagsGame)) return;
    let answer = m.text.trim();
    let correctAnswer = flagsGame[id][1];
    if (!correctAnswer) return m.reply(`❌ Houve um erro interno. Tente novamente mais tarde.`);
    if (answer === correctAnswer) {
        m.reply(`✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`);
    } else {
        m.reply(`❌ Resposta incorreta! Tente novamente.`);
    }
    delete flagsGame[id];
}

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

export { handler, handleAll };
