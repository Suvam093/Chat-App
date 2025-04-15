import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import {toast} from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({     //zustand gives us this set and get function to set and get the state
    messages : [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
    },


    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isMessagesLoading: false });
      }
    },


  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket; // Get the socket from the auth store zustand functionality

    socket.on("newMessage", (newMessage) =>{
      const isMessageFromSelectedUser = newMessage.sender === selectedUser._id // Check if the message is from the selected user
      if (!isMessageFromSelectedUser) return; // If not, do nothing
      set({
        messages: [...get().messages, newMessage],
      })
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; 
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}))

