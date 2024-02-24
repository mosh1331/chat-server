// socketHandlers.js

const Message = require('../models/message');

function handleConnection(socket,io) {
  console.log('User connected:', socket.id);

  // Listen for incoming chat messages
  socket.on('send_message', (data) => {
    console.log('Received message:', data);

    // Save the message to MongoDB
    const message = new Message({ user: data.user, text: data.message });
    message.save();

    // Broadcast the message to all connected clients
    let newData = { ...data, timestamp: message.timestamp };
    io.emit('receive_message', newData);
  });

  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });

  // ... other event handlers
}

module.exports = handleConnection;
