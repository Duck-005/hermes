import React, { useState } from 'react';
import { PlusCircle, Gift, Sticker, Smile } from 'lucide-react';

const MessageInput = ({ onSendMessage, placeholder }) => {
    const [message, setMessage] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
                onSendMessage(message);
                setMessage('');
            }
        }
    };

    return (
        <div className="px-4 pb-6 mt-auto">
            <div className="bg-[#383a40] rounded-lg p-2.5 flex items-center gap-4">
                <button className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors">
                    <PlusCircle size={24} />
                </button>
                
                <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${placeholder}`}
                    className="flex-1 bg-transparent text-white border-none focus:ring-0 outline-none resize-none text-[15px] custom-scrollbar max-h-36"
                />

                <div className="flex items-center gap-3 text-[#b5bac1]">
                    <button className="hover:text-[#dbdee1] transition-colors"><Gift size={24} /></button>
                    <button className="hover:text-[#dbdee1] transition-colors"><Sticker size={24} /></button>
                    <button className="hover:text-[#dbdee1] transition-colors"><Smile size={24} /></button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
