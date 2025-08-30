import Vehicle from '../models/Vehicle.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createVehicle = async (req, res) => {
    console.log(req.body);
    const newVehicle = new Vehicle(req.body);
    try {
      const savedVehicle = await newVehicle.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedVehicle,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Vehicle
export const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Vehicle
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleCount = async (req, res) => {
    try {
      const vehicleCount = await Vehicle.countDocuments()
      res.status(200).json({
        success: true,
        data: vehicleCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Vehicle count',
      });
    }
  };
  