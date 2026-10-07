const Homework = require('../models/Homework');
const notificationService = require('../services/notificationService');

// @desc    Get homework assignments
// @route   GET /api/homework
// @access  Private (Therapist or Client)
exports.getHomework = async (req, res, next) => {
  try {
    const { clientId } = req.query;
    let query = {};

    if (req.user.role === 'therapist') {
      query.therapistId = req.user._id;
      if (clientId) query.clientId = clientId;
    } else if (req.user.role === 'client') {
      query.clientId = req.user._id;
    }

    const homeworkList = await Homework.find(query)
      .populate('clientId', 'name email')
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: homeworkList.length, homework: homeworkList });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign homework (Therapist)
// @route   POST /api/homework
// @access  Private (Therapist)
exports.createHomework = async (req, res, next) => {
  try {
    const { clientId, title, description, dueDate, resources } = req.body;

    if (!clientId || !title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Client, title, and due date are required' });
    }

    const homework = await Homework.create({
      therapistId: req.user._id,
      clientId,
      title,
      description: description || '',
      dueDate,
      resources: resources || [],
      status: 'Pending',
    });

    await notificationService.notify({
      recipientId: clientId,
      recipientRole: 'client',
      type: 'HomeworkAssigned',
      title: 'New Reflective Homework Assigned',
      message: `Your therapist assigned: "${title}". Due date: ${dueDate}.`,
      link: `/portal/homework`,
    });

    res.status(201).json({ success: true, homework });
  } catch (err) {
    next(err);
  }
};

// @desc    Update homework status / complete assignment
// @route   PUT /api/homework/:id
// @access  Private
exports.updateHomework = async (req, res, next) => {
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework assignment not found' });
    }

    // Permission check
    if (req.user.role === 'client') {
      if (homework.clientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized access' });
      }
      // Client can update status and reflection notes
      if (req.body.status) homework.status = req.body.status;
      if (req.body.clientReflection !== undefined) homework.clientReflection = req.body.clientReflection;
      if (req.body.status === 'Completed') homework.completedAt = new Date();
    } else if (req.user.role === 'therapist') {
      if (homework.therapistId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized access' });
      }
      Object.assign(homework, req.body);
    }

    await homework.save();

    res.json({ success: true, homework });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete homework assignment
// @route   DELETE /api/homework/:id
// @access  Private (Therapist)
exports.deleteHomework = async (req, res, next) => {
  try {
    const homework = await Homework.findOneAndDelete({ _id: req.params.id, therapistId: req.user._id });
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework assignment not found' });
    }
    res.json({ success: true, message: 'Homework removed' });
  } catch (err) {
    next(err);
  }
};
