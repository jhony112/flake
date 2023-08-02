const io = require('socket.io')(5902);
const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'localhost';
const redisClient = new Redis({ host: REDIS_URL });

// eslint-disable-next-line no-unused-vars
io.on('connection', (socket) => {
    console.log('User connected');

    // // Subscribe to a Redis channel when a user connects
    // redisClient.subscribe('errors');
    //
    // // Listen for messages on the Redis channel
    // redisClient.on('message', (channel, message) => {
    //     console.log(`Received message on channel ${channel}: ${message}`);
    //
    //     // Send the message to all connected clients
    //
    // });
    //
    // socket.on('disconnect', () => {
    //     console.log('User disconnected');
    //
    //     // Unsubscribe from the Redis channel when a user disconnects
    //     redisClient.unsubscribe('myChannel');
    // });
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
    redisClient.subscribe('errors');
});

redisClient.on('error', (err) => {
    console.error('Redis error', err);
});

redisClient.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);

    // Send the message to all connected clients
    io.emit('myEvent', message);
});
