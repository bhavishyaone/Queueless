import express, { Router } from 'express'
import {createTokenHandler,serveNextHandler,completeTokenHandler,skipTokenHandler,getLiveQueueHandler,getTokenHandler,getHistoryQueueHandler,resetQueueHandler,getQueueStatsHandler,searchTokenNumberHandler,bulkCancelTokensHandler} from './queue.controller.js'

import {requireAuth} from '../../middleware/auth.middleware.js'
import {requireRole} from '../../middleware/role.middleware.js'
import  {USER_ROLES}  from '../../utils/constants.js'

const router = express.Router()

router.get("/live",getLiveQueueHandler);
router.get("/history", requireAuth, requireRole(USER_ROLES.STAFF), getHistoryQueueHandler);
router.get("/stats", requireAuth, getQueueStatsHandler);
router.get("/search/:tokenNumber", requireAuth, searchTokenNumberHandler);

router.patch("/bulk-cancel", requireAuth, requireRole(USER_ROLES.ADMIN), bulkCancelTokensHandler);
router.patch("/reset", requireAuth, requireRole(USER_ROLES.ADMIN), resetQueueHandler);

router.get("/:id", requireAuth, getTokenHandler);

router.post("/",requireAuth,requireRole(USER_ROLES.STAFF),createTokenHandler)

router.post("/serve",requireAuth,requireRole(USER_ROLES.STAFF),serveNextHandler)

router.patch("/:id/complete",requireAuth,requireRole(USER_ROLES.STAFF),completeTokenHandler)

router.patch("/:id/skip",requireAuth,requireRole(USER_ROLES.STAFF),skipTokenHandler);

export default router;
