// config/socket.js
const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server, {
        cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
    });
    io.on('connection', (socket) => {
        console.log(`Usuario conectado a Socket.io a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}`);
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado a las ${new Date().toLocaleString('es-MX', { timeZone: 'America/Chicago' })}`);
        });
    });
    return io;
};