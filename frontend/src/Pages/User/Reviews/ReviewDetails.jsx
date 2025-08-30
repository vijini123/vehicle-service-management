import React, { useEffect, useState, useContext } from 'react';
import Toaster from '../../../Utils/Toaster';
import { reviewHeader } from '../../../Utils/TableHeaders';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import ResponseHandler from '../../../Utils/ResponseHandler';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReviewManage() {
  const { user, dispatch } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(user.email)
      const response = await axios.get(`${BASE_URL}/review?email=${user.email}`);
      setReviews(response.data.filter((review) => review.email === user.email));
      setFilteredReviews(response.data.filter((review) => review.email === user.email));
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
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Reviews List", doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

      doc.setFontSize(14);
      doc.text(`Number of Reviews: ${filteredReviews.length}`, 10, 20);

      const generatedDate = new Date().toLocaleDateString();
      const generatedTime = new Date().toLocaleTimeString();
      doc.text(`Generated on: ${generatedDate} at ${generatedTime}`, 10, 30);

      doc.autoTable({
        head: [['Name', 'Email', 'Type', 'Car Type', 'Contact', 'Service Date', 'Message']],
        body: filteredReviews.map((review) => [
          review.name,
          review.email,
          review.type,
          review.carType,
          review.contact,
          new Date(review.serviceDate).toLocaleDateString(),
          review.message,
        ]),
        startY: 40,
      });

      doc.save("Reviews_List.pdf");
      Toaster.justToast('success', 'Creating The Pdf For You', () => {});
    } catch (error) {
      Toaster.justToast('error', 'Generation failed', () => {});
    } finally {
      Toaster.dismissLoadingToast();
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredReviews = reviews.filter((review) =>
      Object.values(review).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(query)
      )
    )
    setFilteredReviews(filteredReviews);
  };

  const handleReviewEdit = (review) => {
    console.log(review._id);
    navigate(`/user/reviews/edit/${review._id}`);
    setIsEditing(true);
  };

  const handleDelete = async (reviewId) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        console.log(reviewId);
        await axios.delete(`${BASE_URL}/review/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        setFilteredReviews(filteredReviews.filter(review => review._id !== reviewId));
        Toaster.justToast('success', 'Review deleted successfully');
      } catch (err) {
        console.error(err);
        Toaster.justToast('error', 'Failed to delete review');
      }
    });
  };

  return (
    <div className="body-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100 shadow-sm">
            <div className='d-flex justify-content-end align-items-center mb-4'>
              
        <form className="position-relative">
                      <input
                          value={searchQuery}
                          onChange={handleSearch}
                          type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search" />
                      <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                  </form>
              <button className='btn btn-outline-dark mx-2' onClick={generatePdf}>Export</button>
              <button className='btn text-white' style={{backgroundColor:'#1681e5'}} onClick={() => {
                  navigate(`/contact`);
              }}>Add New</button>
         </div>
              <div className="card-body p-4">
                <h3>My Reviews</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Car Type</th>
                        <th>Contact</th> 
                        <th>Service Date</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredReviews && filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <tr key={review.id}>
                          <td>{review.name}</td>
                          <td>{review.email}</td>
                          <td>{review.type}</td>
                          <td>{review.carType}</td>
                          <td>{review.contact}</td>
                          <td>{new Date(review.serviceDate).toLocaleDateString()}</td>
                          <td>{review.message}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleReviewEdit(review, review._id)}
                              style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px', borderRadius: '5px', backgroundColor: 'rgb(0, 87, 163)', borderColor: '#4CAF50' }}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(review._id)}
                              style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#f44336', borderColor: '#f44336' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))) : (
                        <tr>
                          <td colSpan={6}>No reviews found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}