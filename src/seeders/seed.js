require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario.model');
const Tratamiento = require('../models/tratamiento.model');
const Horario = require('../models/horario.model');
const Cita = require('../models/cita.model');
const Reporte = require('../models/reporte.model');
const Resena = require('../models/resena.model');

// ─── Helpers ────────────────────────────────────────────────────────────────

const fechaRelativa = (diasDesdeHoy) => {
    const d = new Date();
    d.setDate(d.getDate() + diasDesdeHoy);
    return d.toISOString().split('T')[0];
};

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

// ─── Seed ───────────────────────────────────────────────────────────────────

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_STRING, { dbName: process.env.DB_NAME });
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones
        await Promise.all([
            Usuario.deleteMany(),
            Tratamiento.deleteMany(),
            Horario.deleteMany(),
            Cita.deleteMany(),
            Reporte.deleteMany(),
            Resena.deleteMany(),
        ]);
        console.log('🧹 Base de datos limpiada');

        // ── USUARIOS ──────────────────────────────────────────────────────────

        const hash = (pw) => bcrypt.hashSync(pw, 10);

        const admin = await Usuario.create({
            nombres: 'Ana Luisa',
            apellido_paterno: 'Flores',
            apellido_materno: 'Martínez',
            correo: 'admin@dental.com',
            contrasena: hash('admin123'),
            telefono: '4851060414',
            fecha_nacimiento: '1980-03-15',
            sexo: 'Femenino',
            tipo_usuario: 'admin'
        });

        const clientes = await Usuario.insertMany([
            {
                nombres: 'José Carlos',
                apellido_paterno: 'Gonzalez',
                apellido_materno: 'Flores',
                correo: 'josecarlos@gmail.com',
                contrasena: hash('cliente123'),
                telefono: '4441234567',
                fecha_nacimiento: '2004-06-21',
                sexo: 'Masculino',
                tipo_usuario: 'cliente'
            },
            {
                nombres: 'María Fernanda',
                apellido_paterno: 'Ramírez',
                apellido_materno: 'López',
                correo: 'mfernanda@gmail.com',
                contrasena: hash('cliente123'),
                telefono: '4449876543',
                fecha_nacimiento: '1995-11-08',
                sexo: 'Femenino',
                tipo_usuario: 'cliente'
            },
            {
                nombres: 'Diego Alejandro',
                apellido_paterno: 'Torres',
                apellido_materno: 'Hernández',
                correo: 'diegoalejandro@gmail.com',
                contrasena: hash('cliente123'),
                telefono: '4443216789',
                fecha_nacimiento: '1990-02-14',
                sexo: 'Masculino',
                tipo_usuario: 'cliente'
            },
            {
                nombres: 'Sofía',
                apellido_paterno: 'Mendoza',
                apellido_materno: 'García',
                correo: 'sofia.mendoza@gmail.com',
                contrasena: hash('cliente123'),
                telefono: '4447654321',
                fecha_nacimiento: '1998-09-30',
                sexo: 'Femenino',
                tipo_usuario: 'cliente'
            },
            {
                nombres: 'Roberto',
                apellido_paterno: 'Sánchez',
                apellido_materno: 'Vega',
                correo: 'roberto.sanchez@gmail.com',
                contrasena: hash('cliente123'),
                telefono: '4441357924',
                fecha_nacimiento: '1985-07-22',
                sexo: 'Masculino',
                tipo_usuario: 'cliente'
            },
        ]);

        const [jose, maria, diego, sofia, roberto] = clientes;
        console.log('👥 Usuarios creados (1 admin + 5 clientes)');

        // ── TRATAMIENTOS ──────────────────────────────────────────────────────

        // NOTA: Para las imágenes, guarda el archivo en public/Imagenes/ del proyecto
        // Angular con exactamente el nombre que aparece en el campo "imagen" de cada
        // tratamiento. Por ejemplo, para "consulta-general.jpg" guarda el archivo como
        // public/Imagenes/consulta-general.jpg. Si no tienes la imagen, puedes usar
        // cualquier foto dental y renombrarla con ese nombre.

        const tratamientos = await Tratamiento.insertMany([
            {
                nombre: 'Consulta general',
                descripcion: 'Evaluación inicial donde se revisa tu salud bucal, se detectan problemas y se plantea un plan de tratamiento personalizado. Incluye exploración clínica completa y radiografías de diagnóstico.',
                precio: '$300',
                imagen: 'consulta-general.jpg',
                recomendaciones: [
                    'Realizar cada 6 meses como prevención.',
                    'Ideal si tienes dolor o molestia en dientes o encías.',
                    'Necesaria antes de iniciar cualquier otro tratamiento.',
                    'Trae estudios o radiografías previas si las tienes.'
                ],
                activo: true
            },
            {
                nombre: 'Limpieza dental profunda',
                descripcion: 'Eliminación profesional de placa bacteriana, sarro y manchas superficiales mediante ultrasonido y pulido dental. Previene caries, enfermedad periodontal y mal aliento.',
                precio: '$650',
                imagen: 'limpieza-dental.jpg',
                recomendaciones: [
                    'Recomendada cada 6 meses.',
                    'Evita comer durante 2 horas después del procedimiento.',
                    'Pueden presentarse leves molestias en encías las primeras 24 horas.',
                    'Complementa con hilo dental diariamente.'
                ],
                activo: true
            },
            {
                nombre: 'Ortodoncia metálica',
                descripcion: 'Tratamiento correctivo con brackets metálicos para alinear dientes y corregir la mordida. Ideal para casos moderados y severos de maloclusión. Duración promedio de 18 a 24 meses.',
                precio: '$12,000',
                imagen: 'ortodoncia-metalica.jpg',
                recomendaciones: [
                    'Requiere consulta de valoración previa.',
                    'Evita alimentos duros, pegajosos o muy azucarados.',
                    'Usa el cepillo interdental tras cada comida.',
                    'Asiste a tus citas de ajuste cada 4 semanas.'
                ],
                activo: true
            },
            {
                nombre: 'Ortodoncia estética (zafiro)',
                descripcion: 'Brackets de zafiro transparente que ofrecen la misma efectividad que los metálicos con mayor discreción estética. Perfectos para pacientes que buscan resultados sin comprometer su imagen.',
                precio: '$18,000',
                imagen: 'ortodoncia-zafiro.jpg',
                recomendaciones: [
                    'Requiere mayor cuidado de higiene para mantener la transparencia.',
                    'Evita alimentos que manchen como café, té y betabel.',
                    'Usa enjuague bucal sin colorantes artificiales.',
                    'Citas de ajuste cada 4 semanas.'
                ],
                activo: true
            },
            {
                nombre: 'Extracción dental simple',
                descripcion: 'Extracción de piezas dentales que no pueden ser restauradas por caries severa, fractura o enfermedad periodontal avanzada. Se realiza bajo anestesia local para máxima comodidad.',
                precio: '$700',
                imagen: 'extraccion-simple.jpg',
                recomendaciones: [
                    'No comas ni bebas 2 horas antes si se aplicará sedación.',
                    'Evita enjuagarte con fuerza las primeras 24 horas.',
                    'Aplica frío externamente para reducir inflamación.',
                    'No fumes ni consumas alcohol en los siguientes 3 días.'
                ],
                activo: true
            },
            {
                nombre: 'Extracción de muela del juicio',
                descripcion: 'Cirugía para la remoción de terceros molares (muelas del juicio) impactados o en posición inadecuada. Previene apiñamiento dental, infecciones y quistes.',
                precio: '$2,500',
                imagen: 'extraccion-juicio.jpg',
                recomendaciones: [
                    'Requiere ayuno de 6 horas si se usará sedación.',
                    'Descansa las primeras 24 horas tras la cirugía.',
                    'Aplica hielo externamente cada 20 minutos las primeras horas.',
                    'Toma los antibióticos y analgésicos recetados completos.',
                    'Dieta blanda durante los primeros 5 días.'
                ],
                activo: true
            },
            {
                nombre: 'Blanqueamiento dental',
                descripcion: 'Tratamiento estético que aclara el tono natural de los dientes hasta 8 tonos usando gel de peróxido de hidrógeno activado con luz LED. Resultados visibles desde la primera sesión.',
                precio: '$1,800',
                imagen: 'blanqueamiento.jpg',
                recomendaciones: [
                    'Evita alimentos o bebidas que manchen durante 48 horas.',
                    'Es normal sentir sensibilidad temporal tras el tratamiento.',
                    'No fumes al menos 48 horas después.',
                    'Mantén el resultado con pasta blanqueadora de mantenimiento.',
                    'No recomendado durante el embarazo o lactancia.'
                ],
                activo: true
            },
            {
                nombre: 'Resina dental (empaste)',
                descripcion: 'Restauración de piezas dañadas por caries o fractura usando resina compuesta del color del diente. Devuelve la forma, función y estética a la pieza dental en una sola cita.',
                precio: '$450',
                imagen: 'resina-dental.jpg',
                recomendaciones: [
                    'Evita morder objetos duros con la pieza restaurada.',
                    'Puede presentarse sensibilidad los primeros días.',
                    'Mantén higiene estricta para prolongar la vida de la restauración.',
                    'Acude a revisión cada 6 meses.'
                ],
                activo: true
            },
            {
                nombre: 'Endodoncia (tratamiento de conductos)',
                descripcion: 'Tratamiento que elimina la pulpa dental infectada o necrótica para salvar la pieza dental. Alivia el dolor severo causado por infección y previene la propagación de bacterias.',
                precio: '$3,500',
                imagen: 'endodoncia.jpg',
                recomendaciones: [
                    'Puede requerir 2 a 3 sesiones según la complejidad.',
                    'Es normal sentir molestia leve los días posteriores.',
                    'Toma los analgésicos recetados puntualmente.',
                    'Generalmente se coloca una corona dental al finalizar.',
                    'No mastiques del lado tratado hasta terminar el proceso.'
                ],
                activo: true
            },
            {
                nombre: 'Corona dental de porcelana',
                descripcion: 'Restauración completa que recubre toda la pieza dental dañada, débil o estéticamente comprometida. Las coronas de porcelana imitan perfectamente el color y translucidez del diente natural.',
                precio: '$5,500',
                imagen: 'corona-porcelana.jpg',
                recomendaciones: [
                    'Requiere 2 citas: preparación y colocación definitiva.',
                    'Evita morder objetos muy duros o hielo.',
                    'Limpia la línea encía-corona con hilo dental diariamente.',
                    'Duración estimada de 10 a 15 años con buen cuidado.'
                ],
                activo: true
            },
        ]);

        const [
            tConsulta, tLimpieza, tOrtometalica, tOrtoestetica,
            tExtraccion, tJuicio, tBlanqueamiento, tResina,
            tEndodoncia, tCorona
        ] = tratamientos;

        console.log(`🦷 ${tratamientos.length} tratamientos creados`);

        // ── HORARIOS ──────────────────────────────────────────────────────────
        // Días futuros con horarios variados

        const horariosData = [
            // Mañana
            ...generarBloques(fechaRelativa(1), '09:00', '13:00'),
            ...generarBloques(fechaRelativa(1), '16:00', '19:00'),
            // Pasado mañana
            ...generarBloques(fechaRelativa(2), '08:00', '12:00'),
            ...generarBloques(fechaRelativa(2), '15:00', '18:00'),
            // En 3 días
            ...generarBloques(fechaRelativa(3), '09:00', '14:00'),
            // En 4 días
            ...generarBloques(fechaRelativa(4), '10:00', '13:00'),
            ...generarBloques(fechaRelativa(4), '17:00', '20:00'),
            // En 5 días
            ...generarBloques(fechaRelativa(5), '09:00', '12:00'),
            // En 7 días
            ...generarBloques(fechaRelativa(7), '08:00', '13:00'),
            ...generarBloques(fechaRelativa(7), '16:00', '19:00'),
            // En 8 días
            ...generarBloques(fechaRelativa(8), '09:00', '11:00'),
            ...generarBloques(fechaRelativa(8), '14:00', '17:00'),
            // En 10 días
            ...generarBloques(fechaRelativa(10), '10:00', '14:00'),
            // En 14 días
            ...generarBloques(fechaRelativa(14), '09:00', '13:00'),
            ...generarBloques(fechaRelativa(14), '16:00', '20:00'),
        ];

        await Horario.insertMany(horariosData);
        console.log(`📅 ${horariosData.length} bloques de horario creados`);

        // ── CITAS PASADAS (TERMINADAS) ─────────────────────────────────────────

        const citasPasadas = await Cita.insertMany([
            // José Carlos
            { id_paciente: jose._id, id_tratamiento: tConsulta._id, fecha: fechaRelativa(-30), hora: '10:00', estado: 'Terminado' },
            { id_paciente: jose._id, id_tratamiento: tLimpieza._id, fecha: fechaRelativa(-25), hora: '11:00', estado: 'Terminado' },
            { id_paciente: jose._id, id_tratamiento: tResina._id, fecha: fechaRelativa(-15), hora: '09:00', estado: 'Terminado' },
            { id_paciente: jose._id, id_tratamiento: tBlanqueamiento._id, fecha: fechaRelativa(-10), hora: '12:00', estado: 'Terminado' },

            // María Fernanda
            { id_paciente: maria._id, id_tratamiento: tConsulta._id, fecha: fechaRelativa(-28), hora: '09:00', estado: 'Terminado' },
            { id_paciente: maria._id, id_tratamiento: tOrtometalica._id, fecha: fechaRelativa(-20), hora: '10:00', estado: 'Terminado' },
            { id_paciente: maria._id, id_tratamiento: tLimpieza._id, fecha: fechaRelativa(-12), hora: '11:00', estado: 'Terminado' },

            // Diego
            { id_paciente: diego._id, id_tratamiento: tConsulta._id, fecha: fechaRelativa(-35), hora: '10:00', estado: 'Terminado' },
            { id_paciente: diego._id, id_tratamiento: tEndodoncia._id, fecha: fechaRelativa(-22), hora: '09:00', estado: 'Terminado' },
            { id_paciente: diego._id, id_tratamiento: tCorona._id, fecha: fechaRelativa(-8), hora: '10:00', estado: 'Terminado' },

            // Sofía
            { id_paciente: sofia._id, id_tratamiento: tConsulta._id, fecha: fechaRelativa(-40), hora: '11:00', estado: 'Terminado' },
            { id_paciente: sofia._id, id_tratamiento: tBlanqueamiento._id, fecha: fechaRelativa(-18), hora: '12:00', estado: 'Terminado' },
            { id_paciente: sofia._id, id_tratamiento: tOrtoestetica._id, fecha: fechaRelativa(-5), hora: '09:00', estado: 'Terminado' },

            // Roberto
            { id_paciente: roberto._id, id_tratamiento: tConsulta._id, fecha: fechaRelativa(-45), hora: '09:00', estado: 'Terminado' },
            { id_paciente: roberto._id, id_tratamiento: tJuicio._id, fecha: fechaRelativa(-30), hora: '10:00', estado: 'Terminado' },
            { id_paciente: roberto._id, id_tratamiento: tExtraccion._id, fecha: fechaRelativa(-14), hora: '11:00', estado: 'Terminado' },
            { id_paciente: roberto._id, id_tratamiento: tResina._id, fecha: fechaRelativa(-6), hora: '09:00', estado: 'Terminado' },
        ]);

        // Citas canceladas (historial realista)
        await Cita.insertMany([
            { id_paciente: jose._id, id_tratamiento: tOrtometalica._id, fecha: fechaRelativa(-20), hora: '14:00', estado: 'Cancelado' },
            { id_paciente: maria._id, id_tratamiento: tExtraccion._id, fecha: fechaRelativa(-10), hora: '15:00', estado: 'Cancelado' },
            { id_paciente: diego._id, id_tratamiento: tLimpieza._id, fecha: fechaRelativa(-7), hora: '16:00', estado: 'Cancelado' },
        ]);

        // Citas futuras pendientes
        await Cita.insertMany([
            { id_paciente: jose._id, id_tratamiento: tOrtometalica._id, fecha: fechaRelativa(1), hora: '09:00', estado: 'Pendiente' },
            { id_paciente: maria._id, id_tratamiento: tLimpieza._id, fecha: fechaRelativa(2), hora: '10:00', estado: 'Pendiente' },
            { id_paciente: diego._id, id_tratamiento: tCorona._id, fecha: fechaRelativa(3), hora: '11:00', estado: 'Pendiente' },
            { id_paciente: sofia._id, id_tratamiento: tOrtoestetica._id, fecha: fechaRelativa(4), hora: '10:00', estado: 'Pendiente' },
            { id_paciente: roberto._id, id_tratamiento: tBlanqueamiento._id, fecha: fechaRelativa(7), hora: '09:00', estado: 'Pendiente' },
        ]);

        console.log('📋 Citas creadas (pasadas, canceladas y futuras)');

        // ── REPORTES ──────────────────────────────────────────────────────────

        await Reporte.insertMany([
            {
                id_cita: citasPasadas[0]._id,
                id_tratamiento: tConsulta._id,
                id_paciente: jose._id,
                notas: 'Paciente presenta leve acumulación de sarro en sector inferior. Se recomienda limpieza dental próxima visita. Sin caries activas. Encías en buen estado general. Se indica uso de hilo dental diario y cepillado técnica Bass.'
            },
            {
                id_cita: citasPasadas[1]._id,
                id_tratamiento: tLimpieza._id,
                id_paciente: jose._id,
                notas: 'Limpieza dental realizada sin complicaciones. Se eliminó sarro subgingival en sector anteroinferior. Paciente tolera bien el procedimiento. Se aplicó flúor tópico al finalizar. Se recomienda nueva limpieza en 6 meses.'
            },
            {
                id_cita: citasPasadas[2]._id,
                id_tratamiento: tResina._id,
                id_paciente: jose._id,
                notas: 'Se realizó restauración con resina compuesta en pieza 36 (primer molar inferior izquierdo). Caries clase I de profundidad moderada. Se utilizó resina de tonalidad A2. Oclusión ajustada correctamente. Pronóstico favorable.'
            },
            {
                id_cita: citasPasadas[3]._id,
                id_tratamiento: tBlanqueamiento._id,
                id_paciente: jose._id,
                notas: 'Blanqueamiento dental con lámpara LED de 40 minutos. Tono inicial B3, tono final A1. Paciente refiere leve sensibilidad durante el procedimiento, manejada con gel desensibilizante. Resultado satisfactorio. Se entregó kit de mantenimiento.'
            },
            {
                id_cita: citasPasadas[4]._id,
                id_tratamiento: tConsulta._id,
                id_paciente: maria._id,
                notas: 'Valoración inicial de ortodoncia. Paciente presenta apiñamiento moderado en sector anterior superior e inferior. Mordida cruzada posterior derecha. Se toman modelos de estudio y radiografía panorámica. Se propone plan con brackets metálicos con duración estimada de 20 meses.'
            },
            {
                id_cita: citasPasadas[5]._id,
                id_tratamiento: tOrtometalica._id,
                id_paciente: maria._id,
                notas: 'Primera colocación de brackets metálicos. Se cementan arcos superiores e inferiores. Arco inicial NiTi 0.014. Paciente recibe instrucciones de higiene con brackets. Cita de ajuste programada en 4 semanas. Tolera bien el procedimiento.'
            },
            {
                id_cita: citasPasadas[6]._id,
                id_tratamiento: tLimpieza._id,
                id_paciente: maria._id,
                notas: 'Limpieza de mantenimiento durante tratamiento ortodóntico. Acumulación de placa interproximal por dificultad de higiene con brackets. Se refuerzan instrucciones de higiene con cepillo unipenacho e irrigador oral. Encías levemente inflamadas, se indica enjuague con clorhexidina.'
            },
            {
                id_cita: citasPasadas[7]._id,
                id_tratamiento: tConsulta._id,
                id_paciente: diego._id,
                notas: 'Paciente acude por dolor intenso en pieza 46. A la exploración se detecta caries profunda con probable afectación pulpar. Se toma radiografía periapical que confirma lesión periapical. Se explican opciones: endodoncia o extracción. Paciente opta por conservar la pieza.'
            },
            {
                id_cita: citasPasadas[8]._id,
                id_tratamiento: tEndodoncia._id,
                id_paciente: diego._id,
                notas: 'Primera sesión de endodoncia en pieza 46. Se realiza acceso cameral, localización de 3 conductos (mesiovestibular, mesiolingual y distal). Instrumentación hasta lima 35. Irrigación con hipoclorito de sodio 2.5%. Medicación intraconducto con hidróxido de calcio. Se temporaliza. Paciente refiere alivio del dolor.'
            },
            {
                id_cita: citasPasadas[9]._id,
                id_tratamiento: tCorona._id,
                id_paciente: diego._id,
                notas: 'Toma de impresión para corona de porcelana en pieza 46 post-endodoncia. Se prepara el muñón, se toma impresión con silicona de condensación. Se coloca corona provisional. Se envía al laboratorio dental. Cita de colocación definitiva en 10 días.'
            },
            {
                id_cita: citasPasadas[10]._id,
                id_tratamiento: tConsulta._id,
                id_paciente: sofia._id,
                notas: 'Consulta estética. Paciente interesada en blanqueamiento y ortodoncia estética. Presenta discromía leve por consumo de café y dientes levemente apiñados en sector anterior. Se toman fotografías de diagnóstico y se presenta plan de tratamiento. Comienza con blanqueamiento antes de la ortodoncia.'
            },
            {
                id_cita: citasPasadas[11]._id,
                id_tratamiento: tBlanqueamiento._id,
                id_paciente: sofia._id,
                notas: 'Blanqueamiento exitoso. Tono inicial C2, tono final B1. Paciente muy satisfecha con el resultado. No refiere sensibilidad significativa. Se indica evitar café y vino tinto mínimo 72 horas. Siguiente paso: colocación de brackets de zafiro en próxima cita.'
            },
            {
                id_cita: citasPasadas[13]._id,
                id_tratamiento: tConsulta._id,
                id_paciente: roberto._id,
                notas: 'Paciente acude por molestia en zona de terceros molares inferiores. Panorámica muestra muelas del juicio semierupcionadas en posición mesioangular. Inflamación de opérculo. Se indica antibioticoterapia previa a la cirugía de extracción. Se programa cirugía en 1 semana.'
            },
            {
                id_cita: citasPasadas[14]._id,
                id_tratamiento: tJuicio._id,
                id_paciente: roberto._id,
                notas: 'Exodoncia quirúrgica de terceros molares inferiores bilaterales bajo anestesia local. Se realizaron colgajos mucoperiósticos y odontosección en ambas piezas. Curetaje de alvéolo y sutura con seda 3-0. Procedimiento sin complicaciones. Se recetan amoxicilina 500mg cada 8h por 7 días y ketorolaco 10mg cada 8h por 3 días.'
            },
            {
                id_cita: citasPasadas[15]._id,
                id_tratamiento: tExtraccion._id,
                id_paciente: roberto._id,
                notas: 'Extracción de pieza 14 con caries severa no restaurable. Extracción simple sin complicaciones. Alvéolo limpio, se coloca esponja hemostática. Se indica morder gasa 30 minutos y seguir indicaciones postoperatorias estándar. Se explican opciones de rehabilitación: implante o puente fijo.'
            },
            {
                id_cita: citasPasadas[16]._id,
                id_tratamiento: tResina._id,
                id_paciente: roberto._id,
                notas: 'Restauración con resina en piezas 24 y 25. Caries clase II interproximal. Se utilizó matriz seccional para lograr punto de contacto adecuado. Resina de tonalidad A3. Pulido final con discos Sof-Lex. Oclusión correcta verificada con papel de articular. Paciente satisfecho.'
            },
        ]);

        console.log('📝 Reportes clínicos creados');

        // ── RESEÑAS ───────────────────────────────────────────────────────────

        await Resena.insertMany([
            // Consulta general
            {
                id_paciente: jose._id,
                id_tratamiento: tConsulta._id,
                calificacion: 5,
                comentario: 'Excelente atención desde el primer momento. La doctora es muy amable y explica todo con detalle. El consultorio está muy limpio y equipado. Totalmente recomendado.',
                fecha: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: maria._id,
                id_tratamiento: tConsulta._id,
                calificacion: 5,
                comentario: 'Me explicaron todo mi plan de tratamiento con mucha paciencia. Se nota la experiencia y profesionalismo. Muy contenta con la atención.',
                fecha: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: diego._id,
                id_tratamiento: tConsulta._id,
                calificacion: 4,
                comentario: 'Buena atención, aunque esperé un poco. El diagnóstico fue muy preciso, me detectaron el problema rápidamente.',
                fecha: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: roberto._id,
                id_tratamiento: tConsulta._id,
                calificacion: 5,
                comentario: 'Primera visita y quedé muy satisfecho. La doctora es muy profesional y el ambiente del consultorio transmite confianza.',
                fecha: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000)
            },
            // Limpieza dental
            {
                id_paciente: jose._id,
                id_tratamiento: tLimpieza._id,
                calificacion: 5,
                comentario: 'La limpieza fue muy completa, mis dientes quedaron increíbles. Sin dolor y muy rápido. Ya la tengo programada para dentro de 6 meses.',
                fecha: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: maria._id,
                id_tratamiento: tLimpieza._id,
                calificacion: 4,
                comentario: 'Muy buena limpieza aunque con los brackets es un proceso más tardado. La doctora tiene mucha paciencia.',
                fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },
            // Ortodoncia metálica
            {
                id_paciente: maria._id,
                id_tratamiento: tOrtometalica._id,
                calificacion: 5,
                comentario: 'Llevo varios meses con los brackets y los resultados son impresionantes. La doctora hace seguimiento muy cercano de mi tratamiento. Muy recomendada.',
                fecha: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
            },
            // Blanqueamiento
            {
                id_paciente: jose._id,
                id_tratamiento: tBlanqueamiento._id,
                calificacion: 5,
                comentario: 'Quedé sorprendido con el resultado. Mis dientes quedaron varios tonos más blancos en una sola sesión. Sin sensibilidad después. Vale totalmente la pena.',
                fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: sofia._id,
                id_tratamiento: tBlanqueamiento._id,
                calificacion: 5,
                comentario: 'El antes y después es increíble. Sentí un poco de sensibilidad durante pero fue pasajera. La doctora me dio tips para mantener el resultado. Muy satisfecha.',
                fecha: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
            },
            // Endodoncia
            {
                id_paciente: diego._id,
                id_tratamiento: tEndodoncia._id,
                calificacion: 4,
                comentario: 'Tenía mucho miedo pero la doctora me tranquilizó en todo momento. El procedimiento fue sin dolor gracias a la anestesia. El alivio después de meses de dolor es increíble.',
                fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
            },
            // Extracción muela del juicio
            {
                id_paciente: roberto._id,
                id_tratamiento: tJuicio._id,
                calificacion: 5,
                comentario: 'Me sacaron las dos muelas del juicio al mismo tiempo y fue mucho mejor de lo que esperaba. La recuperación fue rápida siguiendo las indicaciones. Profesionalismo total.',
                fecha: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
            },
            // Resina
            {
                id_paciente: jose._id,
                id_tratamiento: tResina._id,
                calificacion: 5,
                comentario: 'La resina quedó perfecta, no se distingue del diente natural. El color es idéntico. El procedimiento fue rápido y sin molestias.',
                fecha: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
            },
            {
                id_paciente: roberto._id,
                id_tratamiento: tResina._id,
                calificacion: 4,
                comentario: 'Buen trabajo, quedé satisfecho. Sentí algo de sensibilidad los primeros días pero pasó. El resultado estético es muy bueno.',
                fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            },
        ]);

        console.log('⭐ Reseñas creadas');

        // ── RESUMEN ───────────────────────────────────────────────────────────

        console.log('\n════════════════════════════════════════');
        console.log('✅ SEEDER COMPLETADO EXITOSAMENTE');
        console.log('════════════════════════════════════════');
        console.log('\n📌 CREDENCIALES DE ACCESO:');
        console.log('  Admin:    admin@dental.com       / admin123');
        console.log('  Cliente1: josecarlos@gmail.com   / cliente123');
        console.log('  Cliente2: mfernanda@gmail.com    / cliente123');
        console.log('  Cliente3: diegoalejandro@gmail.com / cliente123');
        console.log('  Cliente4: sofia.mendoza@gmail.com / cliente123');
        console.log('  Cliente5: roberto.sanchez@gmail.com / cliente123');
        console.log('\n📌 IMÁGENES REQUERIDAS EN public/Imagenes/:');
        console.log('  - consulta-general.jpg');
        console.log('  - limpieza-dental.jpg');
        console.log('  - ortodoncia-metalica.jpg');
        console.log('  - ortodoncia-zafiro.jpg');
        console.log('  - extraccion-simple.jpg');
        console.log('  - extraccion-juicio.jpg');
        console.log('  - blanqueamiento.jpg');
        console.log('  - resina-dental.jpg');
        console.log('  - endodoncia.jpg');
        console.log('  - corona-porcelana.jpg');
        console.log('\n💡 TIP: Si no tienes las imágenes, renombra cualquier');
        console.log('   foto dental con esos nombres exactos.');
        console.log('════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el seeder:', error);
        process.exit(1);
    }
};

seed();