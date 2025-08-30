import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { getVehicleCount, createVehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle } from "../Controllers/VehicleController.js";

const router = express.Router()

router.post('/', createVehicle,)
router.post('/:id', updateVehicle)
router.delete('/:id', deleteVehicle)
router.get('/:id', getVehicle)
router.get('/', getAllVehicles)
router.get('/count', getVehicleCount);

export default router