import React from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const MainLayout = () => {
    return (
        <div className="flex h-screen w-full bg-[#313338] overflow-hidden">
            <Sidebar />
            <ChatWindow />
        </div>
    );
};

export default MainLayout;
