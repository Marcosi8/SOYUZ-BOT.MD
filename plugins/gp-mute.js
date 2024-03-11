export async function before(m, { conn, isAdmin, command }) {
    if (!m.isGroup || !isAdmin) return true;

    const chat = global.db.data.chats[m.chat];
    const mutedUsers = chat.mutedUsers || {};

    if (mutedUsers[m.sender] && !command) {
        await conn.deleteMessage(m.chat, m.key);
        return false;
    }

    return true;
}

handler.help = ['mute']
handler.tag = ['group']
handler.command = ['mute']

export default handler;
