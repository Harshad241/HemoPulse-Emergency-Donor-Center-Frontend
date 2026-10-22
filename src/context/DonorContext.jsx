import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialDonors, initialEmergencyRequirements, user } from '../data/mockData';

// 1. Create the unified Donor Context
const DonorContext = createContext();

// Helper to normalize donor object so both Exp 3, Exp 4, and Spring Boot backend formats work seamlessly
export const normalizeDonor = (donor) => {
  const isAvailable =
    donor.availability === true ||
    donor.availability === 'Available' ||
    donor.availability === 'true';

  return {
    ...donor,
    id: donor.id ? (String(donor.id).startsWith('DONOR-') ? donor.id : `DONOR-${String(donor.id).padStart(3, '0')}`) : `DONOR-${Math.floor(Math.random() * 900 + 100)}`,
    rawId: donor.id,
    fullName: donor.fullName || donor.name || 'Anonymous Donor',
    name: donor.fullName || donor.name || 'Anonymous Donor',
    age: donor.age ? Number(donor.age) : 25,
    bloodGroup: donor.bloodGroup || 'O+',
    city: donor.city || 'Mumbai',
    phone: donor.phoneNumber || donor.phone || '9876543210',
    phoneNumber: donor.phoneNumber || donor.phone || '9876543210',
    email: donor.email || `${(donor.fullName || donor.name || 'donor').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    availability: isAvailable,
    availabilityStatus: isAvailable ? 'Available' : 'Currently Unavailable',
    donations: donor.donations !== undefined ? donor.donations : 1,
    rating: donor.rating !== undefined ? donor.rating : 5.0,
    lastDonationDate: donor.lastDonationDate || donor.lastDonation || 'First-time Donor',
    lastDonation: donor.lastDonation || donor.lastDonationDate || 'First-time Donor'
  };
};

export const DonorProvider = ({ children }) => {
  // 1. Backend API URL state (persisted in localStorage)
  const [backendUrl, setBackendUrlState] = useState(() => {
    return localStorage.getItem('hemopulse_backend_url') || '';
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // 2. Donors State with localStorage persistence
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

  // 3. Active Donor for the Official ID Card preview
  const [activeDonor, setActiveDonor] = useState(() => {
    return donors.length > 0 ? donors[0] : null;
  });

  // 4. Emergency Hospital Requirements State
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

  // 5. Contacted Donors State (IDs of donors who received dispatch requests)
  const [contactedDonors, setContactedDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('hemopulse_contacted');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read contacted donors from localStorage:', e);
    }
    return [];
  });

  // 6. Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  const clearToast = () => {
    setToast(null);
  };

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

  // Set Backend URL helper
  const setBackendUrl = (url) => {
    const cleanUrl = url ? url.trim().replace(/\/+$/, '') : '';
    setBackendUrlState(cleanUrl);
    if (cleanUrl) {
      localStorage.setItem('hemopulse_backend_url', cleanUrl);
    } else {
      localStorage.removeItem('hemopulse_backend_url');
    }
  };

  // Fetch / Sync with Render Backend
  const syncWithBackend = useCallback(async (urlToTest) => {
    const targetUrl = urlToTest || backendUrl;
    if (!targetUrl) return false;

    setIsConnecting(true);
    try {
      const cleanUrl = targetUrl.replace(/\/+$/, '');
      const response = await fetch(`${cleanUrl}/api/donors`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Server responded with HTTP ${response.status}`);
      }

      const backendData = await response.json();
      if (Array.isArray(backendData)) {
        const normalized = backendData.map(normalizeDonor);
        setDonors(normalized);
        if (normalized.length > 0) {
          setActiveDonor(normalized[0]);
        }
        setBackendUrl(cleanUrl);

        // Also fetch emergency hospital requests from backend
        try {
          const reqRes = await fetch(`${cleanUrl}/api/emergency-requests`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            if (Array.isArray(reqData) && reqData.length > 0) {
              setEmergencyRequests(reqData);
            }
          }
        } catch (e) {
          console.warn('Could not sync emergency requests from backend:', e);
        }

        showToast(`Connected to backend! Loaded ${normalized.length} donors & emergency needs live.`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Backend connection failed:', err);
      showToast(`Could not connect to ${targetUrl}: ${err.message}`, 'critical');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [backendUrl]);

  // Automatically sync on startup if backendUrl is saved
  useEffect(() => {
    if (backendUrl) {
      syncWithBackend(backendUrl);
    }
  }, []);

  // Dismiss toast after 4s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Add Donor (Controlled Form submission from Exp 4 + Backend Sync)
  const addDonor = async (formData) => {
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

    // Update locally immediately
    setDonors((prev) => [newDonor, ...prev]);
    setActiveDonor(newDonor);
    showToast(`Donor "${newDonor.fullName}" (${newDonor.bloodGroup}) registered successfully!`, 'success');

    // If connected to Render backend, send POST request
    if (backendUrl) {
      try {
        const backendPayload = {
          fullName: newDonor.fullName,
          bloodGroup: newDonor.bloodGroup,
          phoneNumber: newDonor.phone,
          email: newDonor.email,
          city: newDonor.city,
          lastDonationDate: newDonor.lastDonationDate,
          age: newDonor.age,
          availability: newDonor.availability,
          donations: newDonor.donations,
          rating: newDonor.rating
        };

        const res = await fetch(`${backendUrl}/api/donors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendPayload)
        });

        if (res.ok) {
          const savedFromBackend = await res.json();
          setDonors((prev) =>
            prev.map((d) => (d.id === newDonor.id ? normalizeDonor({ ...d, ...savedFromBackend, rawId: savedFromBackend.id }) : d))
          );
        }
      } catch (e) {
        console.warn('Failed to sync new donor to backend:', e);
      }
    }

    return newDonor;
  };

  // Toggle Donor Availability
  const toggleDonorAvailability = async (donorId) => {
    let updatedTarget = null;

    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const updated = {
            ...d,
            availability: !d.availability,
            availabilityStatus: !d.availability ? 'Available' : 'Currently Unavailable'
          };
          updatedTarget = updated;
          if (activeDonor && activeDonor.id === donorId) {
            setActiveDonor(updated);
          }
          showToast(`Status updated for ${d.fullName}: ${!d.availability ? 'Available' : 'Unavailable'}`, 'info');
          return updated;
        }
        return d;
      })
    );

    // If connected to Render backend, send PATCH
    if (backendUrl && updatedTarget) {
      try {
        const numericId = updatedTarget.rawId || String(donorId).replace(/\D/g, '');
        if (numericId) {
          await fetch(`${backendUrl}/api/donors/${numericId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ availability: updatedTarget.availability })
          });
        }
      } catch (e) {
        console.warn('Backend patch failed:', e);
      }
    }
  };

  // Delete Donor
  const deleteDonor = async (donorId) => {
    const target = donors.find((d) => d.id === donorId);
    setDonors((prev) => prev.filter((d) => d.id !== donorId));
    if (activeDonor && activeDonor.id === donorId) {
      const remaining = donors.filter((d) => d.id !== donorId);
      setActiveDonor(remaining.length > 0 ? remaining[0] : null);
    }
    showToast(`Donor record ${target?.fullName || donorId} removed from registry.`, 'warning');

    // If connected to Render backend, send DELETE
    if (backendUrl && target) {
      try {
        const numericId = target.rawId || String(donorId).replace(/\D/g, '');
        if (numericId) {
          await fetch(`${backendUrl}/api/donors/${numericId}`, {
            method: 'DELETE'
          });
        }
      } catch (e) {
        console.warn('Backend delete failed:', e);
      }
    }
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

  // Add New Emergency Hospital Requirement (Local + Backend sync)
  const addEmergencyRequest = async (req) => {
    const newReq = {
      id: `EMERG-${String(emergencyRequests.length + 1).padStart(3, '0')}`,
      timeAgo: 'Just now',
      ...req
    };
    setEmergencyRequests((prev) => [newReq, ...prev]);
    showToast(`New emergency requirement for ${newReq.bloodGroup} at ${newReq.hospital} published!`, 'warning');

    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/emergency-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bloodGroup: newReq.bloodGroup,
            hospital: newReq.hospital,
            urgency: newReq.urgency,
            unitsNeeded: newReq.unitsNeeded,
            department: newReq.department,
            timeAgo: newReq.timeAgo
          })
        });
        if (res.ok) {
          const savedReq = await res.json();
          setEmergencyRequests((prev) =>
            prev.map((r) => (r.id === newReq.id ? { ...r, ...savedReq, rawId: savedReq.id } : r))
          );
        }
      } catch (e) {
        console.warn('Failed to sync emergency request to backend:', e);
      }
    }
  };

  // Delete Emergency Request (Local + Backend sync)
  const deleteEmergencyRequest = async (reqId) => {
    const target = emergencyRequests.find((r) => r.id === reqId);
    setEmergencyRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast('Emergency request resolved and archived.', 'info');

    if (backendUrl && target) {
      try {
        const numericId = target.rawId || target.id || String(reqId).replace(/\D/g, '');
        if (numericId) {
          await fetch(`${backendUrl}/api/emergency-requests/${numericId}`, {
            method: 'DELETE'
          });
        }
      } catch (e) {
        console.warn('Failed to delete emergency request from backend:', e);
      }
    }
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
        backendUrl,
        setBackendUrl,
        syncWithBackend,
        isConnecting,
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

export const useDonorContext = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error('useDonorContext must be used within a DonorProvider');
  }
  return context;
};

export default DonorContext;
