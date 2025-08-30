import Inventory from '../models/Inventory.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createInventory = async (req, res) => {
    console.log(req.body);
    const newInventory = new Inventory(req.body);
    try {
      const savedInventory = await newInventory.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedInventory,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Inventory
export const updateInventory = async (req, res) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Inventory
export const deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all inventorys
export const getAllInventorys = async (req, res) => {
  try {
    const inventorys = await Inventory.find();
    res.json(inventorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In your inventory controller
export const notifySupplier = async (req, res) => {
  const { itemName, quantity, type } = req.body;

  try {
    // Find the supplier based on the item type
    const supplier = await Supplier.findOne({ type });

    if (!supplier) {
      return res.status(404).json({ message: 'No supplier found for this item type' });
    }

    // Use Nodemailer or any other email service to send the email
    await sendEmail({
      to: supplier.email,
      subject: 'Low Inventory Alert',
      text: `The quantity of ${itemName} has reached ${quantity}. Please restock soon.`
    });

    res.status(200).json({ message: 'Supplier notified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to notify supplier', error: error.message });
  }
};
