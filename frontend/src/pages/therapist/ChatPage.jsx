import React, { useState, useEffect, useRef } from 'react';
import { clientApi, messageApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { MessageSquare, Send, User, Check, CheckCheck } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    clientApi.getClients().then((res) => {
      if (res.data?.success && res.data.clients.length > 0) {
        setClients(res.data.clients);
        setSelectedClient(res.data.clients[0]);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedClient) return;

    // Fetch conversation history
    messageApi.getMessages(selectedClient._id).then((res) => {
      if (res.data?.success) {
        setMessages(res.data.messages);
      }
    });

    // Join conversation room
    if (socket && user) {
      socket.emit('join_conversation', {
        therapistId: user.id,
        clientId: selectedClient._id,
      });
    }

    messageApi.markAsRead(selectedClient._id).catch(() => {});
  }, [selectedClient, socket, user]);

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === selectedClient?._id && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === selectedClient?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, selectedClient, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedClient) return;

    const msgPayload = {
      senderId: user.id,
      senderRole: 'therapist',
      receiverId: selectedClient._id,
      receiverRole: 'client',
      therapistId: user.id,
      clientId: selectedClient._id,
      message: text.trim(),
    };

    // Emit via socket for instant broadcast
    if (socket) {
      socket.emit('send_message', msgPayload);
    } else {
      // Fallback via REST
      await messageApi.sendMessage(msgPayload);
    }

    setText('');
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Loading chat workspace...</div>;
  }

  return (
    <div className="h-[calc(85vh-4rem)] bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden flex flex-col md:flex-row">
      {/* Clients Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600" />
          <span>Client Conversations</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {clients.map((c) => {
            const isSelected = selectedClient?._id === c._id;
            return (
              <button
                key={c._id}
                onClick={() => setSelectedClient(c)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition ${
                  isSelected
                    ? 'bg-white shadow-sm border border-slate-200/80'
                    : 'hover:bg-slate-100/70 text-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-xs text-slate-900 block truncate">{c.name}</span>
                  <span className="text-[11px] text-slate-400 truncate block">{c.email}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedClient.name}</h3>
                  <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Encrypted Therapist-Client Channel
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map((m, idx) => {
                  const isMine = m.senderRole === 'therapist';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-brand-600 text-white rounded-tr-none shadow-sm'
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
                  No messages yet. Send a welcoming message to {selectedClient.name}.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex items-center gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Type message to ${selectedClient.name}...`}
                className="flex-1 p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a client on the left to begin messaging.
          </div>
        )}
      </div>
    </div>
  );
}
