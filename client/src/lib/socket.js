import { io } from "socket.io-client";

const BACKEND_URL = "https://localhost:5000";
const socket = io(BACKEND_URL);

export default socket;
