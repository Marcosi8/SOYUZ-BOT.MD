
export async function all(m) {
    if (!m.isGroup)
        return
    let chats = global.db.data.chats[m.chat]
    if (!chats.expired)
        return !0
    if (+new Date() > chats.expired) {
        await this.reply(m.chat, `🔴 O tempo programado para o grupo expirou e minha remoção foi solicitada. Por favor, entre em contato com um administrador ou com (wa.me/558881647724) para mais informações. Obrigado. *${this.user.name}* esta com a remoção \n\nfinalizada`)
        await this.groupLeave(m.chat)
        chats.expired = null
    }
}
