import express from 'express';
import { createRequest, getRequests, updateRequest, deleteRequest } from '../Controllers/ServiceHelpRequestController.js';
import { VerifyUser } from '../Utils/VerifyToken.js';

const router = express.Router();

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
