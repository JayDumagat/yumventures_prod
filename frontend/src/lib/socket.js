
import { io } from "socket.io-client";

const BASE_URL = (import.meta.env.VITE_SOCKET_URL || "").replace(/\/$/, "") || undefined;

export const socket = io(BASE_URL, {
    transports: ["websocket"],
    withCredentials: true,
    path: "/socket.io",
    autoConnect: true,
    reconnection: true,
});
