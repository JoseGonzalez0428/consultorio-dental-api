const { response, request } = require('express');
const Horario = require('../models/horario.model');

const getHorarios = async (req = request, res = response) => {
    const { mes, anio } = req.query;

    try {
        let query = {};

        if (mes && anio) {
            const mesFormateado = String(mes).padStart(2, '0');
            query = {
                fecha: {
                    $regex: `^${anio}-${mesFormateado}`
                }
            };
        }

        const horarios = await Horario.find(query).sort({ fecha: 1, hora_inicio: 1 });

        res.status(200).json(horarios);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los horarios'
        });
    }
};

const agregarHorario = async (req = request, res = response) => {
    const { fecha, hora_inicio, hora_fin } = req.body;

    if (!fecha || !hora_inicio || !hora_fin) {
        return res.status(400).json({
            msg: 'Datos incompletos'
        });
    }

    if (hora_inicio.split(':')[1] !== '00' || hora_fin.split(':')[1] !== '00') {
        return res.status(400).json({
            msg: 'Los horarios deben ser en horas completas'
        });
    }

    if (hora_inicio >= hora_fin) {
        return res.status(400).json({
            msg: 'La hora de inicio debe ser menor que la hora de fin'
        });
    }

    try {
        const nuevoHorario = new Horario({
            fecha,
            hora_inicio,
            hora_fin
        });

        await nuevoHorario.save();

        res.status(201).json({
            msg: 'Horario agregado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al agregar el horario'
        });
    }
};

const eliminarHorario = async (req = request, res = response) => {
    const { id } = req.params; 

    try {
        const horarioEliminado = await Horario.findByIdAndDelete(id);

        if (!horarioEliminado) {
            return res.status(404).json({
                msg: 'No se encontró el bloque de horario especificado'
            });
        }

        res.status(200).json({
            msg: 'Bloque de horario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar el bloque de horario'
        });
    }
};

const eliminarHorarioPorBloque = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const horario = await Horario.findById(id);

    if (!horario) {
      return res.status(404).json({
        msg: 'Horario no encontrado'
      });
    }

    await Horario.findByIdAndDelete(id);

    res.status(200).json({
      msg: 'Horario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al eliminar el horario'
    });
  }
};

module.exports = {
  getHorarios,
  agregarHorario,
  eliminarHorario,
  eliminarHorarioPorBloque
};