import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  readFamily,
  removeFamilyAuth,
  requestFamilyDetails,
  saveFamilyAuth,
} from '../../Lib/data';
import { useUser } from '../UserManagement/useUser';

export type Family = {
  familyId: number;
  familyName: string;
};

export type FamilyDetails = {
  families: Family[];
  currentFamily: Family | undefined;
  updateFamily: (family: Family) => void;
  addFamily: (family: Family) => void;
  resetFamilies: () => void;
  isLoading: boolean;
};

export const FamilyContext = createContext<FamilyDetails>({
  families: [{ familyId: 0, familyName: '' }],
  currentFamily: undefined,
  updateFamily: () => undefined,
  addFamily: () => undefined,
  resetFamilies: () => undefined,
  isLoading: false,
});

type Props = {
  children: ReactNode;
};

export function FamilyProvider({ children }: Props) {
  const { user } = useUser();
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedFamily = readFamily();

    storedFamily && setCurrentFamily(storedFamily);
  }, []);

  useEffect(() => {
    async function load(userId: number | undefined) {
      try {
        setIsLoading(true);
        const response = await requestFamilyDetails(userId);
        setFamilies(response);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.userId) load(user.userId);
  }, [user?.userId]);

  function updateFamily(family: Family): void {
    setCurrentFamily(family);
    saveFamilyAuth(family);
  }

  function addFamily(family: Family) {
    setFamilies([...families, family]);
  }

  function resetFamilies() {
    setFamilies([]);
    setCurrentFamily(undefined);
    removeFamilyAuth();
  }

  return (
    <FamilyContext.Provider
      value={{
        families,
        currentFamily,
        updateFamily,
        addFamily,
        resetFamilies,
        isLoading,
      }}>
      {children}
    </FamilyContext.Provider>
  );
}
