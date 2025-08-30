import PackageBooking from '../models/PackageBooking.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createPackageBooking = async (req, res) => {
    console.log(req.body);
    const newPackageBooking = new PackageBooking(req.body);
    try {
      const savedPackageBooking = await newPackageBooking.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedPackageBooking,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a PackageBooking
export const updatePackageBooking = async (req, res) => {
  try {
    const updatedPackageBooking = await PackageBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPackageBooking) {
      return res.status(404).json({ message: 'PackageBooking not found' });
    }
    res.json(updatedPackageBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a PackageBooking
export const deletePackageBooking = async (req, res) => {
  try {
    const deletedPackageBooking = await PackageBooking.findByIdAndDelete(req.params.id);
    if (!deletedPackageBooking) {
      return res.status(404).json({ message: 'PackageBooking not found' });
    }
    res.json({ message: 'PackageBooking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single PackageBooking
export const getPackageBooking = async (req, res) => {
  try {
    const packageBooking = await PackageBooking.findById(req.params.id);
    if (!packageBooking) {
      return res.status(404).json({ message: 'PackageBooking not found' });
    }
    res.json(packageBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all PackageBookings
export const getAllPackageBookings = async (req, res) => {
  try {
    const packageBookings = await PackageBooking.find();
    res.json(packageBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackageBookingCount = async (req, res) => {
  try {
    const packageBookingCount = await PackageBooking.length();
    res.status(200).json({
      success: true,
      data: packageBookingCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package bookingCount count',
    });
  }
}
