import { useDispatch, useSelector } from 'react-redux';
import { Hash, User, Settings, Plus, LogOut } from 'lucide-react';
import { setActiveRoom, setActivePrivateUser } from '../store/chatSlice';
import { logout } from '../store/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { rooms, onlineUsers, activeRoom, activePrivateUser } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="w-64 bg-[#2b2d31] flex flex-col h-screen select-none">
            {/* Server/Header */}
            <div className="h-12 px-4 flex items-center shadow-md font-bold text-white border-b border-[#1e1f22]">
                Chat Server
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pt-4">
                {/* Channels/Rooms */}
                <div className="mb-6">
                    <div className="px-2 mb-1 flex items-center justify-between text-[#b5bac1] hover:text-white transition-colors cursor-pointer group">
                        <span className="text-xs font-bold uppercase">Channels</span>
                        <Plus size={14} />
                    </div>
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => dispatch(setActiveRoom(room))}
                            className={`flex items-center px-2 py-1.5 rounded transition-colors cursor-pointer mb-0.5 group ${
                                activeRoom?.id === room.id ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'
                            }`}
                        >
                            <Hash size={20} className="mr-1.5 text-[#80848e]" />
                            <span className="text-sm truncate">{room.name}</span>
                        </div>
                    ))}
                </div>

                {/* Direct Messages */}
                <div>
                    <div className="px-2 mb-1 text-[#b5bac1] text-xs font-bold uppercase">Direct Messages</div>
                    {onlineUsers.filter(u => u !== user?.username).map((username) => (
                        <div
                            key={username}
                            onClick={() => dispatch(setActivePrivateUser({ username }))}
                            className={`flex items-center px-2 py-1.5 rounded transition-colors cursor-pointer mb-0.5 group ${
                                activePrivateUser?.username === username ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'
                            }`}
                        >
                            <div className="relative mr-2.5">
                                <User size={24} className="p-1 bg-[#4e5058] rounded-full text-[#dbdee1]" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23a559] rounded-full border-2 border-[#2b2d31]"></div>
                            </div>
                            <span className="text-sm truncate">{username}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Profile Footer */}
            <div className="h-14 bg-[#232428] px-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 p-1 hover:bg-[#3f4147] rounded cursor-pointer transition-colors group">
                    <div className="relative">
                        <User size={32} className="p-1.5 bg-[#5865f2] rounded-full text-white" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] rounded-full border-2 border-[#232428]"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate leading-tight">{user?.username}</span>
                        <span className="text-xs text-[#b5bac1] truncate italic">#online</span>
                    </div>
                </div>
                <div className="flex gap-1 text-[#b5bac1]">
                    <button className="p-1.5 hover:bg-[#3f4147] hover:text-white rounded transition-colors">
                        <Settings size={20} />
                    </button>
                    <button 
                        onClick={() => dispatch(logout())}
                        className="p-1.5 hover:bg-[#f23f43] hover:text-white rounded transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
