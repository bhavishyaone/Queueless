import express from 'express'
const app = express();
import testserverroutes from './routes/testserver.routes.js'
app.use("/",testserverroutes)
export default app;