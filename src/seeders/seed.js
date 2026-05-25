require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario.model');
const Tratamiento = require('../models/tratamiento.model');
const Horario = require('../models/horario.model');
const Cita = require('../models/cita.model');
const Reporte = require('../models/reporte.model');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_STRING, { dbName: process.env.DB_NAME });
        console.log('Conectado a la base de datos');

        // Limpiar toda la BD
        await Usuario.deleteMany();
        await Tratamiento.deleteMany();
        await Horario.deleteMany();
        await Cita.deleteMany();
        await Reporte.deleteMany();
        console.log('Base de datos limpiada');

        // Usuarios
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const clientePassword = bcrypt.hashSync('cliente123', 10);

        const admin = await Usuario.create({
            nombres: 'Ana Luisa',
            apellido_paterno: 'Flores',
            apellido_materno: '',
            correo: 'admin@dental.com',
            contrasena: adminPassword,
            telefono: '4851060414',
            fecha_nacimiento: '1980-01-01',
            sexo: 'Femenino',
            tipo_usuario: 'admin'
        });

        const cliente = await Usuario.create({
            nombres: 'José Carlos',
            apellido_paterno: 'González',
            apellido_materno: 'Flores',
            correo: 'cliente@dental.com',
            contrasena: clientePassword,
            telefono: '4441234567',
            fecha_nacimiento: '2004-01-01',
            sexo: 'Masculino',
            tipo_usuario: 'cliente'
        });

        console.log('Usuarios creados');

        // Tratamientos
        const tratamientos = await Tratamiento.insertMany([
            {
                nombre: 'Consulta general',
                descripcion: 'Evaluación inicial donde se revisa tu salud bucal, se detectan problemas y se plantea un plan de tratamiento personalizado.',
                precio: '$250',
                imagen: 'consulta.jpg',
                recomendaciones: [
                    'Primera visita al consultorio.',
                    'Dolor o molestia en dientes o encías.',
                    'Chequeo de rutina.',
                    'Valoración previa a ortodoncia u otros tratamientos.'
                ],
                activo: true
            },
            {
                nombre: 'Ortodoncia',
                descripcion: 'Tratamiento que corrige la posición de los dientes y mandíbula, mejorando la estética y función de tu sonrisa.',
                precio: '$5000+',
                imagen: 'ortodoncia.jpg',
                recomendaciones: [
                    'Dientes desalineados o apiñados.',
                    'Mordida cruzada, abierta o profunda.',
                    'Espacios entre dientes.',
                    'Problemas funcionales al morder o hablar.'
                ],
                activo: true
            },
            {
                nombre: 'Limpieza dental',
                descripcion: 'Eliminación profesional de placa, sarro y manchas para mantener encías y dientes saludables.',
                precio: '$700',
                imagen: 'limpieza.jpg',
                recomendaciones: [
                    'Prevención de caries y enfermedades periodontales.',
                    'Mal aliento persistente.',
                    'Encías inflamadas o sangrantes.',
                    'Como complemento a tu rutina de higiene bucal.'
                ],
                activo: true
            },
            {
                nombre: 'Extracción dental',
                descripcion: 'La extracción dental es un procedimiento en el que se remueve un diente de la cavidad oral.',
                precio: '$700',
                imagen: 'extraccion.jpg',
                recomendaciones: [
                    'Dientes con caries severa que no pueden ser restaurados.',
                    'Infecciones que han dañado el diente y el hueso circundante.',
                    'Dientes fracturados que no pueden repararse.',
                    'Dientes de leche que no han caído de manera natural.',
                    'Extracción de muelas del juicio.'
                ],
                activo: true
            }
        ]);

        console.log('Tratamientos creados');

        // Horarios — sub-bloques individuales
        const hoy = new Date();
        const generarBloques = (fecha, horaInicio, horaFin) => {
            const bloques = [];
            const inicio = new Date(`2000-01-01T${horaInicio}`);
            const fin = new Date(`2000-01-01T${horaFin}`);
            while (inicio < fin) {
                const horaIni = inicio.toTimeString().slice(0, 5);
                inicio.setHours(inicio.getHours() + 1);
                const horaFinStr = inicio.toTimeString().slice(0, 5);
                if (inicio <= fin) {
                    bloques.push({ fecha, hora_inicio: horaIni, hora_fin: horaFinStr });
                }
            }
            return bloques;
        };

        const fecha1 = new Date(hoy);
        fecha1.setDate(hoy.getDate() + 1);
        const fechaStr1 = fecha1.toISOString().split('T')[0];

        const fecha2 = new Date(hoy);
        fecha2.setDate(hoy.getDate() + 2);
        const fechaStr2 = fecha2.toISOString().split('T')[0];

        const fecha3 = new Date(hoy);
        fecha3.setDate(hoy.getDate() + 3);
        const fechaStr3 = fecha3.toISOString().split('T')[0];

        const horarios = [
            ...generarBloques(fechaStr1, '09:00', '13:00'),
            ...generarBloques(fechaStr1, '17:00', '20:00'),
            ...generarBloques(fechaStr2, '09:00', '13:00'),
            ...generarBloques(fechaStr3, '10:00', '14:00'),
            ...generarBloques(fechaStr3, '17:00', '19:00'),
        ];

        await Horario.insertMany(horarios);
        console.log('Horarios creados');

        // Citas pasadas para probar reportes
        const fechaPasada1 = new Date(hoy);
        fechaPasada1.setDate(hoy.getDate() - 3);
        const fechaPasadaStr1 = fechaPasada1.toISOString().split('T')[0];

        const fechaPasada2 = new Date(hoy);
        fechaPasada2.setDate(hoy.getDate() - 2);
        const fechaPasadaStr2 = fechaPasada2.toISOString().split('T')[0];

        await Cita.insertMany([
            {
                id_paciente: cliente._id,
                id_tratamiento: tratamientos[0]._id,
                fecha: fechaPasadaStr1,
                hora: '10:00',
                estado: 'Terminado'
            },
            {
                id_paciente: cliente._id,
                id_tratamiento: tratamientos[2]._id,
                fecha: fechaPasadaStr2,
                hora: '11:00',
                estado: 'Terminado'
            }
        ]);

        console.log('Citas de prueba creadas');
        console.log('Seeder completado');
        process.exit(0);

    } catch (error) {
        console.error('Error en el seeder:', error);
        process.exit(1);
    }
};

seed();