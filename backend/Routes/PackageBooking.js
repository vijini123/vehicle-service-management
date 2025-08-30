import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { getPackageBookingCount, createPackageBooking, getAllPackageBookings, getPackageBooking, deletePackageBooking, updatePackageBooking } from "../Controllers/PackageBookingController.js";

const router = express.Router()

router.post('/', createPackageBooking,)
router.post('/:id', updatePackageBooking)
router.delete('/:id', deletePackageBooking)
router.get('/:id', getPackageBooking)
router.get('/', getAllPackageBookings)
router.get('/count', getPackageBookingCount);

export default router