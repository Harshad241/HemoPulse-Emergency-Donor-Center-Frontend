// Blood Compatibility Matrix & Rules for Emergency Dispatch
export const bloodCompatibility = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    type: 'Universal Red Cell Donor',
    description: 'Vital in acute trauma situations when blood typing cannot be delayed.'
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    type: 'High Demand Universal Positive',
    description: 'Most frequently transfused blood type across hospitals.'
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    type: 'Rare Negative Match',
    description: 'Compatible with all A and AB recipients.'
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    type: 'Common Positive Match',
    description: 'One of the most widespread blood groups globally.'
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    type: 'Rare Negative Match',
    description: 'Critical for rare emergency typing in B and AB patients.'
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    type: 'Common Positive Match',
    description: 'High requirement in cardiac and accident surgeries.'
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    type: 'Rarest Blood Group',
    description: 'Universal platelet and plasma donor group.'
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    type: 'Universal Recipient',
    description: 'Can receive red blood cells from any blood group safely.'
  }
};

export const allBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
