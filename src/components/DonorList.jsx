import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';
import { allBloodGroups } from '../data/bloodCompatibilityData';

/**
 * DonorList Component (Enriched from Experiment 4)
 * Demonstrates:
 * - Dynamic table rendering from Global Context
 * - Table row mapping with unique key
 * - Inline status toggling & deletion
 * - CSV Export functionality
 * - In-table filtering & searching
 */
const DonorList = ({ onSelectForIdCard }) => {
  const {
    donors,
    setActiveDonor,
    toggleDonorAvailability,
    deleteDonor,
    showToast
  } = useDonorContext();

  const [tableSearch, setTableSearch] = useState('');
  const [tableBloodFilter, setTableBloodFilter] = useState('All');

  // Filtered rows for the table
  const filteredDonors = donors.filter((d) => {
    const q = tableSearch.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      d.fullName.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.phone.includes(q);

    const matchesBlood =
      tableBloodFilter === 'All' || d.bloodGroup === tableBloodFilter;

    return matchesSearch && matchesBlood;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    if (donors.length === 0) {
      showToast('No donors to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Full Name', 'Age', 'Blood Group', 'City', 'Phone', 'Email', 'Availability', 'Last Donation'];
    const rows = donors.map((d) => [
      `"${d.id}"`,
      `"${d.fullName}"`,
      d.age,
      `"${d.bloodGroup}"`,
      `"${d.city}"`,
      `"${d.phone}"`,
      `"${d.email}"`,
      `"${d.availability ? 'Available' : 'Unavailable'}"`,
      `"${d.lastDonationDate || d.lastDonation || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hemopulse_donors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${donors.length} donor records to CSV!`, 'success');
  };

  const handleSelectDonor = (donor) => {
    setActiveDonor(donor);
    if (onSelectForIdCard) {
      onSelectForIdCard(donor);
    }
  };

  return (
    <div className="card member-list-container">
      {/* Table Header with Counts & Export Button */}
      <div className="table-header-row">
        <div>
          <h2>Registered Donors ({donors.length})</h2>
          <p className="card-subtitle">
            Comprehensive registry database with immediate dispatch status and actions.
          </p>
        </div>

        <div className="table-actions-toolbar">
          <button
            type="button"
            className="btn-export-csv"
            onClick={handleExportCSV}
            title="Download full donor registry as CSV"
          >
            📥 Export to CSV
          </button>
        </div>
      </div>

      {/* Table Search & Filter Bar */}
      <div className="table-filter-bar">
        <div className="table-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Filter table by name, ID, phone, city..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
          {tableSearch && (
            <button
              type="button"
              className="table-clear-btn"
              onClick={() => setTableSearch('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="table-blood-select">
          <label>Filter Blood Group:</label>
          <select
            value={tableBloodFilter}
            onChange={(e) => setTableBloodFilter(e.target.value)}
          >
            <option value="All">All Blood Groups</option>
            {allBloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {donors.length === 0 ? (
        <p className="placeholder">No registered donors found in database.</p>
      ) : filteredDonors.length === 0 ? (
        <div className="table-no-results">
          <p>No donors match your table search criteria.</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setTableSearch('');
              setTableBloodFilter('All');
            }}
          >
            Reset Table Filter
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Donor ID</th>
                <th>Donor Name</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>City</th>
                <th>Phone</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor, index) => (
                <tr key={donor.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="table-id-tag">{donor.id}</span>
                  </td>
                  <td>
                    <strong>{donor.fullName}</strong>
                  </td>
                  <td>{donor.age}</td>
                  <td>
                    <span className="table-blood-badge">{donor.bloodGroup}</span>
                  </td>
                  <td>{donor.city}</td>
                  <td>{donor.phone}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        donor.availability
                          ? 'status-available'
                          : 'status-unavailable'
                      }`}
                    >
                      {donor.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="table-row-actions">
                      <button
                        type="button"
                        className="btn-row-action btn-row-view"
                        onClick={() => handleSelectDonor(donor)}
                        title="View Official ID Card"
                      >
                        🪪 ID Card
                      </button>
                      <button
                        type="button"
                        className="btn-row-action btn-row-toggle"
                        onClick={() => toggleDonorAvailability(donor.id)}
                        title="Toggle availability"
                      >
                        🔄 {donor.availability ? 'Mark Busy' : 'Mark Free'}
                      </button>
                      <button
                        type="button"
                        className="btn-row-action btn-row-delete"
                        onClick={() => {
                          if (window.confirm(`Delete donor ${donor.fullName} (${donor.id})?`)) {
                            deleteDonor(donor.id);
                          }
                        }}
                        title="Delete donor record"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonorList;
