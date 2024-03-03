import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    let te = `
🌍 *Adivinhe a Bandeira do País:* 
    
*📌 Exemplo de Uso:* _${usedPrefix+command}_
`
    let id = m.chat;
    
    conn.flagsGame = conn.flagsGame || {};
    
    if (id in conn.flagsGame) {
        return conn.reply(m.chat, `⚠️ O jogo de bandeiras já está em andamento!`, conn.flagsGame[id][0]);
    }
    
    let { countryCode, flagUrl, correctAnswer } = await getFlag();
    conn.flagsGame[id] = [
        await conn.sendFile(m.chat, flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`, m),
        correctAnswer.toLowerCase()
    ];
};

handler.all = async (m, { conn }) => {
    let id = m.chat;
    if (!conn.flagsGame || !(id in conn.flagsGame)) return;
    let answer = m.text.trim();
    let correctAnswer = conn.flagsGame[id][1];
    if (answer.toLowerCase() !== correctAnswer) return conn.reply(m.chat, `❌ Resposta incorreta! Tente novamente.`, conn.flagsGame[id][0]);
    conn.reply(m.chat, `✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`, conn.flagsGame[id][0]);
    delete conn.flagsGame[id];
};

handler.help = ['bandeira'];
handler.tags = ['game'];
handler.command = ['bandeira', 'adivinha', 'guess'];

async function getFlag() {
    let data, randomCountryCode, flagUrl, correctAnswer;
    do {
        const response = await fetch('https://flagcdn.com/pt/codes.json');
        data = await response.json();
        const countries = Object.keys(data);
        randomCountryCode = countries[Math.floor(Math.random() * countries.length)];
        flagUrl = `https://flagcdn.com/w320/${randomCountryCode.toLowerCase()}.png`;
        correctAnswer = data[randomCountryCode]?.name?.toLowerCase();
    } while (!correctAnswer);
    return { countryCode: randomCountryCode, flagUrl, correctAnswer };
}

export default handler;
