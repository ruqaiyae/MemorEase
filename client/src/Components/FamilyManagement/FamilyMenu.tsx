import { useEffect, useState } from 'react';
import { requestFamilyDetails } from '../../Lib/data';
import { Link } from 'react-router-dom';

type Family = {
  familyId: number;
  familyName: string;
};

export function FamilyMenu() {
  const [family, setFamily] = useState<Family[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

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
      <li>
        Error!
        {error instanceof Error ? error.message : 'Unknown Error'}
      </li>
    );

  return (
    <>
      {family?.map((fam) => (
        <li key={fam.familyId}>
          <Link to={`family/${fam.familyId}/dashboard`}>{fam.familyName}</Link>
        </li>
      ))}
    </>
  );
}
