let handler = async (m, { conn, text }) => {
    conn.flags = conn.flags ? conn.flags : {}
    
    let id = m.chat
    if (id in conn.flags) return conn.reply(m.chat, `⚠️ ${mssg.gameOn}`, conn.flags[id][0])
    let flag = pickRandomFlag()
    conn.flags[id] = [
        await conn.sendFile(m.chat, flag.image, 'flag.png', `Adivinhe a bandeira deste país!`, m),
        flag,
        setTimeout(() => {
            if (conn.flags[id]) conn.reply(m.chat, `⏳ O tempo acabou! A bandeira era do ${flag.name}.`, conn.flags[id][0])
            delete conn.flags[id]
        }, 60000) // 60 segundos para adivinhar
    ]
}

handler.checkAnswer = async (m, { conn, text }) => {
    let id = m.chat
    if (m.chat == id && conn.flags[id]) {
        let answer = text.toLowerCase().replace(/[^\w\s]/gi, '') // Remover caracteres especiais
        let correctAnswer = conn.flags[id][1].name.toLowerCase().replace(/[^\w\s]/gi, '') // Remover caracteres especiais
        if (answer.trim() === correctAnswer.trim()) {
            conn.reply(m.chat, `✅ Parabéns! Você acertou! A bandeira era do ${conn.flags[id][1].name}.`, conn.flags[id][0])
            clearTimeout(conn.flags[id][2])
            delete conn.flags[id]
        } else {
            conn.reply(m.chat, `❌ Resposta incorreta. Tente novamente!`, conn.flags[id][0])
        }
    }
}

handler.help = ['adivinha']
handler.tags = ['game']
handler.command = ['adivinha', 'bandeira', 'guess', 'flag'] 

let flags = {
    brasil: { name: 'Brasil', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png' },
    estadosunidos: { name: 'Estados Unidos', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png' },
    canada: { name: 'Canadá', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/1280px-Flag_of_Canada_%28Pantone%29.svg.png' },
    india: { name: 'Índia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/1280px-Flag_of_India.svg.png' },
    china: { name: 'China', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1280px-Flag_of_the_People%27s_Republic_of_China.svg.png' },
    alemanha: { name: 'Alemanha', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png' },
    franca: { name: 'França', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png' },
    italia: { name: 'Itália', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png' },
    espanha: { name: 'Espanha', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png' },
    japon: { name: 'Japão', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1280px-Flag_of_Japan.svg.png' },
}

function pickRandomFlag() {
    let countries = Object.keys(flags)
    let randomCountry = countries[Math.floor(Math.random() * countries.length)]
    return flags[randomCountry]
}

handler.flags = flags

export default handler
