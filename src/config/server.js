const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.authPath = '/api/auth';
        this.usuariosPath = '/api/usuarios';
        this.tratamientosPath = '/api/tratamientos';
        this.citasPath = '/api/citas';
        this.horariosPath = '/api/horarios';
        this.reportesPath = '/api/reportes';

        this.app.use(express.json());
        this.app.use(cors());

        this.app.use('/imagenes', express.static(path.join(__dirname, '../../..', 'consultorio-dental/public/Imagenes')));

        this.routes();
        connectDB();
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));
        this.app.use(this.tratamientosPath, require('../routes/tratamientos.routes'));
        this.app.use(this.citasPath, require('../routes/citas.routes'));
        this.app.use(this.horariosPath, require('../routes/horarios.routes'));
        this.app.use(this.reportesPath, require('../routes/reportes.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;