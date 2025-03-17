import { useNavigate } from 'react-router-dom';
import { useFamily } from './useFamily';

type Prop = {
  onClose: () => void;
};

export function FamilyMenu({ onClose }: Prop) {
  const navigate = useNavigate();
  const { families, updateFamily } = useFamily();

  return (
    <>
      {families?.map((fam) => (
        <li
          key={fam.familyId}
          onClick={() => {
            navigate(`family/${fam.familyId}/dashboard`),
              updateFamily(fam),
              onClose();
          }}>
          {fam.familyName}
        </li>
      ))}
    </>
  );
}
