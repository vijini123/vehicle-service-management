import axios from "axios";
import BaseService from "../Base/BaseService";

class ReviewService {
    constructor() {
        BaseService.getBaseURL();
        this.GET_REVIEW = "review/:id";
        this.GET_ALL_EREVIEWS = "review/";
        this.UPDATE_REVIEW = "review/:id";
        this.DELETE_REVIEW = "review/:id";
    }

    getAllReviews(email) {
        let data = {
            email
        };
        return axios.post(this.GET_ALL_EREVIEWS, data, BaseService.getHeader());
    }

    getReview(id) {
        let data = {
            id: id
        };
        return axios.post(this.GET_REVIEW, data, BaseService.getHeader());
    }

    updateReview(id, input) {
        let data = {
            id: id,
            email: input.email,
            name: input.name,
            carType: input.carType,
            serviceDate: input.serviceDate,
            message: input.message
        };
        return axios.put(this.UPDATE_REVIEW, data, BaseService.getHeader());
    }

    deleteReview(id) {
        let data = {
            id: id
        };
        return axios.delete(this.DELETE_REVIEW, { ...BaseService.getHeader(), data: data });
    }
}

export default ReviewService = new ReviewService();
