const { response, request } = require('express');
const Cita = require('../models/cita.model');
const Usuario = require('../models/usuario.model');
const Tratamiento = require('../models/tratamiento.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCorreoCita = async (correo, nombre, fecha, hora) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Confirmación de cita',
            html: `Hola <strong>${nombre}</strong>,<br>Tu cita ha sido agendada para el <strong>${fecha}</strong> a las <strong>${hora}</strong>.<br><br>Gracias por confiar en nosotros.<br><br>Consultorio Dental`
        });
    } catch (error) {
        console.log('Error al enviar correo:', error);
    }
};

const getMisCitas = async (req = request, res = response) => {
    const id_paciente = req.activeUserId;

    try {
        const citas = await Cita.find({ id_paciente })
            .populate('id_tratamiento', 'nombre')
            .sort({ fecha: 1, hora: 1 });

        const citasFormateadas = citas.map(c => ({
            _id: c._id,
            fecha: c.fecha,
            hora: c.hora,
            estado: c.estado,
            nombre_tratamiento: c.id_tratamiento.nombre
        }));

        res.status(200).json(citasFormateadas);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener las citas'
        });
    }
};

const getCitasPorFecha = async (req = request, res = response) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({
            msg: 'Fecha requerida'
        });
    }

    try {
        const citas = await Cita.find({ fecha, estado: { $ne: 'Cancelado' } })
            .populate('id_paciente', 'nombres apellido_paterno apellido_materno telefono')
            .populate('id_tratamiento', 'nombre')
            .sort({ hora: 1 });

        const citasFormateadas = citas.map(c => ({
            _id: c._id,
            fecha: c.fecha,
            hora: c.hora,
            estado: c.estado,
            nombre_tratamiento: c.id_tratamiento.nombre,
            nombre_paciente: `${c.id_paciente.nombres} ${c.id_paciente.apellido_paterno} ${c.id_paciente.apellido_materno}`,
            telefono: c.id_paciente.telefono
        }));

        res.status(200).json(citasFormateadas);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener las citas'
        });
    }
};

const getHorasOcupadas = async (req = request, res = response) => {
    try {
        const citas = await Cita.find({ estado: { $ne: 'Cancelado' } });

        const ocupadas = {};
        citas.forEach(c => {
            if (!ocupadas[c.fecha]) {
                ocupadas[c.fecha] = [];
            }
            ocupadas[c.fecha].push(c.hora);
        });

        res.status(200).json(ocupadas);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener horas ocupadas'
        });
    }
};

const agendarCita = async (req = request, res = response) => {
    const { id_tratamiento, fecha, hora } = req.body;
    const id_paciente = req.activeUserId;

    if (!id_tratamiento || !fecha || !hora) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    try {
        const citaExistente = await Cita.findOne({
            fecha,
            hora,
            estado: { $ne: 'Cancelado' }
        });

        if (citaExistente) {
            return res.status(400).json({
                msg: 'Ese horario ya está ocupado'
            });
        }

        const nuevaCita = new Cita({
            id_paciente,
            id_tratamiento,
            fecha,
            hora,
            estado: 'Pendiente'
        });

        await nuevaCita.save();

        const usuario = await Usuario.findById(id_paciente);
        if (usuario) {
            await enviarCorreoCita(usuario.correo, usuario.nombres, fecha, hora);
        }

        res.status(201).json({
            msg: 'Cita agendada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al agendar la cita'
        });
    }
};

const modificarCita = async (req = request, res = response) => {
    const { id } = req.params;
    const { fecha, hora } = req.body;

    try {
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({
                msg: 'Cita no encontrada'
            });
        }

        const citaOcupada = await Cita.findOne({
            fecha,
            hora,
            estado: { $ne: 'Cancelado' },
            _id: { $ne: id }
        });

        if (citaOcupada) {
            return res.status(400).json({
                msg: 'Ese horario ya está ocupado'
            });
        }

        await Cita.findByIdAndUpdate(id, { fecha, hora });

        res.status(200).json({
            msg: 'Cita modificada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al modificar la cita'
        });
    }
};

const cancelarCita = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({
                msg: 'Cita no encontrada'
            });
        }

        await Cita.findByIdAndUpdate(id, { estado: 'Cancelado' });

        res.status(200).json({
            msg: 'Cita cancelada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al cancelar la cita'
        });
    }
};

const completarCita = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({
                msg: 'Cita no encontrada'
            });
        }

        await Cita.findByIdAndUpdate(id, { estado: 'Terminado' });

        res.status(200).json({
            msg: 'Cita completada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al completar la cita'
        });
    }
};

module.exports = {
    getMisCitas,
    getCitasPorFecha,
    getHorasOcupadas,
    agendarCita,
    modificarCita,
    cancelarCita,
    completarCita
};