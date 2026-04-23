import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Hash, User, Phone, Video, Pin, Users, Search, Inbox, HelpCircle, Check, CheckCheck } from 'lucide-react';
import MessageInput from './MessageInput';
import websocketService from '../services/websocketService';
import { updateMessageStatus } from '../store/chatSlice';

const ChatWindow = () => {
    const dispatch = useDispatch();
    const { activeRoom, activePrivateUser, messages } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send Read Receipts
    useEffect(() => {
        const unreadMessages = messages.filter(
            m => m.sender !== user.username && m.status !== 'READ'
        );

        unreadMessages.forEach(msg => {
            websocketService.sendMessage('/app/chat.updateStatus', {
                messageId: msg.id,
                status: 'READ',
                recipient: msg.sender // Original sender who should get the update
            });
            // Update locally to avoid repeated sends
            dispatch(updateMessageStatus({ messageId: msg.id, status: 'READ' }));
        });
    }, [messages, user.username, dispatch]);

    const handleSendMessage = (content) => {
        const chatMessage = {
            sender: user.username,
            content: content,
            type: 'CHAT'
        };

        if (activeRoom) {
            chatMessage.roomId = activeRoom.id;
            websocketService.sendMessage('/app/chat.groupMessage', chatMessage);
        } else if (activePrivateUser) {
            chatMessage.recipient = activePrivateUser.username;
            websocketService.sendMessage('/app/chat.privateMessage', chatMessage);
            // Instantly show msg for sender
            // Note: In a real app we might wait for a receipt or self-subscription
            // but for now let's just push it to local state if the backend doesn't echo it back
            // (Most STOMP brokers don't echo to the same session for /user destinations)
        }
    };

    if (!activeRoom && !activePrivateUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-[#b5bac1]">
                <div className="w-64 h-64 bg-[#2b2d31] rounded-full flex items-center justify-center mb-6">
                    <Hash size={120} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Chat!</h2>
                <p>Select a channel or direct message to start chatting.</p>
            </div>
        );
    }

    const title = activeRoom ? activeRoom.name : activePrivateUser.username;
    const isPrivate = !!activePrivateUser;

    return (
        <div className="flex-1 flex flex-col bg-[#313338] h-screen overflow-hidden">
            {/* Header */}
            <div className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-[#1e1f22] shrink-0">
                <div className="flex items-center gap-2">
                    {isPrivate ? (
                        <User size={24} className="text-[#80848e]" />
                    ) : (
                        <Hash size={24} className="text-[#80848e]" />
                    )}
                    <span className="font-bold text-white">{title}</span>
                </div>

                <div className="flex items-center gap-4 text-[#b5bac1]">
                    <Hash className="hover:text-white cursor-pointer" size={20} />
                    <Pin className="hover:text-white cursor-pointer" size={20} />
                    <Users className="hover:text-white cursor-pointer" size={20} />
                    <div className="bg-[#1e1f22] rounded flex items-center px-1.5 py-0.5">
                        <input type="text" placeholder="Search" className="bg-transparent text-xs p-1 outline-none w-24" />
                        <Search size={16} />
                    </div>
                    <Inbox className="hover:text-white cursor-pointer" size={20} />
                    <HelpCircle className="hover:text-white cursor-pointer" size={20} />
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#b5bac1] opacity-50">
                        <p className="text-sm italic">No messages yet. Send one to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className="flex gap-4 mb-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1">
                            <div className="mt-1">
                                <User size={40} className="p-2 bg-[#5865f2] rounded-full text-white" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white hover:underline cursor-pointer">{msg.sender}</span>
                                    <span className="text-xs text-[#b5bac1]">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    
                                    {msg.sender === user.username && (
                                        <div className="ml-1">
                                            {msg.status === 'READ' ? (
                                                <CheckCheck size={14} className="text-[#00a8fc]" />
                                            ) : (
                                                <Check size={14} className="text-[#b5bac1]" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[#dbdee1] leading-snug">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <MessageInput 
                placeholder={isPrivate ? `@${title}` : `#${title}`} 
                onSendMessage={handleSendMessage} 
            />
        </div>
    );
};

export default ChatWindow;
