import { useNavigate } from 'react-router-dom';
import { useFamily } from './useFamily';
import { type Family } from './FamilyContext';

type Prop = {
  onClose: () => void;
};

export function FamilyMenu({ onClose }: Prop) {
  const navigate = useNavigate();
  const { families, updateFamily } = useFamily();

  return (
    <>
      {families?.map((fam: Family) => (
        <li
          key={fam.familyId}
          onClick={() => {
            navigate(`family/${fam.familyId}/dashboard`);
            window.scrollTo(0, 0);
            updateFamily(fam);
            onClose();
          }}>
          {fam.familyName}
        </li>
      ))}
      {families.length !== 0 && <hr className="my-1"></hr>}
    </>
  );
}
