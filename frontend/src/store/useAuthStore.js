import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import {toast} from 'react-hot-toast';
import {io} from 'socket.io-client'; 

const BAEE_URL = "http://localhost:5001"; // Replace with your backend URL

export const useAuthStore = create((set, get) => ({       //get is used to access the state of the store in specific functions
    authUser: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],             //this is for keeping track of the online users
    isCheckingAuth: true,
    socket: null,                //This state is for the users online status

    checkAuth : async() => {
        try {
            const res = await axiosInstance.get('/auth/check');

            set({
                authUser: res.data
            })
            get().connectSocket() // Call the connectSocket function after checking auth
        } catch (error) {
            console.log("Error in checking auth", error);
            set({
                authUser: null
            })
        }finally {
            set({
                isCheckingAuth: false
            })
        }

    },

    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData);

            set({ authUser: res.data });

            toast.success("Account created successfully! Please log in to continue.");

            get().connectSocket() 

        } catch (error) {
          toast.error(error.response.data.message || "Error signing up. Please try again.");
        } finally {
          set({ isSigningUp: false });
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData);
            set({ authUser: res.data });

            toast.success("Logged in successfully!");

            get().connectSocket()
            
        } catch (error) {
            toast.error(error.response.data.message || "Error logging in. Please try again.");
        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully!");
            get().disconnectSocket()
        }
        catch (error) {
            console.log(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data.authUser });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () =>{
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return; // Don't connect if not logged in or dont build a new connection if connection is already there

        const socket  = io(BAEE_URL,{
            query:{
                userId: authUser._id, // Send userId as a query parameter for updating the online users in the backend
            }
        });
        socket.connect();
        set({ socket: socket }); 

        //listening for the getOnlineUsers event from the backend
        socket.on("getOnlineUsers", (userId) => {
            set({ onlineUsers: userId });
        });
    },

    disconnectSocket: () => {
        if(get().socket.connected)  get().socket.disconnect()
    }
}));