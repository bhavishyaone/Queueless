import express from 'express'
import testserverroutes from './routes/testserver.routes.js'
import cors from 'cors'
import errorhandler from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use("/",testserverroutes)
app.use("/auth",authRoutes)
app.use(errorhandler);
export default app;