import db from '../lib/database.js' //Configurado para americana latina, importante saber que todos os números que estão aqui serão banidos de seu grupo.
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin} ) {
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"
}
if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
if (isBotAdmin && chat.antifake) {
let texto = `*[❗️] O NÚMERO: @${m.sender.split`@`[0]} NÃO ESTÁ PERMITIDO NO GRUPO.*\n\n*O ANTI-FAKE FOI LIGADO!*\n\n_Use /off antifake para desabilitar esta função._`

if (m.sender.startsWith('1' || '1')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('65' || '65')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('92' || '92')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('93' || '93')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('94' || '94')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('7' || '7')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('49' || '49')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('26' || '26')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('91' || '91')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('48' || '48')) {
global.db.data.users[m.sender].block = true
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')} 
}}
export default handler
