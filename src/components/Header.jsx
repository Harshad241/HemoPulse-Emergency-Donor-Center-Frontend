import React from 'react';
import { useDonorContext } from '../context/DonorContext';

/**
 * Header Component (Unified from Experiment 3 & 4)
 * Demonstrates:
 * - Functional Component
 * - Consuming Global Context (stats & user info)
 * - Navigation tab bar for multiple views
 * - Dynamic pulse animations & badges
 */
function Header({ currentTab, setCurrentTab }) {
  const {
    user,
    availableCount,
    totalCount,
    bloodGroupsCount,
    contactedCount,
    resetToDemoData
  } = useDonorContext();

  return (
    <header className="header">
      {/* Top Bar: Brand, Stats, Profile */}
      <div className="header-top-row">
        <div className="header-brand">
          <div className="logo-badge">
            <span className="blood-icon">🩸</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">HEMOPULSE</h1>
            <p className="brand-subtitle">Emergency Donor Center &amp; Registry</p>
          </div>
        </div>

        {/* Dynamic Real-Time Stats */}
        <div className="header-center-stats">
          <div className="stat-pill stat-available" title="Donors ready for emergency donation right now">
            <span className="stat-dot pulse"></span>
            <span className="stat-label">Available:</span>
            <strong className="stat-value">{availableCount}</strong>
          </div>
          <div className="stat-pill stat-total" title="Total donors in the registry">
            <span className="stat-label">Total Donors:</span>
            <strong className="stat-value">{totalCount}</strong>
          </div>
          <div className="stat-pill stat-groups" title="Distinct blood groups represented">
            <span className="stat-label">Blood Groups:</span>
            <strong className="stat-value">{bloodGroupsCount}</strong>
          </div>
          {contactedCount > 0 && (
            <div className="stat-pill stat-requested" title="Emergency dispatches sent">
              <span className="stat-label">Requests Sent:</span>
              <strong className="stat-value">{contactedCount}</strong>
            </div>
          )}
        </div>

        {/* User / Coordinator Profile */}
        <div className="header-user-profile">
          <div className="user-avatar" title={user?.role || 'Emergency Coordinator'}>
            {user?.name ? (user.name.replace(/^Dr\.\s*/i, '').charAt(0) || user.name.charAt(0)) : 'H'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'HemoPulse Coordinator'}</p>
            <span className="user-role">{user?.role || 'Emergency Coordinator'}</span>
          </div>
          <button
            type="button"
            className="btn-demo-reset"
            onClick={resetToDemoData}
            title="Reset data to initial demo state"
          >
            ↻ Reset Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Seamless Switching between Exp 3 & Exp 4 & New Features) */}
      <nav className="header-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'directory' ? 'active' : ''}`}
          onClick={() => setCurrentTab('directory')}
        >
          <span className="tab-icon">🗂️</span>
          <span className="tab-text">Donor Directory &amp; Emergencies</span>
          <span className="tab-badge">{availableCount} Ready</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'register' ? 'active' : ''}`}
          onClick={() => setCurrentTab('register')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-text">Register Donor &amp; ID Card</span>
          <span className="tab-badge-accent">Exp 4</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'table' ? 'active' : ''}`}
          onClick={() => setCurrentTab('table')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Registry Table View</span>
          <span className="tab-badge">{totalCount} Donors</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'compatibility' ? 'active' : ''}`}
          onClick={() => setCurrentTab('compatibility')}
        >
          <span className="tab-icon">🧬</span>
          <span className="tab-text">Compatibility Matrix</span>
          <span className="tab-badge-new">New</span>
        </button>

        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'all' ? 'active' : ''}`}
          onClick={() => setCurrentTab('all')}
        >
          <span className="tab-icon">⚡</span>
          <span className="tab-text">All-in-One Dashboard</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
