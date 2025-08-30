import Review from '../models/Review.js';
import { VerifyUser } from '../Utils/VerifyToken.js';

export const createReview = async (req, res) => {
    console.log(req.body);
    const newReview = new Review(req.body);
    try {
      const savedReview = await newReview.save();
      res.status(201).json({
        success: true,
        message: "Successfully created",
        data: savedReview,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single review
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewCount = async (req, res) => {
  try {
    const reviewCount = await Review.countDocuments()
    res.status(200).json({
      success: true,
      data: reviewCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review count',
    });
  }
};
