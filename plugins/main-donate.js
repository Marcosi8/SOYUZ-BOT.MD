
let handler = async(m, { conn, usedPrefix, command }) => {

    let don = `
≡ ${mssg.donate}

▢ *PayPal*
• *Link :* https://www.paypal.com/donate/?business=WUDZNJ573PAF6&no_recurring=0&item_name=Help+this+project+stay+active%21+%3A%29&currency_code=BRL

▢ *Pix*
• *Email :* marcosrian494@gmail.com
`
let img = 'https://i.ibb.co/37FP2bk/donate.jpg'
conn.sendFile(m.chat, img, 'img.jpg', don, m, null, rpyp)
//conn.sendPayment(m.chat, '2000', 'USD', don, m.sender, m)
}

handler.help = ['donate']
handler.tags = ['main']
handler.command = ['doar', 'donate', 'donar'] 

export default handler

