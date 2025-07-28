import { io } from "socket.io-client";

const BACKEND_URL = "https://localhost:3001";
const socket = io(BACKEND_URL);

console.log("Socket initialized:", socket);
export default socket;
