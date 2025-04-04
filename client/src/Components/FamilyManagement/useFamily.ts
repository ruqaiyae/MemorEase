import { useContext } from 'react';
import { FamilyDetails, FamilyContext } from './FamilyContext';

export function useFamily(): FamilyDetails {
  return useContext(FamilyContext);
}
