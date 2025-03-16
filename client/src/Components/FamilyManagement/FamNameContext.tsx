import { createContext, ReactNode, useState } from 'react';

export type FamilyDetails = {
  familyName: string;
  updateName: (name: string) => void;
};

export const FamNameContext = createContext<FamilyDetails>({
  familyName: '',
  updateName: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function FamNameProvider({ children }: Props) {
  const [familyName, setFamilyName] = useState('');

  function updateName(name: string): void {
    setFamilyName(name);
  }

  return (
    <FamNameContext.Provider value={{ familyName, updateName }}>
      {children}
    </FamNameContext.Provider>
  );
}
