const Message = require('../models/Message');

// @desc    Get message history between current user and target user
// @route   GET /api/messages/:otherUserId
// @access  Private (Therapist or Client)
exports.getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message via REST (in addition to Socket.io)
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message, therapistId, clientId } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Receiver and message content required' });
    }

    const tId = therapistId || (req.user.role === 'therapist' ? req.user._id : req.user.therapistId);
    const cId = clientId || (req.user.role === 'client' ? req.user._id : receiverId);

    const newMsg = await Message.create({
      senderId: req.user._id,
      senderRole: req.user.role,
      receiverId,
      receiverRole: req.user.role === 'therapist' ? 'client' : 'therapist',
      therapistId: tId,
      clientId: cId,
      message,
      readStatus: false,
    });

    res.status(201).json({ success: true, message: newMsg });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/messages/read/:otherUserId
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.otherUserId;

    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, readStatus: false },
      { readStatus: true, readAt: new Date() }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
};
