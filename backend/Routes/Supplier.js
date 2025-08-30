import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { createSupplier, getAllSuppliers, getSupplier, deleteSupplier, updateSupplier,getSupplierByType } from "../Controllers/SupplierController.js";

const router = express.Router()

router.post('/', createSupplier,)
router.post('/:id', updateSupplier)
router.delete('/:id', deleteSupplier)
router.get('/:id', getSupplier)
router.get('/', getAllSuppliers)
router.get('/type/:type', getSupplierByType)

export default router