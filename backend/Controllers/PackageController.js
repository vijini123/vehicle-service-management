import Package from '../models/Package.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createPackage = async (req, res) => {
    console.log(req.body);
    const newPackage = new Package(req.body);
    try {
      const savedPackage = await newPackage.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedPackage,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Package
export const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Package
export const deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Package
export const getPackage = async (req, res) => {
  try {
    const packagea = await Package.findById(req.params.id);
    if (!packagea) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(packagea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all Packages
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackageCount = async (req, res) => {
  try {
    const packageCount = await Package.length();
    res.status(200).json({
      success: true,
      data: packageCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Package count',
    });
  }
}
