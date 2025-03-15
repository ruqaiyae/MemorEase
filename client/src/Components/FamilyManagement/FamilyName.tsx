import { useState, useEffect } from 'react';
import { requestFamilyDetails } from '../../Lib/data';

export function FamilyName() {
  const [familyName, setFamilyName] = useState('');

  useEffect(() => {
    async function loadFamilyName() {
      try {
        const response = await requestFamilyDetails();
        if (!response) throw new Error('Cannot display family name.');
        const [familyName] = response;
        setFamilyName(familyName);
      } catch (err) {
        console.log(err);
      }
    }
    loadFamilyName();
  });

  return <h1>{familyName}</h1>;
}
