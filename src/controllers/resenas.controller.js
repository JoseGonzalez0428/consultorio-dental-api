const { response, request } = require('express');
const Resena = require('../models/resena.model');
const Cita = require('../models/cita.model');

const getResenasPorTratamiento = async (req = request, res = response) => {
    const { id_tratamiento } = req.params;

    try {
        const resenas = await Resena.find({ id_tratamiento })
            .populate('id_paciente', 'nombres apellido_paterno')
            .sort({ fecha: -1 });

        const resenasFormateadas = resenas.map(r => ({
            _id: r._id,
            calificacion: r.calificacion,
            comentario: r.comentario,
            fecha: r.fecha,
            nombre_paciente: `${r.id_paciente.nombres} ${r.id_paciente.apellido_paterno}`
        }));

        res.status(200).json(resenasFormateadas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reseñas' });
    }
};

const crearResena = async (req = request, res = response) => {
    const { id_tratamiento, calificacion, comentario } = req.body;
    const id_paciente = req.activeUserId;

    if (!id_tratamiento || !calificacion) {
        return res.status(400).json({ msg: 'Datos incompletos' });
    }

    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ msg: 'La calificación debe ser entre 1 y 5' });
    }

    try {
        const citaTerminada = await Cita.findOne({
            id_paciente,
            id_tratamiento,
            estado: 'Terminado'
        });

        if (!citaTerminada) {
            return res.status(403).json({
                msg: 'Solo puedes reseñar tratamientos que hayas recibido'
            });
        }

        const resenaExistente = await Resena.findOne({ id_paciente, id_tratamiento });

        if (resenaExistente) {
            return res.status(400).json({
                msg: 'Ya dejaste una reseña para este tratamiento'
            });
        }

        const nuevaResena = new Resena({
            id_paciente,
            id_tratamiento,
            calificacion,
            comentario: comentario ?? ''
        });

        await nuevaResena.save();

        res.status(201).json({ msg: 'Reseña creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la reseña' });
    }
};

const puedeResenar = async (req = request, res = response) => {
    const { id_tratamiento } = req.params;
    const id_paciente = req.activeUserId;

    try {
        const citaTerminada = await Cita.findOne({
            id_paciente,
            id_tratamiento,
            estado: 'Terminado'
        });

        if (!citaTerminada) {
            return res.status(200).json({ puede: false, razon: 'sin_cita' });
        }

        const resenaExistente = await Resena.findOne({ id_paciente, id_tratamiento });

        if (resenaExistente) {
            return res.status(200).json({ puede: false, razon: 'ya_reseno' });
        }

        res.status(200).json({ puede: true });
    } catch (error) {
        res.status(500).json({ msg: 'Error al verificar' });
    }
};

module.exports = {
    getResenasPorTratamiento,
    crearResena,
    puedeResenar
};