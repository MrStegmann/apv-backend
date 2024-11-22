import nodemailer from "nodemailer";

const emailForgotPass = async (data) => {
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
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `
            <p>Hola, ${nombre}. Gas solicitado reestablecer tu password.</p>
            <p>Sigue el siguiente enlace para reestablecer tu password</p>
            <a href="${process.env.FRONTEND_URL}/forgotPass/${token}">Reestablecer password</a>

            <p>Si tu no has solicitado esta acción, ignora este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailForgotPass