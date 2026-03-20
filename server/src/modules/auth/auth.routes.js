import express from 'express'
import { setupAdmin, login, getAllStaff } from './auth.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { requireRole } from '../../middleware/role.middleware.js'
import { USER_ROLES } from '../../utils/constants.js'

const router = express.Router()

router.post("/setupAdmin", setupAdmin)
router.post("/login", login)
router.get("/staff", requireAuth, requireRole(USER_ROLES.ADMIN), getAllStaff)

export default router;