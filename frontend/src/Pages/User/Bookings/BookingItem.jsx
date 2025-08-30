import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ReviewItem({ reviews, handleReviewDelete }) {
    
    return (
        <>
            {
                reviews ? reviews.map((review) => (
                    <tr key={review._id}>
                        <td className="border-bottom-0">
                            <p className="fw-normal mb-1">{review.name}</p>
                        </td>
                        <td className="border-bottom-0">
                            <p className="fw-normal mb-1">{review.email}</p>
                        </td>
                        <td className="border-bottom-0">
                            <p className="fw-normal mb-0">{review.carType}</p>
                        </td>
                        <td className="border-bottom-0">
                            <p className="fw-normal mb-0">{review.serviceDate}</p>
                        </td>
                        <td className="border-bottom-0">
                            <p className="fw-normal mb-0">{review.message}</p>
                        </td>
                        <td className="border-bottom-0">
                            <div data-bs-toggle="dropdown" className='bg-warning rounded-2 p-1 d-flex justify-content-center align-items-center' style={{ fontSize: "1.5rem", cursor: "pointer" }}>
                                <i className="ti ti-eye text-white" />
                            </div>
                            <ul className="dropdown-menu bg-white" style={{ minWidth: "auto" }}>
                                <li><NavLink to={`/reviewEdit/${review._id}`} className="dropdown-item">Edit</NavLink></li>
                                <li><button type='button' onClick={() => handleReviewDelete(review._id)} className="dropdown-item">Delete</button></li>
                            </ul>
                        </td>
                    </tr>
                )) : null
            }
        </>
    );
}