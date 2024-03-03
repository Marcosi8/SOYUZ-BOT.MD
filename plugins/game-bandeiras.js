import fetch from 'node-fetch';

function handlerWrapper(conn) {
    let flagsGame = {};

    async function handler(m, { usedPrefix, command }) {
        let te = `
    🌍 *Adivinhe a Bandeira do País:* 
    
    *📌 Exemplo de Uso:* _${usedPrefix+command}_
    `
        let id = m.chat;
        
        if (m.text && !m.text.startsWith(usedPrefix+command)) return; // Ignorar mensagens que não são comandos
        
        if (id in flagsGame) {
            return conn.reply(m.chat, `⚠️ O jogo de bandeiras já está em andamento!`, flagsGame[id][0]);
        }
        
        let { flagUrl, countryCode, countryName } = await getFlag();
        flagsGame[id] = [
            await conn.sendFile(m.chat, flagUrl, 'flag.png', `🚩 Qual é o país desta bandeira?`, m),
            countryName
        ];
    }

    async function handleAll(m) {
        let id = m.chat;
        if (!(id in flagsGame)) return;
        let answer = m.text.trim();
        let correctAnswer = flagsGame[id][1];
        if (!correctAnswer) return conn.reply(m.chat, `❌ Houve um erro interno. Tente novamente mais tarde.`, flagsGame[id][0]);
        if (answer === correctAnswer) {
            conn.reply(m.chat, `✅ Parabéns! Você acertou. O país da bandeira é *${correctAnswer}* 🎉`, flagsGame[id][0]);
        } else {
            conn.reply(m.chat, `❌ Resposta incorreta! Tente novamente.`, flagsGame[id][0]);
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

    return { handler, handleAll };
}

export default handlerWrapper;
