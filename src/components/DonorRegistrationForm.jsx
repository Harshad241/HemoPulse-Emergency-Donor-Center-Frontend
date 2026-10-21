import React, { useState } from 'react';
import { useDonorContext } from '../context/DonorContext';
import { allBloodGroups } from '../data/bloodCompatibilityData';

/**
 * DonorRegistrationForm Component (From Experiment 4)
 * Demonstrates:
 * - Controlled components using React useState
 * - Single generic handleChange handler using computed property names
 * - Robust client-side validation for age (18-65), email regex, 10-digit phone regex
 * - Preventing browser reload using e.preventDefault()
 * - Dispatches registered donor to global context
 */
const DonorRegistrationForm = ({ onRegistrationSuccess }) => {
  const { addDonor } = useDonorContext();

  // Local state for controlled inputs
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    bloodGroup: '',
    email: '',
    phone: '',
    city: '',
    availability: 'Available',
    lastDonationDate: ''
  });

  // Local state for validation errors
  const [errors, setErrors] = useState({});

  // Generic handleChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Client-side validation function
  const validate = () => {
    const tempErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      tempErrors.fullName = 'Full Name must be at least 2 characters.';
    }

    // Age: 18 - 65
    if (!formData.age) {
      tempErrors.age = 'Age is required.';
    } else {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        tempErrors.age = 'Age must be between 18 and 65 years.';
      }
    }

    // Blood Group
    if (!formData.bloodGroup) {
      tempErrors.bloodGroup = 'Blood Group selection is required.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = 'Invalid email format (e.g. user@domain.com).';
    }

    // Phone: 10-digit Indian mobile
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      tempErrors.phone = 'Must be a valid 10-digit Indian mobile number (starts with 6-9).';
    }

    // City
    if (!formData.city.trim()) {
      tempErrors.city = 'City is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const createdDonor = addDonor(formData);

      // Reset form
      setFormData({
        fullName: '',
        age: '',
        bloodGroup: '',
        email: '',
        phone: '',
        city: '',
        availability: 'Available',
        lastDonationDate: ''
      });

      if (onRegistrationSuccess) {
        onRegistrationSuccess(createdDonor);
      }
    }
  };

  return (
    <div className="card form-card-container">
      <h2>Donor Registration Form</h2>
      <p className="card-subtitle">
        Enter donor verification details. Verified donors will instantly receive a digital ID card.
      </p>

      <form onSubmit={handleSubmit} noValidate className="donor-registration-form">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'input-error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        {/* Age and Blood Group side by side */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="age">Age (18 - 65) *</label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="e.g. 24"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group *</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className={errors.bloodGroup ? 'input-error' : ''}
            >
              <option value="">Select Blood Group</option>
              {allBloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
          </div>
        </div>

        {/* Email and Phone side by side */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. rajesh@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10-digit mobile (e.g. 9876543210)"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        {/* City and Availability */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="e.g. Mumbai, Pune, Thane"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'input-error' : ''}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="availability">Emergency Availability</label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Available">Available (Ready for Emergency)</option>
              <option value="Currently Unavailable">Currently Unavailable</option>
            </select>
          </div>
        </div>

        {/* Last Donation Date */}
        <div className="form-group">
          <label htmlFor="lastDonationDate">Last Donation Date (Optional)</label>
          <input
            id="lastDonationDate"
            name="lastDonationDate"
            type="text"
            placeholder="e.g. 15 Aug 2026 or leave blank for First-Time Donor"
            value={formData.lastDonationDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          Register Blood Donor &rarr;
        </button>
      </form>
    </div>
  );
};

export default DonorRegistrationForm;
