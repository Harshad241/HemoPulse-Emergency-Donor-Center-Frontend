import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';

/**
 * DonorIdCard Component (Enriched from Experiment 4's DonorCard)
 * Demonstrates:
 * - Consuming activeDonor directly from Global Context
 * - Dynamic generation of healthcare ID credentials
 * - Print ID Badge & Copy Details actions
 * - Quick-select donor dropdown to inspect any donor's card
 */
const DonorIdCard = () => {
  const { activeDonor, donors, setActiveDonor, showToast } = useDonorContext();
  const [copied, setCopied] = useState(false);

  const handleCopyDetails = () => {
    if (!activeDonor) return;
    const text = `HEMOPULSE EMERGENCY DONOR ID
ID: ${activeDonor.id}
Name: ${activeDonor.fullName}
Blood Group: ${activeDonor.bloodGroup}
Age: ${activeDonor.age}
City: ${activeDonor.city}
Phone: ${activeDonor.phone}
Email: ${activeDonor.email}
Availability: ${activeDonor.availability ? 'Available' : 'Unavailable'}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast(`Donor details for ${activeDonor.fullName} copied to clipboard!`, 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card id-card-container">
      <div className="id-card-title-bar">
        <h2>Generated Official Donor Card</h2>
        {donors.length > 0 && (
          <div className="id-quick-selector">
            <label htmlFor="active-donor-select">Preview Donor:</label>
            <select
              id="active-donor-select"
              value={activeDonor?.id || ''}
              onChange={(e) => {
                const found = donors.find((d) => d.id === e.target.value);
                if (found) setActiveDonor(found);
              }}
            >
              {donors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.bloodGroup})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeDonor ? (
        <div className="id-card printable-card">
          {/* Official Top Header */}
          <div className="id-header">
            <div className="id-header-brand">
              <span className="id-brand-drop">🩸</span>
              <div>
                <h3>HEMOPULSE EMERGENCY DONOR CENTER</h3>
                <p>National Voluntary Blood Donation Registry</p>
              </div>
            </div>
            {activeDonor.id && <span className="id-tag">{activeDonor.id}</span>}
          </div>

          <div className="id-body">
            {/* Prominent Blood Group Display */}
            <div className="blood-group-section">
              <span className="blood-group-label">BLOOD GROUP</span>
              <div className="blood-group-badge">{activeDonor.bloodGroup}</div>
              <span className="blood-compat-note">Verified Type</span>
            </div>

            {/* Official Credentials Grid */}
            <div className="id-details">
              <p>
                <strong>Donor Name:</strong>{' '}
                <span className="id-detail-text highlight-name">{activeDonor.fullName}</span>
              </p>
              <p>
                <strong>Age:</strong> <span className="id-detail-text">{activeDonor.age} years</span>
              </p>
              <p>
                <strong>City:</strong> <span className="id-detail-text">📍 {activeDonor.city}</span>
              </p>
              <p>
                <strong>Phone:</strong> <span className="id-detail-text">📞 {activeDonor.phone}</span>
              </p>
              <p>
                <strong>Email:</strong> <span className="id-detail-text">✉️ {activeDonor.email}</span>
              </p>
              <p>
                <strong>Last Donation:</strong>{' '}
                <span className="id-detail-text">
                  {activeDonor.lastDonationDate || activeDonor.lastDonation || 'First-time Donor / Not specified'}
                </span>
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {activeDonor.availability ? (
                  <span className="status-badge status-available">AVAILABLE FOR DISPATCH</span>
                ) : (
                  <span className="status-badge status-unavailable">CURRENTLY UNAVAILABLE</span>
                )}
              </p>
            </div>
          </div>

          {/* Verification Barcode & Security Strip */}
          <div className="id-card-footer">
            <div className="barcode-simulation">
              <span className="barcode-bars">||| | |||| | || |||| | ||| | |||| || |</span>
              <span className="barcode-code">HP-REG-{activeDonor.id}</span>
            </div>
            <div className="id-seal">
              <span className="seal-text">VERIFIED DONOR</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="id-card-actions no-print">
            <button
              type="button"
              className="btn-id-action btn-copy"
              onClick={handleCopyDetails}
              title="Copy donor details to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy Details'}
            </button>
            <button
              type="button"
              className="btn-id-action btn-print"
              onClick={handlePrint}
              title="Print or Save this ID badge as PDF"
            >
              🖨️ Print / Save Badge
            </button>
          </div>
        </div>
      ) : (
        <div className="placeholder-box">
          <span className="placeholder-icon">🪪</span>
          <p className="placeholder">
            Fill out and submit the donor registration form or pick a donor from the directory to generate an official digital donor card.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonorIdCard;
