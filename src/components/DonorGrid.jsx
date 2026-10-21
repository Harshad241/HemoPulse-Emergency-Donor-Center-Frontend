import React from 'react';
import DonorCard from './DonorCard';

/**
 * DonorGrid Component (From Experiment 3)
 * Demonstrates:
 * - Dynamic list rendering with map() and unique key={donor.id}
 * - Conditional rendering: Empty State vs Grid
 * - Prop delegation
 */
function DonorGrid({ donors = [], onClearFilters, onSelectForIdCard }) {
  // Empty State
  if (donors.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No donors found.</h3>
        <p className="empty-text">
          No blood donors matched your current search and filter criteria.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className="btn-clear-filters"
            onClick={onClearFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="donor-grid-section">
      <div className="donor-grid">
        {donors.map((donor) => (
          <DonorCard
            key={donor.id}
            donor={donor}
            onSelectForIdCard={onSelectForIdCard}
          />
        ))}
      </div>
    </section>
  );
}

export default DonorGrid;
