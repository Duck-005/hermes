import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Hash, User, Settings, Plus, LogOut, X } from 'lucide-react';
import { setActiveRoom, setActivePrivateUser } from '../store/chatSlice';
import { logout } from '../store/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { rooms, users, onlineUsers, activeRoom, activePrivateUser } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const dmUsers = users.filter(({ username }) => username !== user?.username);
    const query = searchValue.trim().toLowerCase();
    const filteredDmUsers = query
        ? dmUsers.filter(({ username }) => username.toLowerCase().includes(query))
        : dmUsers;

    const handleSelectPrivateUser = (username) => {
        dispatch(setActivePrivateUser({ username }));
        setIsPickerOpen(false);
        setSearchValue('');
    };

    return (
        <div className="relative w-64 bg-[#2b2d31] flex flex-col h-screen select-none">
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
                    <div className="px-2 mb-1 flex items-center justify-between text-[#b5bac1] text-xs font-bold uppercase">
                        <span>Direct Messages</span>
                        <button
                            type="button"
                            onClick={() => setIsPickerOpen(true)}
                            className="rounded p-1 text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-white"
                            aria-label="Start direct message"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    {dmUsers.map(({ username }) => (
                        <div
                            key={username}
                            onClick={() => handleSelectPrivateUser(username)}
                            className={`flex items-center px-2 py-1.5 rounded transition-colors cursor-pointer mb-0.5 group ${
                                activePrivateUser?.username === username ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'
                            }`}
                        >
                            <div className="relative mr-2.5">
                                <User size={24} className="p-1 bg-[#4e5058] rounded-full text-[#dbdee1]" />
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#2b2d31] ${
                                    onlineUsers.includes(username) ? 'bg-[#23a559]' : 'bg-[#80848e]'
                                }`}></div>
                            </div>
                            <span className="text-sm truncate">{username}</span>
                        </div>
                    ))}
                    {dmUsers.length === 0 && (
                        <p className="px-2 py-2 text-xs text-[#80848e]">No other users found yet.</p>
                    )}
                </div>
            </div>

            {isPickerOpen && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-[#1e1f22] bg-[#313338] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#1e1f22] px-4 py-3">
                            <div>
                                <h2 className="text-sm font-semibold text-white">Start a conversation</h2>
                                <p className="text-xs text-[#b5bac1]">Choose any registered user.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPickerOpen(false);
                                    setSearchValue('');
                                }}
                                className="rounded p-1 text-[#b5bac1] transition-colors hover:bg-[#3f4147] hover:text-white"
                                aria-label="Close user picker"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search by username"
                                className="mb-3 w-full rounded-md border border-[#1e1f22] bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none placeholder:text-[#80848e] focus:border-[#5865f2]"
                            />

                            <div className="max-h-72 overflow-y-auto">
                                {filteredDmUsers.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-[#80848e]">No matching users.</p>
                                ) : (
                                    filteredDmUsers.map(({ username }) => (
                                        <button
                                            key={username}
                                            type="button"
                                            onClick={() => handleSelectPrivateUser(username)}
                                            className="mb-1 flex w-full items-center rounded-md px-3 py-2 text-left text-[#dbdee1] transition-colors hover:bg-[#404249]"
                                        >
                                            <div className="relative mr-3">
                                                <User size={26} className="rounded-full bg-[#4e5058] p-1 text-[#dbdee1]" />
                                                <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#313338] ${
                                                    onlineUsers.includes(username) ? 'bg-[#23a559]' : 'bg-[#80848e]'
                                                }`}></div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">{username}</div>
                                                <div className="text-xs text-[#80848e]">
                                                    {onlineUsers.includes(username) ? 'Online now' : 'Offline'}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
