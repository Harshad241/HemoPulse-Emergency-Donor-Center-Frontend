import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';
import { allBloodGroups } from '../data/bloodCompatibilityData';

/**
 * AddEmergencyModal Component (New Feature)
 * Allows coordinators to post a new emergency blood requirement to the live network
 */
function AddEmergencyModal({ isOpen, onClose }) {
  const { addEmergencyRequest } = useDonorContext();

  const [formData, setFormData] = useState({
    hospital: '',
    department: '',
    bloodGroup: 'O-',
    urgency: 'CRITICAL',
    unitsNeeded: '2 Units'
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.hospital.trim()) {
      setError('Hospital name is required.');
      return;
    }
    if (!formData.department.trim()) {
      setError('Hospital department is required.');
      return;
    }

    addEmergencyRequest(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🚨</span>
            <h3>Post Hospital Emergency Blood Need</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="hospital">Hospital Name *</label>
            <input
              id="hospital"
              name="hospital"
              type="text"
              placeholder="e.g. Lilavati Hospital, Apollo Hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department / Ward *</label>
            <input
              id="department"
              name="department"
              type="text"
              placeholder="e.g. Trauma Care, Emergency ICU, Pediatric Ward"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="bloodGroup">Required Blood Group *</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                {allBloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level *</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="CRITICAL">CRITICAL (Immediate)</option>
                <option value="URGENT">URGENT (&lt; 2 Hours)</option>
                <option value="HIGH PRIORITY">HIGH PRIORITY (&lt; 6 Hours)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="unitsNeeded">Units Needed *</label>
            <input
              id="unitsNeeded"
              name="unitsNeeded"
              type="text"
              placeholder="e.g. 2 Units, 4 Units"
              value={formData.unitsNeeded}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-emergency-submit">
              🚨 Broadcast Emergency Need
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmergencyModal;
