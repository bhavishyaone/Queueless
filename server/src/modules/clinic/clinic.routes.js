import express from 'express';
import { getClinicDetails } from './clinic.controller.js';

const router = express.Router();

router.get("/", getClinicDetails);

export default router;
