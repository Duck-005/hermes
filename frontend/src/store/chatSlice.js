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
    setPrivateChats: (state, action) => {
      state.privateChats = action.payload;
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

      const existingChatIndex = state.privateChats.findIndex((chat) => chat.username === username);
      if (existingChatIndex >= 0) {
        const [existingChat] = state.privateChats.splice(existingChatIndex, 1);
        state.privateChats.unshift(existingChat);
      } else {
        state.privateChats.unshift({ username });
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
  setPrivateChats,
  setActiveRoom, 
  setActivePrivateUser, 
  setMessages, 
  addMessage, 
  addPrivateChat,
  setOnlineUsers,
  updateMessageStatus 
} = chatSlice.actions;
export default chatSlice.reducer;
