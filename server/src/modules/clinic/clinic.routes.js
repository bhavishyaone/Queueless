import express from 'express';
import { getClinicDetails, updateClinicDetails } from './clinic.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { USER_ROLES } from '../../utils/constants.js';

const router = express.Router();

router.get("/", getClinicDetails);
router.patch("/", requireAuth, requireRole(USER_ROLES.ADMIN), updateClinicDetails);

export default router;

export default router;
