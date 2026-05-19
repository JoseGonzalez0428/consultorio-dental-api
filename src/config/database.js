const mongoose = require('mongoose');

const connectDB = () => {
    const connstring = process.env.MONGO_STRING;
    const dbName = process.env.DB_NAME;

    mongoose.connect(connstring, {
        dbName: dbName
    }).then(() => {
        console.log('Conexión exitosa a la base de datos');
    }).catch((error) => {
        console.log('Error de conexión con la base de datos');
        console.log(error);
    });
};

module.exports = connectDB;