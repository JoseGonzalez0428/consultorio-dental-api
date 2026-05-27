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
            id_paciente: r.id_paciente._id,
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

const actualizarResena = async (req = request, res = response) => {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;
    const id_paciente = req.activeUserId;

    if (!calificacion) {
        return res.status(400).json({ msg: 'La calificación es requerida' });
    }

    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ msg: 'La calificación debe ser entre 1 y 5' });
    }

    try {
        const resena = await Resena.findById(id);

        if (!resena) {
            return res.status(404).json({ msg: 'Reseña no encontrada' });
        }

        if (resena.id_paciente.toString() !== id_paciente.toString()) {
            return res.status(403).json({ msg: 'No puedes editar una reseña que no es tuya' });
        }

        await Resena.findByIdAndUpdate(id, { calificacion, comentario });

        res.status(200).json({ msg: 'Reseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la reseña' });
    }
};

const eliminarResena = async (req = request, res = response) => {
    const { id } = req.params;
    const id_paciente = req.activeUserId;
    const rol = req.activeUserRole;

    try {
        const resena = await Resena.findById(id);

        if (!resena) {
            return res.status(404).json({ msg: 'Reseña no encontrada' });
        }

        if (rol !== 'admin' && resena.id_paciente.toString() !== id_paciente.toString()) {
            return res.status(403).json({ msg: 'No puedes eliminar una reseña que no es tuya' });
        }

        await Resena.findByIdAndDelete(id);

        res.status(200).json({ msg: 'Reseña eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la reseña' });
    }
};

module.exports = {
    getResenasPorTratamiento,
    crearResena,
    puedeResenar,
    actualizarResena,
    eliminarResena
};