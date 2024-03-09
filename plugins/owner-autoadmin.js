let handler = async (m, { conn, isAdmin }) => {
  if (isAdmin) throw `*O proprietário já é adm!*`
  await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote")
}
handler.command = /^admin|adm|autoadmin$/i
handler.rowner = true
handler.botAdmin = true
export default handler
