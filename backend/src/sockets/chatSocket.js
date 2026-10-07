const Message = require('../models/Message');

const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join personal user room for direct alerts & notifications
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`Socket ${socket.id} joined user room: user:${userId}`);
      }
    });

    // Join specific conversation room between therapist and client
    socket.on('join_conversation', ({ therapistId, clientId }) => {
      if (therapistId && clientId) {
        const roomId = `conv_${therapistId}_${clientId}`;
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined conversation room: ${roomId}`);
      }
    });

    // Handle incoming chat message
    socket.on('send_message', async (data) => {
      try {
        const { senderId, senderRole, receiverId, receiverRole, therapistId, clientId, message } = data;

        if (!senderId || !receiverId || !message) return;

        // Persist message to database
        const savedMessage = await Message.create({
          senderId,
          senderRole,
          receiverId,
          receiverRole,
          therapistId,
          clientId,
          message,
          readStatus: false,
        });

        const roomId = `conv_${therapistId}_${clientId}`;

        // Broadcast to conversation room and receiver personal room
        io.to(roomId).emit('receive_message', savedMessage);
        io.to(`user:${receiverId}`).emit('new_message_notification', savedMessage);
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ roomId, userName }) => {
      socket.to(roomId).emit('user_typing', { userName, isTyping: true });
    });

    socket.on('typing_stop', ({ roomId }) => {
      socket.to(roomId).emit('user_typing', { isTyping: false });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initChatSocket;
