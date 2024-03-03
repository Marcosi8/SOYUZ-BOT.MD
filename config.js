import { watchFile, unwatchFile } from 'fs'
import fs from "fs"
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['558881647724', 'marcoskz_', true],
  ['61488873561']
] //Numeros dos donos

global.mods = ['558881647724'] 
global.prems = ['558881647724', '558881647724']
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': 'aa9HWoim' //--- 100 de límite diario --- Registro na API para comandos NSFW: https://api.fgmods.xyz/
}

//Menus
global.img = fs.readFileSync("./src/menus/Menu4.jpg")
global.img2 = fs.readFileSync("./src/menus/IMG-20240213-WA0035.jpg")
global.img3 = fs.readFileSync("./src/menus/menuia.jpeg")
global.img4 = fs.readFileSync("./src/menus/dave1.mp4")
//global.img5 = 'https://i.ibb.co/7byyGk0/e5d4e244-1fa4-46a6-b68a-1927e9bac5db.jpg';
//global.img6 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img7 = 'https://i.ibb.co/PWbLKw8/5c9710e0-de56-474e-80a8-2f89f243eaac.jpg';
//global.img8 = 'https://i.ibb.co/PWbLKw8/5c9710e0-de56-474e-80a8-2f89f243eaac.jpg';
//global.img9 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img10 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img11 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img12 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img13 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img14 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img15 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img16 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';
//global.img17 = 'https://i.ibb.co/zPwRpz5/61769b3a-fd5c-4b78-9975-d19f87886d79.jpg';


//Chatgpt
global.gpt1 = fs.readFileSync("./src/GPT/menuia.jpeg")
global.gpt2 = fs.readFileSync("./src/GPT/chatgptprincipal.jpg")
global.gpt3 = fs.readFileSync("./src/GPT/chatgptprincipal.jpg")
global.gpt4 = fs.readFileSync("./src/GPT/gpt1.jpeg")
global.gpt5 = fs.readFileSync("./src/GPT/gpt3.jpeg")
global.gpt6 = fs.readFileSync("./src/GPT/chatgpt8.jpeg")
global.gpt7 = fs.readFileSync("./src/GPT/chatgpt7.jpeg")

global.marcosMenu = [img, img2, img3, img4] //img6, img7, img8, img9, img13, img14, img15, img16, img17]
global.marcosgpt = [gpt1, gpt2, gpt3, gpt4, gpt5, gpt6, gpt7]

// Sticker PackName
global.packname = '🤖 𝚂𝙾𝚈𝚄𝚉-𝙱𝙾𝚃-𝙼𝙳' 
global.author = 'user' 

//--info
global.botName = 'Vladivostok'
global.fgig = 'https://www.instagram.com/marcoskz_' 
global.fgsc = 'https://github.com/Marcosi8' 
global.fgyt = 'https://youtube.com'
global.fgpyp = 'https://www.paypal.com/donate/?business=WUDZNJ573PAF6&no_recurring=0&item_name=Help+this+project+stay+active%21+%3A%29&currency_code=BRL'
global.fglog = 'https://i.ibb.co/1zdz2j3/logo.jpgs' 

//--- Grupos WA
global.fgcanal = 'https://chat.whatsapp.com/LPddZ7u0v8G3PxEQ1SR1mZ'
global.bgp = 'https://chat.whatsapp.com/LPddZ7u0v8G3PxEQ1SR1mZ'
global.bgp2 = 'https://chat.whatsapp.com/LPddZ7u0v8G3PxEQ1SR1mZ'
global.bgp3 = 'https://chat.whatsapp.com/LPddZ7u0v8G3PxEQ1SR1mZ' //--GP NSFW

global.wait = '['↷', '↻', '⟳', '↷', '↻', '⟳'], m)'
global.rwait = '🔄'
global.dmoji = '🤠'
global.done = '✅'
global.error = '🚫' 
global.xmoji = '🎉' 

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
