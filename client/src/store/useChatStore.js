import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isFriend: false,
  friendRequestSent: false,
  friendRequestReceived: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/chat/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching users"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get(`/chat/${userId}`);
      console.log(res.data);

      set({ messages: [...res.data, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching messages"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post("/chat/send/" + selectedUser._id, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending message"
      );
    }
  },
  subscribeToMessages: async () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectUser =
        newMessage.sender._id === selectedUser._id;
      if (!isMessageSendFromSelectUser) return;
      const { messages } = get();
      set({ messages: [...messages, newMessage] });
    });
  },
  unsubscribeFromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (user) => {
    console.log(user);
    set({ selectedUser: user });
  },
  setIsFriend: (isFriend) => {
    set({ isFriend });
  },
  setFriendRequestSent: (friendRequestSent) => {
    set({ friendRequestSent });
  },
  setFriendRequestReceived: (friendRequestReceived) => {
    set({ friendRequestReceived });
  },
  addFriend: async (friendId) => {
    try {
      const res = await api.post("/friend/add/" + friendId);
      toast.success(res.data.message || "Friend added successfully");
      const socket = useAuthStore.getState().socket;
      socket.emit("friendRequest", { friendId });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while adding friend"
      );
    }
  },
  acceptFriendRequest: async (friendId) => {
    try {
      const res = await api.post("/friend/accept/" + friendId);
      toast.success(res.data.message || "Friend request accepted");

      useAuthStore.getState().getFriends();
      const socket = useAuthStore.getState().socket;
      socket.emit("friendRequestAccepted", { friendId });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while accepting friend request"
      );
    }
  },
}));
