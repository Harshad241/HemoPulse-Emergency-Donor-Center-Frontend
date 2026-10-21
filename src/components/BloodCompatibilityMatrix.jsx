import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';
import { bloodCompatibility, allBloodGroups } from '../data/bloodCompatibilityData';

/**
 * BloodCompatibilityMatrix Component (Brand New Feature)
 * Demonstrates:
 * - Complex medical logic & biological compatibility calculations
 * - Dynamic counting of real-time compatible donors
 * - 1-Click integration to filter compatible donors across the directory
 */
const BloodCompatibilityMatrix = ({ onFilterCompatibleDonors }) => {
  const { donors } = useDonorContext();
  const [selectedType, setSelectedType] = useState('O-');

  const info = bloodCompatibility[selectedType] || bloodCompatibility['O-'];

  // Calculate real-time compatible donors for a patient needing this blood type
  // A patient of `selectedType` can receive from `info.canReceiveFrom`
  const compatibleDonors = donors.filter((d) =>
    info.canReceiveFrom.includes(d.bloodGroup)
  );
  const compatibleAvailableCount = compatibleDonors.filter((d) => d.availability).length;

  return (
    <div className="card matrix-container">
      <div className="matrix-header">
        <div className="matrix-title-group">
          <span className="matrix-icon">🧬</span>
          <div>
            <h2>Blood Compatibility &amp; Transfusion Matrix</h2>
            <p className="card-subtitle">
              Interactive clinical compatibility calculator for emergency trauma response.
            </p>
          </div>
        </div>

        <div className="universal-badges">
          <span className="badge-universal-donor" title="Type O- can be given to anyone">
            O- Universal Donor
          </span>
          <span className="badge-universal-recipient" title="Type AB+ can receive from anyone">
            AB+ Universal Recipient
          </span>
        </div>
      </div>

      {/* Blood Group Selector Chips */}
      <div className="matrix-selector-section">
        <label className="matrix-selector-label">
          Select Patient Blood Group to Check Emergency Compatibility:
        </label>
        <div className="blood-chip-group">
          {allBloodGroups.map((bg) => (
            <button
              key={bg}
              type="button"
              className={`blood-chip-btn ${selectedType === bg ? 'active' : ''}`}
              onClick={() => setSelectedType(bg)}
            >
              <span className="chip-bg">{bg}</span>
              {bg === 'O-' && <span className="chip-tag">Univ. Donor</span>}
              {bg === 'AB+' && <span className="chip-tag">Univ. Recip.</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Blood Group Details Panel */}
      <div className="compatibility-details-panel">
        <div className="compat-panel-top">
          <div className="compat-blood-badge">
            <span className="badge-letter">{selectedType}</span>
            <span className="badge-classification">{info.type}</span>
          </div>
          <div className="compat-description-box">
            <h4>Clinical Guidance</h4>
            <p>{info.description}</p>
          </div>
        </div>

        <div className="compat-rules-grid">
          {/* Can Receive From */}
          <div className="rule-card receive-card">
            <h4>
              <span className="rule-icon">📥</span> Can Receive Blood From:
            </h4>
            <p className="rule-subtext">Safe donor types for a {selectedType} patient</p>
            <div className="compat-pills-list">
              {info.canReceiveFrom.map((bg) => (
                <span key={bg} className="compat-pill pill-receive">
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* Can Donate To */}
          <div className="rule-card donate-card">
            <h4>
              <span className="rule-icon">📤</span> Can Donate Blood To:
            </h4>
            <p className="rule-subtext">Eligible patient types for a {selectedType} donor</p>
            <div className="compat-pills-list">
              {info.canGiveTo.map((bg) => (
                <span key={bg} className="compat-pill pill-donate">
                  {bg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Compatible Donors Inventory Stats */}
        <div className="compat-inventory-stat-box">
          <div className="stat-text-group">
            <h3>Immediate Hospital Availability for {selectedType} Patient:</h3>
            <p>
              There are <strong>{compatibleAvailableCount}</strong> available (and {compatibleDonors.length} total) compatible donors in our registry.
            </p>
          </div>

          <button
            type="button"
            className="btn-filter-compat-donors"
            onClick={() => onFilterCompatibleDonors && onFilterCompatibleDonors(info.canReceiveFrom)}
          >
            🚨 View {compatibleAvailableCount} Compatible Donors &rarr;
          </button>
        </div>
      </div>

      {/* Full Cross-Match Table for All Blood Groups */}
      <div className="full-compat-table-section">
        <h3>Transfusion Compatibility Reference Guide</h3>
        <div className="table-responsive">
          <table className="compat-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Red Blood Cells Can Donate To</th>
                <th>Red Blood Cells Can Receive From</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {allBloodGroups.map((bg) => {
                const item = bloodCompatibility[bg];
                const isSelected = bg === selectedType;
                return (
                  <tr
                    key={bg}
                    className={isSelected ? 'selected-row' : ''}
                    onClick={() => setSelectedType(bg)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong className="table-blood-badge">{bg}</strong>
                    </td>
                    <td>
                      <div className="table-pills-wrap">
                        {item.canGiveTo.map((g) => (
                          <span key={g} className="mini-pill mini-give">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="table-pills-wrap">
                        {item.canReceiveFrom.map((r) => (
                          <span key={r} className="mini-pill mini-receive">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="type-badge-label">{item.type}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityMatrix;
