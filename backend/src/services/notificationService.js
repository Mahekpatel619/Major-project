const Notification = require('../models/Notification');
const mailer = require('../config/mailer');

class NotificationService {
  /**
   * Dispatch an in-app notification and optional email
   */
  async notify({ recipientId, recipientRole, type, title, message, link, email, emailSubject, io }) {
    try {
      // 1. Create DB notification
      const notification = await Notification.create({
        recipientId,
        recipientRole,
        type: type || 'General',
        title,
        message,
        link: link || '',
      });

      // 2. Real-time emit if Socket.io instance provided
      if (io) {
        io.to(`user:${recipientId}`).emit('new_notification', notification);
      }

      // 3. Send email if email address provided
      if (email) {
        await mailer.sendMail({
          from: `"${process.env.FROM_NAME || 'UNFAZED Platform'}" <${process.env.FROM_EMAIL || 'notifications@unfazed.in'}>`,
          to: email,
          subject: emailSubject || title,
          text: message,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #2c4585; margin-top: 0;">UNFAZED Practice Alert</h2>
              <h3>${title}</h3>
              <p style="color: #475569; font-size: 16px; line-height: 1.5;">${message}</p>
              ${link ? `<a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #3457a4; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 12px;">View Details</a>` : ''}
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin-top: 30px;" />
              <p style="color: #94a3b8; font-size: 12px;">Confidential therapy practice management communication.</p>
            </div>
          `,
        });
      }

      return notification;
    } catch (err) {
      console.error('Notification dispatch error:', err);
    }
  }
}

module.exports = new NotificationService();
