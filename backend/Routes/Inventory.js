import express from "express";
import { VerifyAdmin, VerifyUser } from "../Utils/VerifyToken.js";
import { createInventory, getAllInventorys, getInventory, deleteInventory, updateInventory, notifySupplier } from "../Controllers/InventoryController.js";

const router = express.Router()

router.post('/', createInventory,)
router.post('/:id', updateInventory)
router.delete('/:id', deleteInventory)
router.get('/:id', getInventory)
router.get('/', getAllInventorys)
// In your inventory routes file
router.post('/notify-supplier', notifySupplier);
export default router