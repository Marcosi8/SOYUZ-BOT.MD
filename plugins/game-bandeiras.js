const fetch = require('node-fetch');

const flagsGame = {};

async function getFlag() {
    const response = await fetch('https://flagcdn.com/pt/codes.json');
    const data = await response.json();
    const countries = Object.keys(data);
    const randomCountryCode = countries[Math.floor(Math.random() * countries.length)];
    const flagUrl = `https://flagcdn.com/w320/${randomCountryCode.toLowerCase()}.png`;
    const countryName = data[randomCountryCode]?.name;
    return { flagUrl, countryCode: randomCountryCode, countryName };
}

async function handle(message, conn, usedPrefix, command) {
    let id = message.chatId || message.from;
    
    if (message.body && !message.body.startsWith(usedPrefix + command)) return;
    
    if (id in flagsGame) {
        await conn.reply(message.chatId, `⚠️ O jogo de bandeiras já está em andamento!`, message.id);
        return;
    }
    
    let { flagUrl, countryName } = await getFlag();
    flagsGame[id] = [await conn.sendFile(message.chatId, flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`), countryName];
}

async function handleAnswer(message, conn) {
    let id = message.chatId || message.from;
    
    if (!(id in flagsGame)) return;
    let answer = message.body.trim();
    let correctAnswer = flagsGame[id][1];
    
    if (!correctAnswer) {
        await conn.reply(message.chatId, `❌ Houve um erro interno. Tente novamente mais tarde.`, flagsGame[id][0]);
        return;
    }
    
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        await conn.reply(message.chatId, `✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`, flagsGame[id][0]);
    } else {
        await conn.reply(message.chatId, `❌ Resposta incorreta! Tente novamente.`, flagsGame[id][0]);
    }
    
    delete flagsGame[id];
}

module.exports = { 
    handle, 
    handleAnswer, 
    command: ['bandeira', 'adivinha', 'guess'], 
    tags: ['game'], 
    help: ['bandeira'] 
};
