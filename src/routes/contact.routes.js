import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'pittanapatricio@gmail.com',
    pass: 'zawf ofae whbl dohq'
  }
});

router.get('/email', async (req, res) => {
  try {
    // const email = req.body.email;
    await transport.sendMail({
      from: 'Info comprobantes ARTEMISA <info@artemisa.com>',
      to: ['pittanapatricio@gmail.com', 'capittana116@gmail.com'],
      subject: 'Prueba de correo electrónico',
      html: ` <h1>Hola!</h1>
              <img src="cid:comprobante" alt="Comprobante de pago">
              <p>Este es un correo de prueba</p>`,
      attachments: [{
        filename: 'comprobante.png',
        path: './src/public/img/image.png',
        cid: 'comprobante'
      }]
    });
    res.send('Correo electrónico enviado exitosamente');
  } catch (error) {
    res.status(500).send('Error al enviar el correo electrónico: ', error );
  };
});

router.post('/sendmessage', async (req, res) => {
  const { name, email, message, subject } = req.body;
  try {
    await transport.sendMail({
      from: `Bienvenido/a ${name} a Artemisa <${email}>`,
      to: email,
      subject,
      text: message,
      html: `<h1>Hola, ${name}</h1>
            <p>Este correo es para confirmar el mensaje que nos enviaste:</p>
            <p>${message}</p>`
    });
    res.send('Mensaje enviado exitosamente');
  } catch (error) {
    res.status(500).send('Error al enviar el correo electrónico: ', error );
  }
})

export default router;
