import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';

/**
 * ConnectBackendModal Component
 * Allows user to connect their deployed Render Spring Boot backend to the React frontend
 */
function ConnectBackendModal({ isOpen, onClose }) {
  const { backendUrl, setBackendUrl, syncWithBackend, isConnecting, showToast } = useDonorContext();
  const [inputUrl, setInputUrl] = useState(backendUrl || '');

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim().replace(/\/+$/, '');
    if (!cleanUrl) {
      setBackendUrl('');
      showToast('Disconnected from custom backend. Using in-memory & local registry.', 'info');
      onClose();
      return;
    }

    const success = await syncWithBackend(cleanUrl);
    if (success) {
      onClose();
    }
  };

  const handleDisconnect = () => {
    setBackendUrl('');
    setInputUrl('');
    showToast('Switched back to standalone local mode.', 'info');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🔗</span>
            <h3>Connect Render Backend API</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleConnect} className="modal-form">
          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
            Paste the URL of your deployed Spring Boot service on Render. The frontend will sync directly with your live <code>/api/donors</code> REST API.
          </p>

          <div className="form-group">
            <label htmlFor="backendUrlInput">Render Backend Service URL *</label>
            <input
              id="backendUrlInput"
              type="url"
              placeholder="e.g. https://hemopulse-donor-api.onrender.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Base URL of your deployed backend service on Render.
            </span>
          </div>

          <div className="modal-actions">
            {backendUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDisconnect}
                style={{ marginRight: 'auto', color: '#dc2626' }}
              >
                Disconnect
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-emergency-submit"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect & Fetch Donors'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConnectBackendModal;
