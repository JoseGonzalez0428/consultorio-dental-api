const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarContacto = async (req, res) => {
    const { nombre, apellidos, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ msg: 'Datos incompletos' });
    }

    try {
        await sgMail.send({
            to: process.env.EMAIL_USER,
            from: process.env.EMAIL_USER,
            subject: `Mensaje de contacto de ${nombre} ${apellidos}`,
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
                <p><strong>Correo:</strong> ${correo}</p>
                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        });

        res.status(200).json({ msg: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ msg: 'Error al enviar el mensaje' });
    }
};

module.exports = { enviarContacto };