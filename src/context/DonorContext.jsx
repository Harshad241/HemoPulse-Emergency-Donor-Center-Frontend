import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialDonors, initialEmergencyRequirements, user } from '../data/mockData';

// 1. Create the unified Donor Context
const DonorContext = createContext();

// Helper to normalize donor object so both Exp 3 and Exp 4 property formats work seamlessly
export const normalizeDonor = (donor) => {
  const isAvailable =
    donor.availability === true ||
    donor.availability === 'Available' ||
    donor.availability === 'true';

  return {
    ...donor,
    fullName: donor.fullName || donor.name || 'Anonymous Donor',
    name: donor.name || donor.fullName || 'Anonymous Donor',
    availability: isAvailable,
    availabilityStatus: isAvailable ? 'Available' : 'Currently Unavailable',
    donations: donor.donations !== undefined ? donor.donations : 1,
    rating: donor.rating !== undefined ? donor.rating : 5.0,
    lastDonationDate: donor.lastDonationDate || donor.lastDonation || 'First-time Donor',
    lastDonation: donor.lastDonation || donor.lastDonationDate || 'First-time Donor',
    email: donor.email || `${(donor.fullName || donor.name || 'donor').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: donor.phone || '9876543210'
  };
};

export const DonorProvider = ({ children }) => {
  // 1. Donors State with localStorage persistence
  const [donors, setDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('hemopulse_donors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeDonor);
        }
      }
    } catch (e) {
      console.warn('Could not read donors from localStorage:', e);
    }
    return initialDonors.map(normalizeDonor);
  });

  // 2. Active Donor for the Official ID Card preview
  const [activeDonor, setActiveDonor] = useState(() => {
    return donors.length > 0 ? donors[0] : null;
  });

  // 3. Emergency Hospital Requirements State
  const [emergencyRequests, setEmergencyRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('hemopulse_emergency_reqs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read emergency requests from localStorage:', e);
    }
    return initialEmergencyRequirements;
  });

  // 4. Contacted Donors State (IDs of donors who received dispatch requests)
  const [contactedDonors, setContactedDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('hemopulse_contacted');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read contacted donors from localStorage:', e);
    }
    return [];
  });

  // 5. Toast Notification State
  const [toast, setToast] = useState(null);

  // Sync Donors with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hemopulse_donors', JSON.stringify(donors));
    } catch (e) {
      console.error('Failed to save donors to localStorage:', e);
    }
  }, [donors]);

  // Sync Emergency Requests with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hemopulse_emergency_reqs', JSON.stringify(emergencyRequests));
    } catch (e) {
      console.error('Failed to save emergency requests to localStorage:', e);
    }
  }, [emergencyRequests]);

  // Sync Contacted Donors with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hemopulse_contacted', JSON.stringify(contactedDonors));
    } catch (e) {
      console.error('Failed to save contacted donors to localStorage:', e);
    }
  }, [contactedDonors]);

  // Trigger Toast Notification
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  const clearToast = () => {
    setToast(null);
  };

  // Automatically dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Add Donor (Controlled Form submission from Exp 4)
  const addDonor = (formData) => {
    const nextNumber = donors.length + 1;
    const newId = formData.id || `DONOR-${String(nextNumber).padStart(3, '0')}`;

    const newDonor = normalizeDonor({
      ...formData,
      id: newId,
      fullName: formData.fullName || formData.name,
      name: formData.fullName || formData.name,
      age: Number(formData.age),
      donations: formData.donations ? Number(formData.donations) : 1,
      rating: formData.rating ? Number(formData.rating) : 5.0,
      lastDonationDate: formData.lastDonationDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastDonation: formData.lastDonationDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      availability: formData.availability === 'Available' || formData.availability === true
    });

    // Immutability: array spread
    setDonors((prev) => [newDonor, ...prev]);
    setActiveDonor(newDonor);
    showToast(`Donor "${newDonor.fullName}" (${newDonor.bloodGroup}) registered successfully! ID: ${newDonor.id}`, 'success');
    return newDonor;
  };

  // Toggle Donor Availability
  const toggleDonorAvailability = (donorId) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const updated = {
            ...d,
            availability: !d.availability,
            availabilityStatus: !d.availability ? 'Available' : 'Currently Unavailable'
          };
          if (activeDonor && activeDonor.id === donorId) {
            setActiveDonor(updated);
          }
          showToast(`Status updated for ${d.fullName}: ${!d.availability ? 'Available' : 'Unavailable'}`, 'info');
          return updated;
        }
        return d;
      })
    );
  };

  // Delete Donor
  const deleteDonor = (donorId) => {
    const target = donors.find((d) => d.id === donorId);
    setDonors((prev) => prev.filter((d) => d.id !== donorId));
    if (activeDonor && activeDonor.id === donorId) {
      const remaining = donors.filter((d) => d.id !== donorId);
      setActiveDonor(remaining.length > 0 ? remaining[0] : null);
    }
    showToast(`Donor record ${target?.fullName || donorId} removed from registry.`, 'warning');
  };

  // Dispatch Emergency Request to Donor (from Exp 3)
  const requestDonor = (donorId) => {
    if (!contactedDonors.includes(donorId)) {
      setContactedDonors((prev) => [...prev, donorId]);
      const targetDonor = donors.find((d) => d.id === donorId);
      if (targetDonor) {
        showToast(
          `🚨 Emergency alert dispatched to ${targetDonor.fullName} (${targetDonor.bloodGroup}) in ${targetDonor.city}!`,
          'critical'
        );
      }
    }
  };

  // Add New Emergency Hospital Requirement (New Feature)
  const addEmergencyRequest = (req) => {
    const newReq = {
      id: `EMERG-${String(emergencyRequests.length + 1).padStart(3, '0')}`,
      timeAgo: 'Just now',
      ...req
    };
    setEmergencyRequests((prev) => [newReq, ...prev]);
    showToast(`New emergency requirement for ${newReq.bloodGroup} at ${newReq.hospital} published!`, 'warning');
  };

  // Delete Emergency Request
  const deleteEmergencyRequest = (reqId) => {
    setEmergencyRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast('Emergency request resolved and archived.', 'info');
  };

  // Reset all to default demo data
  const resetToDemoData = () => {
    localStorage.removeItem('hemopulse_donors');
    localStorage.removeItem('hemopulse_emergency_reqs');
    localStorage.removeItem('hemopulse_contacted');
    const resetDonors = initialDonors.map(normalizeDonor);
    setDonors(resetDonors);
    setActiveDonor(resetDonors[0]);
    setEmergencyRequests(initialEmergencyRequirements);
    setContactedDonors([]);
    showToast('HemoPulse database reset to original demo data.', 'info');
  };

  // Dynamic Calculated Statistics
  const totalCount = donors.length;
  const availableCount = donors.filter((d) => d.availability).length;
  const uniqueBloodGroups = ['All', ...new Set(donors.map((d) => d.bloodGroup))];
  const bloodGroupsCount = new Set(donors.map((d) => d.bloodGroup)).size;
  const contactedCount = contactedDonors.length;

  return (
    <DonorContext.Provider
      value={{
        user,
        donors,
        activeDonor,
        setActiveDonor,
        emergencyRequests,
        contactedDonors,
        toast,
        showToast,
        clearToast,
        addDonor,
        deleteDonor,
        toggleDonorAvailability,
        requestDonor,
        addEmergencyRequest,
        deleteEmergencyRequest,
        resetToDemoData,
        totalCount,
        availableCount,
        uniqueBloodGroups,
        bloodGroupsCount,
        contactedCount
      }}
    >
      {children}
    </DonorContext.Provider>
  );
};

// Custom Hook for direct consumption
export const useDonorContext = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error('useDonorContext must be used within a DonorProvider');
  }
  return context;
};

export default DonorContext;
