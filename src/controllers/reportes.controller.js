const { response, request } = require('express');
const Reporte = require('../models/reporte.model');
const Cita = require('../models/cita.model');

const getReportes = async (req = request, res = response) => {
    const limit = parseInt(req.query.limit) || 3;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const total = await Reporte.countDocuments();

        const reportes = await Reporte.find()
            .populate('id_paciente', 'nombres apellido_paterno apellido_materno telefono')
            .populate('id_tratamiento', 'nombre')
            .populate('id_cita', 'fecha hora')
            .sort({ fecha_reporte: -1 })
            .limit(limit)
            .skip(offset);

        const reportesFormateados = reportes.map(r => ({
            _id: r._id,
            notas: r.notas,
            fecha_cita: r.id_cita.fecha,
            hora_cita: r.id_cita.hora,
            nombre_tratamiento: r.id_tratamiento.nombre,
            nombre_paciente: `${r.id_paciente.nombres} ${r.id_paciente.apellido_paterno} ${r.id_paciente.apellido_materno}`,
            telefono: r.id_paciente.telefono
        }));

        res.status(200).json({
            total,
            reportes: reportesFormateados
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los reportes'
        });
    }
};

const getCitasPasadasPorFecha = async (req = request, res = response) => {
    const { fecha } = req.query;

    if (!fecha) {
        return res.status(400).json({
            msg: 'Fecha requerida'
        });
    }

    const hoy = new Date().toISOString().split('T')[0];

    if (fecha >= hoy) {
        return res.status(400).json({
            msg: 'Solo se pueden crear reportes de citas pasadas'
        });
    }

    try {
        const citas = await Cita.find({ fecha })
            .populate('id_paciente', 'nombres apellido_paterno')
            .populate('id_tratamiento', 'nombre')
            .sort({ hora: 1 });

        const citasFormateadas = citas.map(c => ({
            _id: c._id,
            hora: c.hora,
            nombre_paciente: `${c.id_paciente.nombres} ${c.id_paciente.apellido_paterno}`,
            nombre_tratamiento: c.id_tratamiento.nombre
        }));

        res.status(200).json(citasFormateadas);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener las citas'
        });
    }
};

const getFechasConCitasSinReporte = async (req = request, res = response) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const reportesExistentes = await Reporte.find({}, 'id_cita');
        const idCitasConReporte = reportesExistentes.map(r => r.id_cita.toString());

        const citas = await Cita.find({
            fecha: { $lt: hoy },
            estado: 'Terminado'
        });

        const fechasSinReporte = [...new Set(
            citas
                .filter(c => !idCitasConReporte.includes(c._id.toString()))
                .map(c => c.fecha)
        )].sort();

        res.status(200).json(fechasSinReporte);
    } catch (error){
        res.status(500).json({
            msg: 'Error al obtener las fechas'
        });
    }
};

const crearReporte = async (req = request, res = response) => {
    const { id_cita, notas } = req.body;

    if (!id_cita || !notas) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    try {
        const cita = await Cita.findById(id_cita);

        if (!cita) {
            return res.status(404).json({
                msg: 'Cita no encontrada'
            });
        }

        const reporteExistente = await Reporte.findOne({ id_cita });

        if (reporteExistente) {
            return res.status(400).json({
                msg: 'Esta cita ya tiene un reporte creado'
            });
        }

        const hoy = new Date().toISOString().split('T')[0];

        if (cita.fecha >= hoy) {
            return res.status(400).json({
                msg: 'No se puede crear reporte de una cita que no ha pasado'
            });
        }

        const nuevoReporte = new Reporte({
            id_cita,
            id_tratamiento: cita.id_tratamiento,
            id_paciente: cita.id_paciente,
            notas
        });

        await nuevoReporte.save();

        res.status(201).json({
            msg: 'Reporte creado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear el reporte'
        });
    }
};

module.exports = {
    getReportes,
    getFechasConCitasSinReporte,
    getCitasPasadasPorFecha,
    crearReporte
};