async function handler(m, { usedPrefix, command }) {
    command = command.toLowerCase()
    this.anonymous = this.anonymous ? this.anonymous : {}
    switch (command) {
        case 'next':
        case 'sair': {
            let room = Object.values(this.anonymous).find(room => room.check(m.sender))
            if (!room) return this.sendMessage(m.chat, { text: "[❗️] _*Você não está em um chat anônimo.*_"}, { quoted: m })
            m.reply("Você saiu do chat anônimo.")
            let other = room.other(m.sender) 
            if (other) await this.sendMessage(other, { text: "[❗️] *_Seu parceiro saiu do chat._*"}, { quoted: m })
        if (command === 'leave') break
delete this.anonymous[room.id]
break
        }
        case 'start': {
            if (Object.values(this.anonymous).find(room => room.check(m.sender))) return this.sendMessage(m.chat, { text: "🤔 _*Você já está em um chat anônimo. Digite: /sair para sair._*"}, { quoted: m })
            let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
            if (room) {
                await this.sendMessage(room.a, { text: "🥳 _*Um parceiro se juntou ao chat!*_"}, { quoted: m })
                room.b = m.sender
                room.state = 'CHATTING'
                await this.sendMessage(m.chat, { text: "🎉 *_Você foi conectado a um chat anônimo._*"}, { quoted: m })
            } else {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: m.sender,
                    b: '',
                    state: 'WAITING',
                    check: function (who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                    },
                }
                await this.sendMessage(m.chat, { text: "🚦 _*Você está na fila para um chat anônimo, aguarde até alguém se conectar!*_ "}, { quoted: m })
            }
            break
        }
        case 'anonimo': {
            let infoText = "👤 *O chat Anônimo funciona apenas no privado do Bot.*\n👥 Consiste em usar o número do Bot para falar com outras pessoas, ou seja, as duas pessoas estarão escrevendo ao mesmo tempo no chat privado do Bot, dessa forma, nenhuma das duas pessoas pode ver o número, foto, usuário, descrição, etc...🔒\n\n✨ Para usar essa função, siga estas etapas:\n⚡️ Digite o seguinte comando: */start*\n\n✅ Depois de fazer isso, basta ter paciência até que outra pessoa use o mesmo comando (/start) para serem vinculados pelo número do Bot e começar a interagir.\n✅ Se deixar o /start ativado, terá mais chances de interagir com a outra pessoa de forma anônima.\n\n🚪 Se desejar sair do chat anônimo, use o seguinte comando: */sair*\n\n✅ Dessa forma, você deixará de estar no chat anônimo do Bot.\n\n*❗ Não nos responsabilizamos pelo mal uso dessa função do Bot.*"
            await this.sendMessage(m.chat, { text: infoText }, { quoted: m })
            break
        }
    }
}
handler.help = ['anonimo', 'start', 'sair', 'next']
handler.tags = ['chat', 'prime']
handler.command = ['start', 'sair', 'next', 'anonimo']
handler.private = false
export default handler