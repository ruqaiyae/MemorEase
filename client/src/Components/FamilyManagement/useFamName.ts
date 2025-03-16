import { useContext } from 'react';
import { FamilyDetails, FamNameContext } from './FamNameContext';

export function useFamName(): FamilyDetails {
  return useContext(FamNameContext);
}
