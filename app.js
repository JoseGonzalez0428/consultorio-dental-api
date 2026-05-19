const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const Server = require('./src/config/server');
const server = new Server();
server.listen();