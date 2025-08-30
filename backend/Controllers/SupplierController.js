import Supplier from '../models/Supplier.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createSupplier = async (req, res) => {
    console.log(req.body);
    const newSupplier = new Supplier(req.body);
    try {
      const savedSupplier = await newSupplier.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedSupplier,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Supplier
export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Supplier
export const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Supplier
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all Suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get supplier by type
export const getSupplierByType = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ type: req.params.type });
    if (!supplier) {
      return res.status(404).json({ message: 'No supplier found for this type' });
    }
    res.json({ email: supplier.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};