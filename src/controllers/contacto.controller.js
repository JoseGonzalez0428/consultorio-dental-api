const { response, request } = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarContacto = async (req = request, res = response) => {
    const { nombre, apellidos, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ msg: 'Datos incompletos' });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
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
        res.status(500).json({ msg: 'Error al enviar el mensaje' });
    }
};

module.exports = { enviarContacto };