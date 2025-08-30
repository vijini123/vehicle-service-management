import express from "express";
import {getReviewCount, createReview, updateReview, deleteReview, getReview, getAllReviews } from "../Controllers/ReviewsController.js";
import { VerifyUser, VerifyToken } from "../Utils/VerifyToken.js";

const router = express.Router()

router.post('/', createReview,)
router.post('/:id', updateReview)
router.delete('/:id', deleteReview)
router.get('/:id', getReview)
router.get('/', getAllReviews)
router.get('/count', getReviewCount);

export default router