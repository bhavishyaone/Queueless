import express from 'express';
import { createCounter, getAllCounters } from './counter.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { USER_ROLES } from '../../utils/constants.js';

const router = express.Router();

router.get("/", requireAuth, getAllCounters);
router.post("/", requireAuth, requireRole(USER_ROLES.ADMIN), createCounter);

export default router;
