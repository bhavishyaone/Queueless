import express from 'express'
import testserverroutes from './routes/testserver.routes.js'
import cors from 'cors'
const app = express();
app.use(cors());
app.use(express.json());
app.use("/",testserverroutes)
export default app;