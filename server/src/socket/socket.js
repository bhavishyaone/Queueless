import {Server} from 'socket.io'

let io = null;

export const initSocket = (httpServer)=>{
    io = new Server(httpServer,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection",(socket)=>{
        console.log("Client Connected",socket.id)

        socket.on("disconnect",()=>{
        console.log("Client disconnected",socket.id)

        })
    })

    return io
}

export const getio = ()=>{
    if(!io){
        throw new Error("Socket.io is not initialised")
    }
    return io
};