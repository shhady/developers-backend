let userSocketMap = {}; // Maps userId to an array of socket IDs

// Existing WebSocket connection logic...

export const emitTokenUpdateToUserSockets = (userId, newToken) => {
    const sockets = userSocketMap[userId] || [];
    sockets.forEach(socketId => {
        io.to(socketId).emit('updateToken', { token: newToken });
    });
};

// Export this function to use in your login controller
// module.exports = { emitTokenUpdateToUserSockets, /* other exports */ };