const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !1;

    let chat = global.db.data.chats[m.chat];
    let bot = global.db.data.settings[this.user.jid] || {};
    const isLink = linkRegex.test(m.text);

    if (m.text.startsWith('antilink2') && isAdmin) {
        chat.antiLink2 = !chat.antiLink2;
        conn.reply(m.chat, `Anti-link 2 agora está ${chat.antiLink2 ? 'ativado' : 'desativado'}.`, m)
        return !0;
    }

    if (chat.antiLink2 && isLink && !isAdmin) {
        await conn.reply(m.chat, `> *[❗️] LINK DETECTED 🔗*
            
*We do not allow unknown links in our group.*\n\n_Não permitimos links desconhecidos em nosso grupo,_ @${m.sender.split('@')[0]}.\n\n ⚠️ *Antilink2 ativo, não é passível de banimento. Ative o antilink para banir.* ${isBotAdmin ? '' : '\n\n⚠️ *Eu não sou um administrador do grupo, então eu não posso excluir o link!*'}`, null, { mentions: [m.sender] });
        await conn.sendMessage(m.chat, { delete: m.key });
        return !1;
    }

    return !0;
}
