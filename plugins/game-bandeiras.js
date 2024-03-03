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
    
    let { countryCode, flagUrl, correctAnswer } = await getFlag;
    conn.flagsGame[id] = [
        await conn.sendFile(m.chat, flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`, m),
        correctAnswer
    ];
};

handler.help = ['bandeira'];
handler.tags = ['game'];
handler.command = ['bandeira', 'adivinha', 'guess'];

async function getFlag() {
    const response = await fetch('https://flagcdn.com/pt/codes.json');
    const data = await response.json();
    const countries = Object.keys(data);
    const randomCountryCode = countries[Math.floor(Math.random() * countries.length)];
    const flagUrl = `https://flagcdn.com/${randomCountryCode.toLowerCase()}.png`; // Corrigido aqui
    const correctAnswer = data[randomCountryCode];
    return { countryCode: randomCountryCode, flagUrl, correctAnswer };
}

export default handler;
