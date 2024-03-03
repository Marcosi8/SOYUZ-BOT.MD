import fetch from 'node-fetch';

// Banco de dados de bandeiras com emojis e nomes de países
const flagDatabase = {
    '🇧🇷': 'Brasil',
    '🇺🇸': 'Estados Unidos',
    '🇯🇵': 'Japão',
    // Adicione mais bandeiras conforme necessário
};

let flagsGame = {};

async function handler(m, { usedPrefix, command }) {
    let id = m.chat;

    if (m.text && !m.text.startsWith(usedPrefix + command)) return;

    if (id in flagsGame) {
        return m.reply(`⚠️ O jogo de bandeiras já está em andamento!`);
    }

    let randomFlagEmoji = getRandomFlagEmoji();
    let countryName = flagDatabase[randomFlagEmoji];
    if (!countryName) return m.reply(`❌ Não foi possível encontrar o país correspondente.`);
    
    flagsGame[id] = [
        await m.reply(`Qual é o país representado por esta bandeira?\n${randomFlagEmoji}`),
        countryName.toLowerCase()
    ];
}

async function handleAll(m) {
    let id = m.chat;
    if (!(id in flagsGame)) return;
    let answer = m.text.trim();
    let correctAnswer = flagsGame[id][1];
    if (!correctAnswer) return m.reply(`❌ Houve um erro interno. Tente novamente mais tarde.`);
    if (answer.toLowerCase() === correctAnswer) {
        m.reply(`✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer.toUpperCase()}* 🎉`);
    } else {
        m.reply(`❌ Resposta incorreta! Tente novamente.`);
    }
    delete flagsGame[id];
}

handler.help = ['bandeira'];
handler.tags = ['game'];
handler.command = ['bandeira', 'adivinha', 'guess'];

function getRandomFlagEmoji() {
    let emojis = Object.keys(flagDatabase);
    return emojis[Math.floor(Math.random() * emojis.length)];
}

export { handler, handleAll };
