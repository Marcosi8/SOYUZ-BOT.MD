 import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

/**
 * @type {import('@whiskeysockets/baileys')}
 */
const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))
 
/**
 * Handle messages upsert
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.coin = 0
        m.diamond = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.coin))
                    user.coin = 0
                if (!isNumber(user.diamond))
                    user.diamond = 20
                if (!isNumber(user.bank))
                    user.bank = 0
                if (!isNumber(user.lastclaim))
                    user.lastclaim = 0
                if (!('registered' in user))
                    user.registered = false
                    //-- user registered 
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name
                    if (!isNumber(user.age))
                        user.age = -1
                    if (!isNumber(user.regTime))
                        user.regTime = -1
                }
                //--user number
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!isNumber(user.warn))
                    user.warn = 0
                if (!isNumber(user.level))
                    user.level = 0
                if (!('role' in user))
                    user.role = 'Novato'
                if (!('autolevelup' in user))
                    user.autolevelup = false
                if (!('chatbot' in user))
                    user.chatbot = false
                if (!('genero' in user))
                    user.genero = 'Indeciso'
                if (!('language' in user))
                    user.language = 'pt'
                if (!('prem' in user))
                    user.prem = false
                if (!user.premiumTime) 
                    user.premiumTime = 0
            } else
                global.db.data.users[m.sender] = {
                    exp: 0,
                    coin: 0,
                    diamond: 20,
                    bank: 0,
                    lastclaim: 0,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    warn: 0,
                    level: 0,
                    role: 'Novato',
                    autolevelup: false,
                    chatbot: false,
                    genero: 'Indeciso',
                    language: 'pt',
                    prem: false,
                    premiumTime: 0,
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('welcome' in chat))
                    chat.welcome = true
                if (!('detect' in chat))
                    chat.detect = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                if (!('delete' in chat))
                    chat.delete = false
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('antiLink2' in chat))
                    chat.antiLink = false
                if (!('viewonce' in chat))
                    chat.viewonce = false
                if (!('captcha' in chat))
                    chat.captcha = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
                 if (!('rules' in chat))
                     chat.rules = ''
                 if (!('antifake' in chat))
                     chat.antifake = false // ou false, dependendo do padrão que você quer definir
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: true,
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: false,
                    antiLink: false,
                    antiLink2: true,
                    viewonce: false,
                    useDocument: true,
                    captcha: false,
                    nsfw: false, 
                    expired: 0,
                    rules: '',
                    antifake: false,
                    
                }
            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = false         
                if (!('antiSpam' in settings)) settings.antiSpam = true
                if (!('status' in settings)) settings.status = 0
                if (!('antiCall' in settings)) settings.antiCall = true
                if (!('solopv' in settings)) settings.solopv = false // el bot responde solo por dm
                if (!('sologp' in settings)) settings.sologp = false // el bot responde solo en grupos
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                restrict: false,
                antiSpam: true,
                antiCall: true,
                solopv: false, 
                sologp: false,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])  return
        if (!m.fromMe && opts['self'])  return
        if (settings.solopv && m.chat.endsWith('g.us')) return  
        //if (settings.sologp && !m.chat.endsWith('g.us')) return
        if (settings.sologp && !m.chat.endsWith('g.us') && !/jadibot|bebot|getcode|serbot|bots|stop|support|donate|off|on|s|tiktok|code|newcode|join/gim.test(m.text)) return 
        if (opts['swonly'] && m.chat !== 'status@broadcast')  return
        if (typeof m.text !== 'string')
            m.text = ''
        

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user.prem == true

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        //let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        
        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                   /*for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n${format(e)}.trim(), data.jid)
                    }*/
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                    }

                  if (!isAccept)
                  continue
                  m.plugin = name
                 if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                 let chat = global.db.data.chats[m.chat]
                 let user = global.db.data.users[m.sender]
                 if (!['owner-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return // Except this
                 if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned && !isROwner) return 
                 if (m.text && user.banned && !isROwner) {
                 if (user.antispam > 2) return
                 m.reply(`🚫 *ESTÁ BANIDO(A), NÃO PODE USAR COMANDOS*\n📑 *MOTIVO: ${user.messageSpam === 0 ? 'NÃO ESPECIFICADO' : user.messageSpam}*\n⚠️ _SE ACHA QUE PODE SER UM ERRO, ENTRAR EM CONTATO_`)
                 user.antispam++	
                 return
                 }


             
                   //Antispam		
                   if (user.antispam2) return
                   let time = global.db.data.users[m.sender].spam + 5000
                   if (new Date - global.db.data.users[m.sender].spam < 5000) throw console.log(`[ SPAM ]`) 
                   global.db.data.users[m.sender].spam = new Date * 1
                   }
    
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Usuarios Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // Ganancia de XP por comando
                if (xp > 200)
                    m.reply('chirrido -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.diamond && global.db.data.users[m.sender].diamond < plugin.diamond * 1) {
                    this.reply(m.chat, `✳️ Teus diamantes se acabaram\nuse o seguinte comando para comprar mais diamantes\n\n*${usedPrefix}buy*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `✳️ nivel requerido ${plugin.level} para usar este comando. \nTeu nivel ${_user.level}`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.diamond = m.diamond || plugin.diamond || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.diamond)
                        m.reply(`Utilizando *${+m.diamond}* 💎`)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.diamond -= m.diamond * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
    }
}

/**
 * Handle groups participants update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    // if (id in conn.chats) return // First login will spam
    /*if (this.isInit)
        return*/
     if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
     case 'add':
     case 'remove':
    if (chat.welcome) {
        let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata;
        for (let user of participants) {
            let pp = 'https://i.ibb.co/DCBY4zW/images-2024-02-22-T185539-122.jpg'; // URL padrão da imagem de perfil
            try {
                pp = await this.profilePictureUrl(user, 'image');
            } catch (e) {
                console.error('Erro ao obter a foto de perfil:', e);
            } finally {
                const botTt2 = groupMetadata.participants.find(u => this.decodeJid(u.id) == this.user.jid) || {};
                const isBotAdminNn = botTt2?.admin === "admin" || false;
                const welcomeMessage = chat.sWelcome || this.welcome || conn.welcome || `Bem-vindo ao grupo @user! leia nossa @desc`;
                const byeMessage = chat.sBye || this.bye || conn.bye || `Adeus, @user`;
                const messageContent = action === 'add' ? welcomeMessage.replace('@user', `@${user.split('@')[0]}`).replace('@desc', groupMetadata.desc?.toString() || 'Desconocido').replace('@grupo', await this.getName(id)) : byeMessage.replace('@user', `@${user.split('@')[0]}`).replace('@desc', groupMetadata.desc?.toString() || 'Desconhecido').replace('@grupo', await this.getName(id));
                //const messageContent = action === 'add' ? welcomeMessage.replace('@user', `@${user.split('@')[0]}`).replace('@desc', groupMetadata.desc?.toString() || 'Desconocido').replace('@grupo', await this.getName(id)) : byeMessage.replace('@subject', `@${await this.getName(id)}`).replace('@desc', groupMetadata.desc?.toString() || 'Desconhecido').replace('@group', await this.getName(id));
                //const messageContentbye = action === 'remove' ? byeMessage.replace('@user', `@${user.split('@')[0]}`).replace('@desc', groupMetadata.desc?.toString() || 'Desconocido').replace('@grupo', await this.getName(id)) : '';

                //await this.sendFile(id, pp, 'prefil.jpg', messageContentbye, null, false, { mentions: [user] });
                await this.sendFile(id, pp, 'prefil.jpg', messageContent, null, false, { mentions: [user] });
            }
        }
    }
    break

         if (chat.antifake && isBotAdmin && action === 'add') {
         const numerosPermitidos = ["6", "3", "4", "5", "7", "8", "9"] //Números permitidos nos antifake.
         if (numerosPermitidos.some(num => user.startsWith(num))) {	
         this.sendMessage(id, { text:`*Número @${user.split("@")[0]} removido, pois foi pego pelo antifake*`, mentions: [user] }, { quoted: null });          
         let responseb = await this.groupParticipantsUpdate(id, [user], 'remove')
         if (responseb[0].status === "404") return      
         return    
         }}
      
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user agora é um administrador')
        case 'demote':
            let pp = await this.profilePictureUrl(participants[0], 'image').catch(_ => 'https://i.ibb.co/1ZxrXKJ/avatar-contact.jpg') 
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user você não é mais administrador')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)    
            this.sendFile(id, pp, 'pp.jpg', text, null, false, { mentions: this.parseMention(text) })
            //this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}

/**
 * Handle groups update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || 'Descrição alterada para \n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || 'O nome do grupo foi alterado para \n@group').replace('@group', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || 'O ícone do grupo mudou para').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || 'O link do grupo mudou para\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        await this.reply(msg.chat, `
*🗑️ ANTIDELETE DETECTED*  
╭──────────────────╮  
│ *Nome:* @${participant.split`@`[0]} │  
╰──────────────────╯  

*[❗️] Desculpe, mas não é permitido deletar mensagens neste grupo.*

Para desativar esta função, digite:  
*/off antidelete*
`.trim(), msg, {
            mentions: [participant]
        })
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: `👑 ${mssg.rownerH}`,
        owner: `🔱 ${mssg.ownerH}`,
        mods: `🔰 ${mssg.modsH}`,
        premium: `💠 ${mssg.premH}`,
        group: `⚙️ ${mssg.groupH}`,
        private: `📮 ${mssg.privateH}`,
        admin: `🛡️ ${mssg.adminH}`,
        botAdmin: `💥 ${mssg.botAdmin}`,
        unreg: `📇 ${mssg.unregH}`,
        restrict: '🔐 Está *desabilitada*'
    }[type]
    //if (msg) return conn.sendButton(m.chat, msg, mssg.ig, null, [['🔖 OK', 'khajs'], ['⦙☰ MENU', '/menu'] ], m)
    if (msg) return m.reply(msg)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("✅  Atualizado 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
  }) 
