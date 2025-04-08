import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserManagement/useUser';
import { FamilyMenu } from '../FamilyManagement/FamilyMenu';
import { useFamily } from '../FamilyManagement/useFamily';

type Props = {
  isOpen: boolean;
  positionTo: SVGSVGElement | null;
  onClose: () => void;
};
export function ProfileMenu({ isOpen, positionTo, onClose }: Props) {
  const { user, handleSignOut } = useUser();
  const { resetFamilies, isLoading } = useFamily();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const r = positionTo?.getBoundingClientRect();
  const top = r ? `${r.bottom + 4}px` : '8%';

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed top-0 w-screen h-screen bg-white pointer-events-auto opacity-[0.2]"
      />
      <div
        className="bg-[#654A2F] border-2 border-[#654A2F] rounded-lg px-[10px] md:px-[30px] py-[5px]"
        style={{
          width: 'auto',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top,
          right: 0,
        }}>
        <ul className="list-none m-0 py-[3px] font-[Lato] text-[#EBD199] text-right text-[9px] md:text-[15px] cursor-pointer">
          {!user && (
            <>
              <li
                onClick={onClose}
                className="pb-[5px] md:pb-[10px] cursor-pointer">
                <Link to="sign-in">Sign In</Link>
              </li>

              <li onClick={onClose}>
                <Link to="sign-up">Sign Up</Link>
              </li>
            </>
          )}
          {user && (
            <>
              {isLoading && (
                <>
                  <li>Loading...</li>
                </>
              )}
              <FamilyMenu onClose={() => onClose()} />
              <li
                onClick={() => {
                  navigate('family-form');
                  onClose();
                }}
                className="cursor-pointer">
                Family Portal
              </li>
              <hr className="my-1"></hr>
              <li
                onClick={() => {
                  handleSignOut();
                  resetFamilies();
                  onClose();
                }}
                className="py-[3px] md:pb-[10px] cursor-pointer">
                <Link to="/">Sign Out</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>,
    document.body
  );
}
