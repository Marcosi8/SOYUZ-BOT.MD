import JavaScriptObfuscator from 'javascript-obfuscator'

let handler = async(m, { conn, text }) => {
if (!text) return m.reply(`*[❗️] ADICIONE UM CODIGO PARA CRIPTOGRAFAR*`) 
function obfuscateCode(code) {
  return JavaScriptObfuscator.obfuscate(code, { compact: false, controlFlowFlattening: true, deadCodeInjection: true, simplify: true, numbersToExpressions: true }).getObfuscatedCode();
}
let obfuscatedCode = await obfuscateCode(text);
conn.sendMessage(m.chat, {text: obfuscatedCode}, {quoted: m});
}
handler.help = ['criptografar']
handler.tag = ['prime', 'main']
handler.command = /^(ofuscar|criptografar)$/i
export default handler
