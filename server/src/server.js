import app from "./app.js";
import ENV  from "./config/env.js";
import "./config/db.js";
import { initSocket } from "./socket/socket.js";
import http from 'http'

const startserver = ()=>{
    const server = http.createServer(app)
    initSocket(server)

    app.listen(ENV.PORT,console.log(`Server is running on port ${ENV.PORT}`))
}
startserver();

