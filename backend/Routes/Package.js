import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { getPackageCount, createPackage, getAllPackages, getPackage, deletePackage, updatePackage } from "../Controllers/PackageController.js";

const router = express.Router()

router.post('/', createPackage,)
router.post('/:id', updatePackage)
router.delete('/:id', deletePackage)
router.get('/:id', getPackage)
router.get('/', getAllPackages)
router.get('/count', getPackageCount);

export default router