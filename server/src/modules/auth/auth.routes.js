import express from 'express'
import { setupAdmin,login } from './auth.controller.js'

const router = express.Router()

router.post("/setupAdmin",setupAdmin)
router.post("/login",login)
export default router;