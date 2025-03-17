import { createContext, ReactNode, useEffect, useState } from 'react';
import { requestFamilyDetails } from '../../Lib/data';

type Family = {
  familyId: number;
  familyName: string;
};

export type FamilyDetails = {
  families: Family[];
  currentFamily: Family;
  updateFamily: (family: Family) => void;
  isLoading: boolean;
  error: unknown;
};

export const FamilyContext = createContext<FamilyDetails>({
  families: [{ familyId: 0, familyName: '' }],
  currentFamily: { familyId: 0, familyName: '' },
  updateFamily: () => undefined,
  isLoading: true,
  error: '',
});

type Props = {
  children: ReactNode;
};

export function FamilyProvider({ children }: Props) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family>({
    familyId: 0,
    familyName: '',
  });
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = (await requestFamilyDetails()) as Family[];
        setFamilies(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  function updateFamily(family: Family): void {
    setCurrentFamily(family);
  }

  return (
    <FamilyContext.Provider
      value={{ families, currentFamily, updateFamily, isLoading, error }}>
      {children}
    </FamilyContext.Provider>
  );
}
