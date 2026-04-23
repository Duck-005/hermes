import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import websocketService from '../services/websocketService';
import api from '../services/api';
import { setRooms, setOnlineUsers, addMessage, setMessages } from '../store/chatSlice';

const MainLayout = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
    const { activeRoom, activePrivateUser } = useSelector((state) => state.chat);

    useEffect(() => {
        // Fetch initial rooms
        const fetchData = async () => {
            try {
                const roomsRes = await api.get('/api/v1/rooms');
                dispatch(setRooms(roomsRes.data));
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
            }
        };

        fetchData();

        // Connect WebSocket
        websocketService.connect(token, () => {
            // Global subscriptions
            websocketService.subscribe('/topic/public', (msg) => {
                dispatch(addMessage(msg));
            });

            websocketService.subscribe('/topic/public.presence', (users) => {
                dispatch(setOnlineUsers(users));
            });

            websocketService.subscribe('/user/queue/messages', (msg) => {
                dispatch(addMessage(msg));
            });

            websocketService.subscribe('/user/queue/status', (status) => {
                dispatch(updateMessageStatus({ 
                    messageId: status.messageId, 
                    status: status.status 
                }));
            });
        });

        return () => websocketService.disconnect();
    }, [token, dispatch]);

    // Handle Active Room Subscription
    useEffect(() => {
        if (activeRoom && websocketService.isConnected()) {
            websocketService.subscribe(`/topic/room.${activeRoom.id}`, (msg) => {
                dispatch(addMessage(msg));
            });
            
            // Fetch history
            api.get(`/api/v1/messages/room/${activeRoom.id}`).then(res => {
                dispatch(setMessages(res.data.content.reverse()));
            });
        }
    }, [activeRoom, dispatch]);

    // Handle Private Chat History
    useEffect(() => {
        if (activePrivateUser) {
            api.get(`/api/v1/messages/private/${activePrivateUser.username}`).then(res => {
                dispatch(setMessages(res.data.content.reverse()));
            });
        }
    }, [activePrivateUser, dispatch]);

    return (
        <div className="flex h-screen w-full bg-[#313338] overflow-hidden">
            <Sidebar />
            <ChatWindow />
        </div>
    );
};

export default MainLayout;
