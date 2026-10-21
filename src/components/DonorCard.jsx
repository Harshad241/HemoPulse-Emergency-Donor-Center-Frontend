import React from 'react';
import { useDonorContext } from '../context/DonorContext';

/**
 * DonorCard Component (Enriched from Experiment 3)
 * Demonstrates:
 * - Functional Component
 * - Props destructuring & conditional classes
 * - Consuming Global Context for state updates (request, ID card view, status toggle)
 */
function DonorCard({ donor, onSelectForIdCard }) {
  const {
    requestDonor,
    contactedDonors,
    toggleDonorAvailability,
    setActiveDonor
  } = useDonorContext();

  const isContacted = contactedDonors.includes(donor.id);
  const isAvailable = donor.availability === true;

  const handleViewIdCard = () => {
    setActiveDonor(donor);
    if (onSelectForIdCard) {
      onSelectForIdCard(donor);
    }
  };

  return (
    <article
      className={`donor-card ${isAvailable ? 'donor-available' : 'donor-unavailable'} ${
        isContacted ? 'donor-contacted' : ''
      }`}
    >
      {/* Card Header: Avatar Initial, Name, Blood Group Badge */}
      <div className="donor-card-header">
        <div className="donor-avatar-circle">
          {donor.fullName ? donor.fullName.charAt(0) : 'D'}
        </div>
        <div className="donor-main-info">
          <h3 className="donor-name">{donor.fullName || donor.name}</h3>
          <p className="donor-location">
            <span className="location-pin">📍</span> {donor.city}
          </p>
        </div>
        <div className="blood-group-badge" title={`Blood Group: ${donor.bloodGroup}`}>
          {donor.bloodGroup}
        </div>
      </div>

      {/* Availability Status Indicator - Explicit Conditional Rendering */}
      <div className="donor-status-banner">
        {isAvailable ? (
          <span className="status-pill status-available">
            <span className="status-dot green"></span> Available
          </span>
        ) : (
          <span className="status-pill status-unavailable">
            <span className="status-dot gray"></span> Currently Unavailable
          </span>
        )}

        <button
          type="button"
          className="btn-toggle-status"
          onClick={() => toggleDonorAvailability(donor.id)}
          title={`Click to mark as ${isAvailable ? 'Unavailable' : 'Available'}`}
        >
          {isAvailable ? 'Mark Busy' : 'Mark Available'}
        </button>
      </div>

      {/* Donor Details Grid */}
      <div className="donor-details-grid">
        <div className="detail-item">
          <span className="detail-label">Age</span>
          <span className="detail-value">{donor.age} years</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Donations</span>
          <span className="detail-value">{donor.donations} times</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Donation</span>
          <span className="detail-value">{donor.lastDonationDate || donor.lastDonation || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Donor Rating</span>
          <span className="detail-value rating-value">
            <span className="star-icon">⭐</span> {donor.rating} / 5.0
          </span>
        </div>
      </div>

      {/* Donor Contact & Card Action Buttons */}
      <div className="card-actions">
        {isAvailable ? (
          <button
            type="button"
            className={`btn-action ${isContacted ? 'btn-request-sent' : 'btn-request-donor'}`}
            onClick={() => requestDonor(donor.id)}
            disabled={isContacted}
            title={isContacted ? 'Emergency request already dispatched' : 'Dispatch emergency request alert'}
          >
            {isContacted ? '✓ Request Sent' : '🚨 Request Donor'}
          </button>
        ) : (
          <button
            type="button"
            className="btn-action btn-unavailable"
            disabled
          >
            Unavailable
          </button>
        )}

        <button
          type="button"
          className="btn-view-id"
          onClick={handleViewIdCard}
          title="Open official ID Card preview for this donor"
        >
          🪪 ID Card
        </button>
      </div>
    </article>
  );
}

export default DonorCard;
