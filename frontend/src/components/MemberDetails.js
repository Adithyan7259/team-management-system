import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/members/${id}`);
        setMember(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to load member details');
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/members/${id}`);
      console.log('Delete response:', response.data);
      navigate('/view-members');
    } catch (error) {
      console.error('Error deleting member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete member. Please try again.';
      setError(errorMessage);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="page-container">
        <div className="content-card">
          <h1 className="page-title">Member Not Found</h1>
          <Link to="/view-members" className="btn btn-primary">
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-card member-details">
        <div className="member-details-grid">
          <div className="member-image-section">
            <img
              src={`http://localhost:5000/uploads/${member.image}`}
              alt={member.name}
              className="member-detail-image"
            />
          </div>
          <div className="member-info-section">
            <h1 className="page-title">{member.name}</h1>
            <div className="member-details-info">
              <div className="detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value">{member.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{member.email}</span>
              </div>
            </div>
            <div className="button-container">
              <Link to="/view-members" className="btn btn-primary">
                Back to Members
              </Link>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Delete</h2>
            <p className="modal-message">
              Are you sure you want to remove {member.name}? This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Error</h2>
            <p className="modal-message">{error}</p>
            <div className="modal-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setError(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberDetails; 