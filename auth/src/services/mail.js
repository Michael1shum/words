const nodeMailer = require('nodemailer');
const { mailId, mailPassword } = require('../configuration/index');

class MailService {

  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: 'smtp.mail.ru',
      port: 587,
      secure: false,
      auth: {
        user: mailId,
        pass: mailPassword,
      },
    });
  }

  async sendActivationMail(email, link) {
    await this.transporter.sendMail({
      from: mailId,
      to: email,
      subject: 'Активация аккаунта',
      text: '',
      html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href='${link}'>${link}</a>
            </div>
            `,
    });
  }
}

module.exports = new MailService();
