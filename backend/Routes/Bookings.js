import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { getBookingCount, createBooking, getAllBookings, getBooking, deleteBooking, updateBooking } from "../Controllers/BookingController.js";

const router = express.Router()

router.post('/', createBooking,)
router.post('/:id', updateBooking)
router.delete('/:id', deleteBooking)
router.get('/:id', getBooking)
router.get('/', getAllBookings)
router.get('/count', getBookingCount);

export default router