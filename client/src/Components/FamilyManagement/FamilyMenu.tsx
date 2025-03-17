import { useEffect, useState } from 'react';
import { requestFamilyDetails } from '../../Lib/data';
import { useNavigate } from 'react-router-dom';
import { useFamName } from './useFamName';

type Prop = {
  onClose: () => void;
};

type Family = {
  familyId: number;
  familyName: string;
};

export function FamilyMenu({ onClose }: Prop) {
  const [family, setFamily] = useState<Family[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { updateName } = useFamName();

  useEffect(() => {
    async function load() {
      try {
        const response = await requestFamilyDetails();
        setFamily(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <li>Loading...</li>;
  if (error)
    return (
      <>
        <li
          onClick={() => {
            navigate('family-form'), onClose();
          }}
          className="cursor-pointer">
          Family Portal
        </li>
      </>
    );

  return (
    <>
      {family?.map((fam) => (
        <li
          key={fam.familyId}
          onClick={() => {
            navigate(`family/${fam.familyId}/dashboard`),
              updateName(fam.familyName),
              onClose();
          }}>
          {fam.familyName}
        </li>
      ))}
    </>
  );
}
