import nodemailer from "nodemailer";

const emailRegister = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const { email, nombre, token } = data;

    const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Confirmar tu cuenta en APV",
        text: "Confirmar tu cuenta en APV",
        html: `
            <p>Hola, ${nombre}. Confirma tu cuenta en APV</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmUser/${token}">Confirmar cuenta</a>

            <p>Si tu no has creado esta cuenta, ignora este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegister