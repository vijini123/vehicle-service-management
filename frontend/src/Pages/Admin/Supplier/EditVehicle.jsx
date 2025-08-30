import React, { useEffect, useState, useContext } from 'react';
import Toaster from '../../../Utils/Toaster';
import { reviewHeader } from '../../../Utils/TableHeaders';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import PdfGenerator from '../../../Utils/Pdfs/PdfGenerator';
import ResponseHandler from '../../../Utils/ResponseHandler';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';

export default function ReviewManage() {
  const { user, dispatch } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(user.email)
      const response = await axios.get(`${BASE_URL}/review?email=${user.email}`);
      setReviews(response.data.filter((review) => review.email === user.email));
      console.log(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
      Toaster.dismissLoadingToast();
    }
  };

  const generatePdf = () => {
    Toaster.loadingToast('Generating Pdf');
    try {
      console.log(reviews);
      PdfGenerator.generatePdf(reviews, "Reviews List", reviewHeader);
      Toaster.justToast('success', 'Creating The Pdf For You', () => {});
    } catch (error) {
      Toaster.justToast('error', 'Generation failed', () => {});
    } finally {
      Toaster.dismissLoadingToast();
    }
  };

  const handleUpdate = async (reviewId, updatedReview) => {
    try {
      console.log("kk")
      const res = await axios.put(`${BASE_URL}/review/${reviewId}`, updatedReview);
      setReviews(reviews.map(review => review._id === reviewId ? res.data.data : review));
      Toaster.justToast('success', 'Review updated successfully');
    } catch (err) {
      console.error(err);
      Toaster.justToast('error', 'Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${BASE_URL}/review/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        Toaster.justToast('success', 'Review deleted successfully');
      } catch (err) {
        console.error(err);
        Toaster.justToast('error', 'Failed to delete review');
      }
    }
  };

  return <>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <div className="body-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className='d-flex justify-content-end align-items-center mb-4'>
              <button className='btn btn-outline-dark mx-2' onClick={generatePdf}>Export</button>
              <button className='btn text-white' style={{backgroundColor:'#1681e5'}} onClick={() => {
                  navigate(`/contact`);
              }}>Add New</button>
          </div>
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100 shadow-sm">
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Car Type</th>
                        <th>Service Date</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => (
                        <tr key={review._id}>
                          <td>{review.name}</td>
                          <td>{review.email}</td>
                          <td>{review.carType}</td>
                          <td>{new Date(review.serviceDate).toLocaleDateString()}</td>
                          <td>{review.message}</td>
                          <td>
                            <Button variant="primary" onClick={() => handleUpdate(review._id, review)} className="me-2">
                              Update
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(review._id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
}