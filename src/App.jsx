import React, { useState } from 'react';
import { DonorProvider, useDonorContext } from './context/DonorContext';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import EmergencyRequests from './components/EmergencyRequests';
import DonorGrid from './components/DonorGrid';
import DonorRegistrationForm from './components/DonorRegistrationForm';
import DonorIdCard from './components/DonorIdCard';
import DonorList from './components/DonorList';
import BloodCompatibilityMatrix from './components/BloodCompatibilityMatrix';
import './App.css';

/**
 * MainAppContent Component
 * Coordinates views, search, filtering, sorting, and callbacks
 */
function MainAppContent() {
  const {
    donors,
    toast,
    clearToast,
    availableCount,
    contactedCount,
    setActiveDonor
  } = useDonorContext();

  // Active view tab: 'directory' | 'register' | 'table' | 'compatibility' | 'all'
  const [currentTab, setCurrentTab] = useState('directory');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [compatibleBloodList, setCompatibleBloodList] = useState(null);

  // Derived filtered & sorted donors
  const filteredDonors = donors.filter((donor) => {
    const q = searchQuery.trim().toLowerCase();

    // Search query matches name, city, email, phone or blood group
    const matchesSearch =
      q === '' ||
      donor.fullName.toLowerCase().includes(q) ||
      donor.city.toLowerCase().includes(q) ||
      donor.bloodGroup.toLowerCase().includes(q) ||
      (donor.phone && donor.phone.includes(q)) ||
      (donor.email && donor.email.toLowerCase().includes(q));

    // Blood group dropdown match
    const matchesBloodGroup =
      selectedBloodGroup === 'All' || donor.bloodGroup === selectedBloodGroup;

    // Availability toggle
    const matchesAvailability = !availableOnly || donor.availability === true;

    // Compatibility filter (if applied from Matrix view)
    const matchesCompatibility =
      !compatibleBloodList || compatibleBloodList.includes(donor.bloodGroup);

    return matchesSearch && matchesBloodGroup && matchesAvailability && matchesCompatibility;
  });

  // Apply sorting
  const sortedAndFilteredDonors = [...filteredDonors].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'donations') {
      return (b.donations || 0) - (a.donations || 0);
    }
    if (sortBy === 'age-asc') {
      return (a.age || 0) - (b.age || 0);
    }
    if (sortBy === 'name-asc') {
      return a.fullName.localeCompare(b.fullName);
    }
    return 0; // default order
  });

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBloodGroup('All');
    setAvailableOnly(false);
    setSortBy('default');
    setCompatibleBloodList(null);
  };

  // Quick filter by emergency blood group from EmergencyRequests
  const handleEmergencySelect = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroup);
    setAvailableOnly(true);
    setCompatibleBloodList(null);
    setCurrentTab('directory');
  };

  // Quick filter from Compatibility Matrix
  const handleFilterCompatibleDonors = (bloodGroupList) => {
    setCompatibleBloodList(bloodGroupList);
    setSelectedBloodGroup('All');
    setAvailableOnly(true);
    setCurrentTab('directory');
  };

  // Select donor to inspect their ID card
  const handleSelectForIdCard = (donor) => {
    setActiveDonor(donor);
    setCurrentTab('register');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`toast-notification toast-${toast.type || 'info'}`}>
          <span className="toast-icon">
            {toast.type === 'critical' ? '🚨' : toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="toast-text">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={clearToast}
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header with dynamic counters & navigation tabs */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {/* Banner Section */}
        <section className="intro-banner">
          <div className="banner-content">
            <h2 className="banner-title">Emergency Blood Donor Network &amp; Registry</h2>
            <p className="banner-subtitle">
              Instant access to verified, voluntary blood donors during critical hospital emergencies.
              Filter by blood group compatibility, verify donor availability, issue official digital donor cards,
              and dispatch emergency alerts in real-time.
            </p>
          </div>
          <div className="banner-action-stats">
            <div className="banner-stat-card">
              <span className="stat-num">{availableCount}</span>
              <span className="stat-desc">Donors Ready Now</span>
            </div>
            <div className="banner-stat-card">
              <span className="stat-num">{contactedCount}</span>
              <span className="stat-desc">Requests Dispatched</span>
            </div>
          </div>
        </section>

        {/* Compatibility active notice */}
        {compatibleBloodList && (
          <div className="compatibility-filter-notice">
            <span>🧬 Filtering for compatible donor blood groups: <strong>{compatibleBloodList.join(', ')}</strong></span>
            <button
              type="button"
              className="btn-clear-notice"
              onClick={() => setCompatibleBloodList(null)}
            >
              Clear Compatibility Filter ✕
            </button>
          </div>
        )}

        {/* VIEW 1: Directory & Emergencies (Exp 3 Core) */}
        {(currentTab === 'directory' || currentTab === 'all') && (
          <section className="view-section">
            {/* Live Hospital Emergency Requirements */}
            <EmergencyRequests onSelectBloodGroup={handleEmergencySelect} />

            {/* Filter & Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedBloodGroup={selectedBloodGroup}
              setSelectedBloodGroup={setSelectedBloodGroup}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalMatching={sortedAndFilteredDonors.length}
              totalDonors={donors.length}
              onReset={handleClearFilters}
            />

            {/* Donor Cards Grid */}
            <DonorGrid
              donors={sortedAndFilteredDonors}
              onClearFilters={handleClearFilters}
              onSelectForIdCard={handleSelectForIdCard}
            />
          </section>
        )}

        {/* VIEW 2: Register Donor & Generated ID Card (Exp 4 Core) */}
        {(currentTab === 'register' || currentTab === 'all') && (
          <section className="view-section register-section">
            <div className="side-by-side-grid">
              <DonorRegistrationForm
                onRegistrationSuccess={() => {
                  // Keep on register tab to see generated ID card
                }}
              />
              <DonorIdCard />
            </div>
          </section>
        )}

        {/* VIEW 3: Registry Table View (Exp 4 Table + Enhancements) */}
        {(currentTab === 'table' || currentTab === 'all') && (
          <section className="view-section">
            <DonorList onSelectForIdCard={handleSelectForIdCard} />
          </section>
        )}

        {/* VIEW 4: Blood Compatibility Matrix (New Feature) */}
        {(currentTab === 'compatibility' || currentTab === 'all') && (
          <section className="view-section">
            <BloodCompatibilityMatrix
              onFilterCompatibleDonors={handleFilterCompatibleDonors}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            <strong>HemoPulse Emergency Donor Center &amp; Registry</strong> &copy; 2026.
          </p>
          <p className="footer-subtext">
            Web &amp; Mobile Development (WMD) Lab &mdash; Experiments 03 &amp; 04 Combined with Advanced State Management &amp; Compatibility Engine
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <DonorProvider>
      <MainAppContent />
    </DonorProvider>
  );
}

export default App;
