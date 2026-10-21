import React from 'react';
import { useDonorContext } from '../context/DonorContext';

/**
 * FilterBar Component (Enriched from Experiment 3)
 * Demonstrates:
 * - Controlled input bindings (search text, select dropdown, checkbox)
 * - Sorting controls (by rating, donations, age, name)
 * - Active filter indicators & clear callbacks
 */
function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedBloodGroup,
  setSelectedBloodGroup,
  availableOnly,
  setAvailableOnly,
  sortBy,
  setSortBy,
  totalMatching,
  totalDonors,
  onReset
}) {
  const { uniqueBloodGroups } = useDonorContext();

  const isFiltered =
    searchQuery !== '' ||
    selectedBloodGroup !== 'All' ||
    availableOnly ||
    sortBy !== 'default';

  return (
    <div className="filter-bar">
      <div className="filter-controls-row">
        {/* Search Input: Matches donor name, city, or blood group */}
        <div className="filter-group search-group">
          <label htmlFor="search-input" className="filter-label">
            Search Donors
          </label>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="search-input"
              type="text"
              className="filter-input search-input"
              placeholder="Search by name, city (e.g. Mumbai, Pune), or blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Blood Group Dropdown */}
        <div className="filter-group select-group">
          <label htmlFor="blood-group-select" className="filter-label">
            Blood Group
          </label>
          <select
            id="blood-group-select"
            className="filter-select"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
          >
            <option value="All">All Blood Groups</option>
            {uniqueBloodGroups
              .filter((group) => group !== 'All')
              .map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
          </select>
        </div>

        {/* Sorting Dropdown (New Feature) */}
        <div className="filter-group select-group">
          <label htmlFor="sort-by-select" className="filter-label">
            Sort Donors By
          </label>
          <select
            id="sort-by-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default Order</option>
            <option value="rating">Rating: Highest First ⭐</option>
            <option value="donations">Donations: Most Experienced</option>
            <option value="age-asc">Age: Youngest First</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* Available Only Checkbox */}
        <div className="filter-group checkbox-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">Available Only</span>
          </label>
        </div>

        {/* Reset / Clear Filters button */}
        {isFiltered && (
          <div className="filter-group reset-group">
            <button
              type="button"
              className="btn-reset-filters"
              onClick={onReset}
              title="Reset all filters & sorting"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Live Filtering Summary & Filter Tags */}
      <div className="filter-summary-row">
        <span className="filter-results-badge">
          Showing <strong>{totalMatching}</strong> of <strong>{totalDonors}</strong> donors
        </span>

        {isFiltered && (
          <div className="active-filters-tags">
            {searchQuery && (
              <span className="filter-tag">
                Keyword: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
            {selectedBloodGroup !== 'All' && (
              <span className="filter-tag">
                Blood Group: {selectedBloodGroup}
                <button type="button" onClick={() => setSelectedBloodGroup('All')}>✕</button>
              </span>
            )}
            {availableOnly && (
              <span className="filter-tag">
                Only Available
                <button type="button" onClick={() => setAvailableOnly(false)}>✕</button>
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="filter-tag">
                Sorted by: {sortBy}
                <button type="button" onClick={() => setSortBy('default')}>✕</button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
