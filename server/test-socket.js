import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

socket.on("queue:updated", () => {
  console.log(" Queue updated event received");
});
