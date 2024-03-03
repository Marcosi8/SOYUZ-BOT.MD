import fetch from 'node-fetch';

let handler = async (m, { flagsGame, usedPrefix, command }) => {
    let te = `
🌍 *Adivinhe a Bandeira do País:* 
    
*📌 Exemplo de Uso:* _${usedPrefix+command}_
`
    let id = m.chat;
    
    flagsGame = flagsGame || {};
    
    if (m.text && !m.text.startsWith(usedPrefix+command)) return; // Ignorar mensagens que não são comandos
    
    if (id in flagsGame) {
        return m.reply(`⚠️ O jogo de bandeiras já está em andamento!`);
    }
    
    let { flagUrl, countryCode, countryName } = await getFlag();
    flagsGame[id] = [
        await m.sendFile(flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`),
        countryName
    ];
};

handler.all = async (m, { flagsGame }) => {
    let id = m.chat;
    flagsGame = flagsGame || {}; // Certificar-se de que flagsGame esteja inicializado
    if (!(id in flagsGame)) return;
    let answer = m.text.trim();
    let correctAnswer = flagsGame[id][1];
    if (!correctAnswer) return m.reply(`❌ Houve um erro interno. Tente novamente mais tarde.`);
    if (m.text && id in flagsGame) {
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            m.reply(`✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`);
        } else {
            m.reply(`❌ Resposta incorreta! Tente novamente.`);
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
