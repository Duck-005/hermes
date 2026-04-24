import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    rooms: [],
    privateChats: [],
    activeRoom: null,
    activePrivateUser: null,
    messages: [],
    onlineUsers: [],
  },
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
      state.activePrivateUser = null;
      state.messages = []; // Clear for loading new room history
    },
    setActivePrivateUser: (state, action) => {
      state.activePrivateUser = action.payload;
      state.activeRoom = null;
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addPrivateChat: (state, action) => {
      const username = action.payload?.username;
      if (!username) {
        return;
      }

      const existingChat = state.privateChats.find((chat) => chat.username === username);
      if (!existingChat) {
        state.privateChats.push({ username });
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find(m => m.id === messageId);
      if (message) {
        message.status = status;
      }
    },
  },
});

export const { 
  setRooms, 
  setActiveRoom, 
  setActivePrivateUser, 
  setMessages, 
  addMessage, 
  addPrivateChat,
  setOnlineUsers,
  updateMessageStatus 
} = chatSlice.actions;
export default chatSlice.reducer;
