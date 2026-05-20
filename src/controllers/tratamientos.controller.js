const { response, request } = require('express');
const Tratamiento = require('../models/tratamiento.model');
const Cita = require('../models/cita.model');

const getTratamientos = async (req = request, res = response) => {
    try {
        const tratamientos = await Tratamiento.find({ activo: true });
        res.status(200).json(tratamientos);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener tratamientos'
        });
    }
};

const getTodosLosTratamientos = async (req = request, res = response) => {
    try {
        const tratamientos = await Tratamiento.find();
        res.status(200).json(tratamientos);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener tratamientos'
        });
    }
};

const reactivarTratamiento = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        await Tratamiento.findByIdAndUpdate(id, { activo: true });
        res.status(200).json({ msg: 'Tratamiento reactivado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al reactivar el tratamiento' });
    }
};

const getTratamientoById = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const tratamiento = await Tratamiento.findById(id);

        if (!tratamiento) {
            return res.status(404).json({
                msg: 'Tratamiento no encontrado'
            });
        }

        res.status(200).json(tratamiento);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener el tratamiento'
        });
    }
};

const crearTratamiento = async (req = request, res = response) => {
    const { nombre, descripcion, precio, recomendaciones } = req.body;

    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    if (!req.file) {
        return res.status(400).json({
            msg: 'La imagen es requerida'
        });
    }

    try {
        const tratamientoExistente = await Tratamiento.findOne({ nombre });

        if (tratamientoExistente) {
            return res.status(400).json({
                msg: 'Ya existe un tratamiento con ese nombre'
            });
        }

        const recomendacionesArray = recomendaciones
            ? JSON.parse(recomendaciones)
            : [];

        const nuevoTratamiento = new Tratamiento({
            nombre,
            descripcion,
            precio,
            imagen: req.file.filename,
            recomendaciones: recomendacionesArray
        });

        await nuevoTratamiento.save();

        res.status(201).json({
            msg: 'Tratamiento creado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear el tratamiento'
        });
    }
};

const actualizarTratamiento = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, recomendaciones } = req.body;

    try {
        const tratamiento = await Tratamiento.findById(id);

        if (!tratamiento) {
            return res.status(404).json({
                msg: 'Tratamiento no encontrado'
            });
        }

        const recomendacionesArray = recomendaciones
            ? JSON.parse(recomendaciones)
            : tratamiento.recomendaciones;

        const datosActualizados = {
            nombre: nombre ?? tratamiento.nombre,
            descripcion: descripcion ?? tratamiento.descripcion,
            precio: precio ?? tratamiento.precio,
            recomendaciones: recomendacionesArray
        };

        if (req.file) {
            datosActualizados.imagen = req.file.filename;
        }

        await Tratamiento.findByIdAndUpdate(id, datosActualizados);

        res.status(200).json({
            msg: 'Tratamiento actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar el tratamiento'
        });
    }
};

const eliminarTratamiento = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const tratamiento = await Tratamiento.findById(id);

        if (!tratamiento) {
            return res.status(404).json({
                msg: 'Tratamiento no encontrado'
            });
        }

        await Tratamiento.findByIdAndUpdate(id, { activo: false });

        // Cancelar todas las citas pendientes con este tratamiento
        await Cita.updateMany(
            { id_tratamiento: id, estado: 'Pendiente' },
            { estado: 'Cancelado' }
        );

        res.status(200).json({
            msg: 'Tratamiento desactivado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al desactivar el tratamiento'
        });
    }
};

module.exports = {
    getTratamientos,
    getTratamientoById,
    crearTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    getTodosLosTratamientos,
    reactivarTratamiento
};