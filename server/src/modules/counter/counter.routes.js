import express from 'express';
import { createCounter, getAllCounters, updateCounterStatus } from './counter.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { USER_ROLES } from '../../utils/constants.js';

const router = express.Router();

router.get("/", requireAuth, getAllCounters);
router.post("/", requireAuth, requireRole(USER_ROLES.ADMIN), createCounter);
router.patch("/:id/status", requireAuth, requireRole(USER_ROLES.ADMIN), updateCounterStatus);

export default router;
