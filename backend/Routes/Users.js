import express from 'express';
import { updateUser, deleteUser, getAllUser } from '../Controllers/UserController.js';
import { VerifyUser } from '../Utils/VerifyToken.js';

const router = express.Router();

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id',  deleteUser);

// get single user
router.get('/:id');

// get all user
router.get('/', getAllUser);

export default router