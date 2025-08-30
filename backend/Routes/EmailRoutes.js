import express from 'express';
import { sendConfirmationEmail, sendLowInventoryAlert } from "../Controllers/EmailController.js";

const router = express.Router();

router.post('/send-confirmation-email', sendConfirmationEmail);
router.post('/send-low-inventory-alert', sendLowInventoryAlert);

export default router;
