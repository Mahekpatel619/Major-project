import React, { useState, useEffect, useRef } from 'react';
import { messageApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { MessageSquare, Send, ShieldCheck } from 'lucide-react';

export default function ClientChatPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const therapistId = user?.therapistId;

  useEffect(() => {
    if (!therapistId) return;

    messageApi.getMessages(therapistId).then((res) => {
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
      setLoading(false);
    });

    if (socket && user) {
      socket.emit('join_conversation', {
        therapistId,
        clientId: user.id,
      });
    }

    messageApi.markAsRead(therapistId).catch(() => { });
  }, [therapistId, socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === therapistId && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === therapistId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, therapistId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !therapistId) return;

    const msgPayload = {
      senderId: user.id,
      senderRole: 'client',
      receiverId: therapistId,
      receiverRole: 'therapist',
      therapistId,
      clientId: user.id,
      message: text.trim(),
    };

    if (socket) {
      socket.emit('send_message', msgPayload);
    } else {
      await messageApi.sendMessage(msgPayload);
    }

    setText('');
  };

  return (
    <div className="h-[calc(85vh-4rem)] bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
            {user?.therapistName?.charAt(0) || 'D'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">{user?.therapistName || 'Dr. Sharma'}</h3>
            <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Direct Therapist Channel
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading conversation...</div>
        ) : messages.length > 0 ? (
          messages.map((m, idx) => {
            const isMine = m.senderRole === 'client';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${isMine
                      ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}
                >
                  {m.message}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-xs text-slate-400">
            No messages yet. Send a message to your therapist.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a confidential message..."
          className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
