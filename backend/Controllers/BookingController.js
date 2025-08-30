import Booking from '../models/Booking.js'
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createBooking = async (req, res) => {
    console.log(req.body);
    const newBooking = new Booking(req.body);
    try {
      const savedBooking = await newBooking.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedBooking,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a Booking
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Booking
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single Booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingCount = async (req, res) => {
  try {
    const bookingCount = await Booking.length();
    res.status(200).json({
      success: true,
      data: bookingCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking count',
    });
  }
}
