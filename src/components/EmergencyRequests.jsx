import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';
import AddEmergencyModal from './AddEmergencyModal';

/**
 * EmergencyRequests Component (Enriched from Experiment 3)
 * Demonstrates:
 * - Dynamic list rendering of hospital emergency requirements
 * - Filtering donors by emergency blood group on click
 * - Interactive modal trigger to post new emergency needs
 * - Dismiss / resolve emergency requirements
 */
function EmergencyRequests({ onSelectBloodGroup }) {
  const { emergencyRequests, deleteEmergencyRequest } = useDonorContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="emergency-section">
      <div className="emergency-header">
        <div className="emergency-title-wrap">
          <span className="emergency-siren-icon">🚨</span>
          <h2 className="emergency-title">Emergency Blood Requirements</h2>
          <span className="emergency-live-indicator">LIVE HOSPITAL NETWORK</span>
        </div>

        <button
          type="button"
          className="btn-add-emergency"
          onClick={() => setIsModalOpen(true)}
          title="Post a new hospital emergency requirement"
        >
          + Post Emergency Need
        </button>
      </div>

      {emergencyRequests.length === 0 ? (
        <div className="emergency-empty">
          <p>✅ All active hospital emergency requirements have been fulfilled.</p>
        </div>
      ) : (
        <div className="emergency-cards-grid">
          {emergencyRequests.map((req) => (
            <div
              key={req.id}
              className={`emergency-card urgency-${req.urgency.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="emergency-card-top">
                <span className={`urgency-badge badge-${req.urgency.toLowerCase().replace(/\s+/g, '-')}`}>
                  {req.urgency}
                </span>
                <span className="units-needed">{req.unitsNeeded}</span>
                <button
                  type="button"
                  className="btn-resolve-emergency"
                  onClick={() => deleteEmergencyRequest(req.id)}
                  title="Resolve / Remove this requirement"
                >
                  ✕
                </button>
              </div>

              <div className="emergency-blood-display">
                <span className="emergency-blood-badge">{req.bloodGroup}</span>
                <span className="required-text">Required</span>
              </div>

              <div className="emergency-hospital-details">
                <h3 className="hospital-name">{req.hospital}</h3>
                <p className="hospital-dept">{req.department}</p>
                {req.timeAgo && <span className="time-ago-tag">⏱ {req.timeAgo}</span>}
              </div>

              {onSelectBloodGroup && (
                <button
                  type="button"
                  className="btn-filter-urgent"
                  onClick={() => onSelectBloodGroup(req.bloodGroup)}
                  title={`Filter available donors for ${req.bloodGroup}`}
                >
                  Find {req.bloodGroup} Donors &rarr;
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for posting new hospital emergency need */}
      <AddEmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default EmergencyRequests;
