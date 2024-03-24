const nodeMailer = require('nodemailer')
const {mailId, mailPassword} = require("../configuration/index");

class MailService {

    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sup.words.el@gmail.com",
                // user: mailId,
                pass: "12qwaszx!@QWASZX"
                // pass: mailPassword
            }
        })
    }

    async sendActivationMail(email, link) {
        await this.transporter.sendMail({
            from: mailId,
            to: email,
            subject: "Активация аккаунта",
            text: '',
            html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
    }
}

module.exports = new MailService();
