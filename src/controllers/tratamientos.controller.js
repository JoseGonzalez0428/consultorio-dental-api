const { response, request } = require('express');
const Tratamiento = require('../models/tratamiento.model');

const getTratamientos = async (req = request, res = response) => {
    try {
        const tratamientos = await Tratamiento.find();
        res.status(200).json(tratamientos);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener tratamientos'
        });
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
    const { nombre, descripcion, precio, imagen, recomendaciones } = req.body;

    const tratamientoExistente = await Tratamiento.findOne({ nombre });

    if (tratamientoExistente) {
        return res.status(400).json({
            msg: 'Ya existe un tratamiento con ese nombre'
        });
    }

    if (!nombre || !descripcion || !precio || !imagen) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    try {
        const nuevoTratamiento = new Tratamiento({
            nombre,
            descripcion,
            precio,
            imagen,
            recomendaciones: recomendaciones ?? []
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
    const { nombre, descripcion, precio, imagen, recomendaciones } = req.body;

    try {
        const tratamiento = await Tratamiento.findById(id);

        if (!tratamiento) {
            return res.status(404).json({
                msg: 'Tratamiento no encontrado'
            });
        }

        await Tratamiento.findByIdAndUpdate(id, {
            nombre,
            descripcion,
            precio,
            imagen,
            recomendaciones: recomendaciones ?? []
        });

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

        await Tratamiento.findByIdAndDelete(id);

        res.status(200).json({
            msg: 'Tratamiento eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar el tratamiento'
        });
    }
};

module.exports = {
    getTratamientos,
    getTratamientoById,
    crearTratamiento,
    actualizarTratamiento,
    eliminarTratamiento
};